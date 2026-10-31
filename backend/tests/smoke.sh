#!/usr/bin/env bash
# Uçtan uca duman testi. Önkoşul: php -S 127.0.0.1:8080 -t . backend/tests/dev-router.php (require_https=false yapılandırmasıyla)
# Kullanım: ADMIN_PASS=… backend/tests/smoke.sh
set -u
B=${BASE:-http://127.0.0.1:8080}; J=$(mktemp); fail=0
ok(){ if [ "$2" = "$3" ]; then echo "ok   $1"; else echo "FAIL $1 (beklenen $3, gelen $2)"; fail=1; fi; }
code(){ curl -s -o /dev/null -w '%{http_code}' "$@"; }
jq_(){ python3 -c "import sys,json; d=json.load(sys.stdin); print(eval(sys.argv[1]))" "$1"; }

V=$(printf 'a%.0s' {1..32}); S=$(printf 'b%.0s' {1..32})
UA='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'
ok "collect bot yok sayılır" "$(code -X POST $B/api/collect -A 'Googlebot/2.1' -d "{\"v\":\"$V\",\"s\":\"$S\",\"ev\":[{\"type\":\"pageview\",\"path\":\"/\"}]}")" 204
ok "collect geçersiz kimlik" "$(code -X POST $B/api/collect -A "$UA" -d '{"v":"x","s":"y","ev":[{"type":"pageview"}]}')" 400
ok "collect pageview" "$(code -X POST $B/api/collect -A "$UA" -H 'CF-IPCountry: TR' -d "{\"v\":\"$V\",\"s\":\"$S\",\"ctx\":{\"ref\":\"https://www.google.com/search?q=x\",\"utm\":{\"source\":\"g\"},\"scr\":\"390x844\",\"lang\":\"tr-TR\"},\"ev\":[{\"type\":\"pageview\",\"path\":\"/paketler/?a=1#x\",\"title\":\"Paketler\"}]}")" 204
ok "collect click+scroll+engage" "$(code -X POST $B/api/collect -A "$UA" -d "{\"v\":\"$V\",\"s\":\"$S\",\"ev\":[{\"type\":\"click\",\"path\":\"/paketler/\",\"label\":\"Pro paketi seç\",\"target\":\"/iletisim/\",\"section\":\"fiyat\"},{\"type\":\"scroll\",\"path\":\"/paketler/\",\"value\":75},{\"type\":\"engage\",\"path\":\"/paketler/\",\"value\":12}]}")" 204
ok "collect bilinmeyen tür atlanır" "$(code -X POST $B/api/collect -A "$UA" -d "{\"v\":\"$V\",\"s\":\"$S\",\"ev\":[{\"type\":\"evil\",\"path\":\"/\"}]}")" 204

ok "admin oturumsuz 401" "$(code $B/api/admin/analytics/overview)" 401
LOGIN=$(curl -s -c $J -X POST $B/api/admin/login -H 'Content-Type: application/json' -d "{\"username\":\"admin\",\"password\":\"${ADMIN_PASS:-test-parola-12345}\"}")
ok "login" "$(echo "$LOGIN" | jq_ "d.get('status')")" ok
CSRF=$(curl -s -b $J $B/api/admin/session | jq_ "d['csrf_token']")
A(){ curl -s -b $J -H "X-CSRF-Token: $CSRF" "$@"; }

OV=$(A "$B/api/admin/analytics/overview?range=7d")
ok "overview oturum=1" "$(echo "$OV" | jq_ "d['totals']['sessions']")" 1
ok "overview pageview=1" "$(echo "$OV" | jq_ "d['totals']['pageviews']")" 1
ok "overview click=1" "$(echo "$OV" | jq_ "d['totals']['clicks']")" 1
ok "path sorgusuz" "$(echo "$OV" | jq_ "d['top_pages'][0]['path']")" /paketler/
ok "referrer" "$(echo "$OV" | jq_ "d['referrers'][0]['k']")" google.com
ok "cihaz" "$(echo "$OV" | jq_ "d['devices'][0]['key']")" mobil
ok "canlı=1" "$(echo "$OV" | jq_ "d['live']")" 1
ok "visitors" "$(A $B/api/admin/analytics/visitors | jq_ "d['total']")" 1
SID=$(A "$B/api/admin/analytics/sessions?range=7d" | jq_ "d['sessions'][0]['id']")
ok "session detail olay sayısı" "$(A $B/api/admin/analytics/sessions/$SID | jq_ "len(d['events'])")" 4
ok "pages scroll" "$(A "$B/api/admin/analytics/pages?range=7d" | jq_ "d['pages'][0]['avg_scroll']")" 75
ok "clicks etiketi" "$(A "$B/api/admin/analytics/clicks?range=7d" | jq_ "d['clicks'][0]['label']")" "Pro paketi seç"
ok "geçersiz aralık 422" "$(code -b $J $B/api/admin/analytics/overview?range=9y)" 422
ok "csrf'siz POST reddi" "$(code -b $J -X POST $B/api/admin/posts -H 'Content-Type: application/json' -d '{}')" 403

P='{"title":"Test Yazısı Ğüşiçö","category":"qr-menu","status":"taslak","published_on":"2026-10-31","body":"<h2>Giriş</h2><p onclick=\"x()\">Merhaba <script>alert(1)</script><a href=\"javascript:alert(1)\">kötü</a> <a href=\"@/paketler/\">iyi</a></p>"}'
R=$(A -X POST $B/api/admin/posts -H 'Content-Type: application/json' -d "$P"); ID=$(echo "$R" | jq_ "d['post']['id']")
ok "yazı slug üretimi" "$(echo "$R" | jq_ "d['post']['slug']")" test-yazisi-gusico
ok "script temizlendi" "$(echo "$R" | jq_ "'script' in d['post']['body'] or 'onclick' in d['post']['body'] or 'javascript' in d['post']['body']")" False
ok "h2 kimliği" "$(echo "$R" | jq_ "'id=\"giris\"' in d['post']['body']")" True
ok "taslak sayfada yok" "$(code $B/blog/test-yazisi-gusico/)" 404
ok "yayın eksik alan 422" "$(code -b $J -H "X-CSRF-Token: $CSRF" -X PATCH $B/api/admin/posts/$ID -H 'Content-Type: application/json' -d "$(echo "$P" | sed 's/"taslak"/"yayinda"/')")" 422
FULL=$(P="$P" python3 -c '
import json,os
p=json.loads(os.environ["P"]); p.update(status="yayinda",seo_title="Test SEO",description="Kısa açıklama",excerpt="Özet",answer="Kısa cevap",cover="qr-menu-nedir",cover_alt="alt",related=["qr-menu-nedir"],faq=[{"q":"S?","a":"C"}],sources=[{"label":"K","url":"https://example.com"}],products=[{"label":"Paketler","path":"paketler/"}])
print(json.dumps(p))
')

ok "yayınla" "$(code -b $J -H "X-CSRF-Token: $CSRF" -X PATCH $B/api/admin/posts/$ID -H 'Content-Type: application/json' -d "$FULL")" 200
ok "yayındaki yazı 200" "$(code $B/blog/test-yazisi-gusico/)" 200
ok "listede görünür" "$(curl -s $B/blog/ | grep -c 'qb-card__link" href="../blog/test-yazisi-gusico/"')" 1
ok "sitemap'te" "$(curl -s $B/sitemap-blog.xml | grep -c '/blog/test-yazisi-gusico/</loc>')" 1
ok "iyi bağlantı göreli" "$(curl -s $B/blog/test-yazisi-gusico/ | grep -c '<a href="../../paketler/">iyi</a>')" 1
ok "sil" "$(code -b $J -H "X-CSRF-Token: $CSRF" -X DELETE $B/api/admin/posts/$ID)" 200

L=$(A -X POST $B/api/admin/licenses -H 'Content-Type: application/json' -d '{"company_name":"Test Restoran","status":"aktif","modules":["restoran-menu","qr-masa"],"expires_on":"2030-01-01"}')
KEY=$(echo "$L" | jq_ "d['api_key']")
ok "lisans anahtarı 40 hex" "$(echo -n "$KEY" | wc -c | tr -d ' ')" 40
ok "validate active" "$(curl -s -X POST $B/v1/validate -H 'Content-Type: application/json' -d "{\"api_key\":\"$KEY\",\"domain\":\"https://www.Musteri.com/menu\"}" | jq_ "d['status']")" active
ok "WP adresi aynı" "$(curl -s -X POST $B/wp-json/qmls/v1/validate -H 'Content-Type: application/json' -d "{\"api_key\":\"$KEY\",\"domain\":\"musteri.com\"}" | jq_ "d['status']")" active
ok "domain_mismatch" "$(curl -s -X POST $B/wp-json/qmls/v1/validate -H 'Content-Type: application/json' -d "{\"api_key\":\"$KEY\",\"domain\":\"baska.com\"}" | jq_ "d['status']")" domain_mismatch
ok "geçersiz anahtar 404" "$(code -X POST $B/v1/validate -H 'Content-Type: application/json' -d '{"api_key":"nope","domain":"a.com"}')" 404
ok "admin dosyaları kapalı" "$(code $B/backend/config.example.php)" 403
rm -f $J; exit $fail
