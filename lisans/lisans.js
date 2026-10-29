/*
 * QR Menu Official lisans yönetimi.
 *
 * API_BASE boştur: istekler sayfanın kendi kaynağındaki /api yoluna gider.
 * Canlı adres bilinmiyor. Oturum çerezi host-only ve API CORS başlığı vermiyor;
 * bu yüzden panel ile API aynı kaynakta olmalı.
 * Anahtar localStorage, sessionStorage veya adrese yazılmaz.
 */
(function () {
  'use strict';

  var API_BASE = '';

  var MODULE_SLUGS = [
    'restoran-menu',
    'yorum-feedback',
    'qr-masa',
    'qr-analiz',
    'qr-galeri',
    'qr-ceviri',
    'qr-chatbot',
    'qr-calisma-saatleri',
    'qr-masa-oturum-guvenligi',
    'qr-acilis-ekrani',
    'header-footer-builder',
    'qr-menu-muhendisligi',
    'qr-servis-paneli'
  ];

  var SEED_TIERS = [
    { slug: 'baslangic', label: 'Başlangıç' },
    { slug: 'pro', label: 'Pro' },
    { slug: 'kurumsal', label: 'Kurumsal' }
  ];

  var STATE_LABELS = {
    kullanilabilir: 'Kullanılabilir',
    pasif: 'Pasif',
    suresi_dolmus: 'Süresi dolmuş',
    arsiv: 'Arşiv',
    aktif: 'Aktif'
  };

  var ACTION_LABELS = {
    olusturuldu: 'Oluşturuldu',
    guncellendi: 'Güncellendi',
    anahtar_goruntulendi: 'Anahtar görüntülendi',
    anahtar_yenilendi: 'Anahtar yenilendi',
    domain_kilidi_kaldirildi: 'Domain kilidi kaldırıldı',
    arsivlendi: 'Arşivlendi',
    domain_kilitlendi: 'Domain kilitlendi',
    surum_guncellendi: 'Sürüm güncellendi'
  };

  var ERROR_TEXT = {
    invalid_credentials: 'Kullanıcı adı veya parola hatalı.',
    unauthenticated: 'Oturum bulunamadı.',
    invalid_csrf: 'Güvenlik belirteci geçersiz.',
    https_required: 'Sunucu bu işlem için HTTPS istiyor.',
    rate_limited: 'İstek sınırı doldu.',
    invalid_json: 'İstek gövdesi geçersiz.',
    invalid_field: 'Girilen alanlar sunucuda kabul edilmedi.',
    invalid_id: 'Lisans numarası geçersiz.',
    not_found: 'Kayıt bulunamadı.',
    confirmation_required: 'Sunucu onay bekliyor.',
    not_locked: 'Bu lisansta domain kilidi yok.',
    archived: 'Arşivli kayıtta bu işlem yapılamaz.',
    conflict: 'Kayıt aynı anda değişti. Ayrıntıyı yeniden açın.',
    key_unavailable: 'Anahtar üretilemedi veya okunamadı.',
    server_error: 'Sunucu hatası oluştu.',
    missing_field: 'Zorunlu alan eksik.',
    method_not_allowed: 'Bu işlem desteklenmiyor.',
    unsupported_media_type: 'İstek JSON olarak gönderilmedi.'
  };

  var state = {
    epoch: 0,
    csrf: '',
    username: '',
    license: null,
    editingId: null,
    plainKey: '',
    listSeq: 0,
    detailSeq: 0,
    auditSeq: 0,
    auditPage: 1,
    auditTotal: 0,
    tiers: [],
    tiersReady: false,
    tiersError: '',
    saving: false,
    modalReturn: null,
    modalAction: null,
    modalPending: false,
    rateUntil: 0,
    list: {
      q: '',
      status: '',
      page: 1,
      perPage: 20,
      sort: 'created_at',
      dir: 'desc',
      total: 0
    }
  };

  document.addEventListener('DOMContentLoaded', boot);

  function $(id) {
    return document.getElementById(id);
  }

  function boot() {
    fillModules();
    bind();
    syncModuleMode();
    syncUnlimited();
    checkSession();
  }

  function bind() {
    $('form-giris').addEventListener('submit', onLogin);
    $('cikis').addEventListener('click', onLogout);
    $('form-filtre').addEventListener('submit', onSearch);
    $('filtre-temizle').addEventListener('click', onClearFilters);
    $('sayfa-once').addEventListener('click', function () { changePage(-1); });
    $('sayfa-sonra').addEventListener('click', function () { changePage(1); });
    $('yeni-lisans').addEventListener('click', openCreate);
    $('form-vazgec').addEventListener('click', backToList);
    $('form-lisans').addEventListener('submit', onSave);
    $('alan-suresiz').addEventListener('change', syncUnlimited);
    $('alan-paket').addEventListener('change', renderPackagePreview);
    $('modul-sablon').addEventListener('change', syncModuleMode);
    $('modul-secim').addEventListener('change', syncModuleMode);
    $('liste-govde').addEventListener('click', onListClick);
    $('ayrinti-geri').addEventListener('click', backToList);
    $('anahtar-goster').addEventListener('click', onReveal);
    $('anahtar-gizle').addEventListener('click', hideKey);
    $('anahtar-kopyala').addEventListener('click', copyKey);
    $('islem-yenile').addEventListener('click', onRegenerate);
    $('islem-kilit').addEventListener('click', onUnlock);
    $('islem-arsiv').addEventListener('click', onArchive);
    $('islem-duzenle').addEventListener('click', function () {
      if (state.license) openEdit(state.license);
    });
    $('denetim-once').addEventListener('click', function () { changeAudit(-1); });
    $('denetim-sonra').addEventListener('click', function () { changeAudit(1); });
    $('onay-iptal').addEventListener('click', function () { closeModal(false); });
    $('onay-tamam').addEventListener('click', confirmModal);
    $('onay').addEventListener('click', function (event) {
      if (event.target === $('onay') && !state.modalPending) closeModal(false);
    });
    document.addEventListener('keydown', onModalKey);
  }

  function fillModules() {
    var box = $('modul-kutu');
    MODULE_SLUGS.forEach(function (slug) {
      var label = document.createElement('label');
      var input = document.createElement('input');
      var name = document.createElement('span');
      input.type = 'checkbox';
      input.value = slug;
      input.id = 'modul-' + slug;
      name.className = 'slug';
      name.textContent = slug;
      label.setAttribute('for', input.id);
      label.appendChild(input);
      label.appendChild(name);
      box.appendChild(label);
    });
  }

  function tierChoices() {
    if (state.tiersReady && !state.tiersError && state.tiers.length) return state.tiers;
    return SEED_TIERS;
  }

  function fillTiers(selected) {
    var select = $('alan-paket');
    var choices = tierChoices();
    var blank = document.createElement('option');
    select.replaceChildren();
    blank.value = '';
    blank.textContent = 'Paket yok';
    select.appendChild(blank);
    choices.forEach(function (tier) {
      var option = document.createElement('option');
      option.value = tier.slug;
      option.textContent = tier.label + ' (' + tier.slug + ')';
      select.appendChild(option);
    });
    if (selected && !choices.some(function (tier) { return tier.slug === selected; })) {
      var extra = document.createElement('option');
      extra.value = selected;
      extra.textContent = selected;
      select.appendChild(extra);
    }
    select.value = selected || '';
    renderPackagePreview();
  }

  function loadTiers() {
    request('GET', '/api/admin/tiers').then(function (res) {
      var out = settle(res);
      if (out.ignored) return;
      if (!out.ok || !out.data || !Array.isArray(out.data.tiers)) {
        state.tiers = [];
        state.tiersReady = true;
        state.tiersError = 'alınamadı';
        renderPackagePreview();
        return;
      }
      state.tiers = out.data.tiers.filter(function (tier) {
        return tier && typeof tier.slug === 'string' && typeof tier.label === 'string' && Array.isArray(tier.modules);
      });
      state.tiersReady = true;
      state.tiersError = '';
      var form = $('ekran-form');
      if (form && !form.hidden) fillTiers($('alan-paket').value);
      else renderPackagePreview();
    });
  }

  function selectedTier() {
    var slug = $('alan-paket').value;
    var found = null;
    state.tiers.forEach(function (tier) {
      if (tier.slug === slug) found = tier;
    });
    return found;
  }

  function renderPackagePreview() {
    var box = $('paket-onizleme');
    if (!box) return;
    var template = $('modul-sablon').checked;
    var slug = $('alan-paket').value;
    var tier = selectedTier();
    var modules = tier && Array.isArray(tier.modules) ? tier.modules.filter(function (item) {
      return typeof item === 'string';
    }) : [];
    box.replaceChildren();
    var note = document.createElement('p');
    if (!slug) {
      note.textContent = 'Paket seçilmedi. Şablon için Başlangıç, Pro veya Kurumsal seçin. Seçim tek başına kayıt yazmaz.';
    } else if (!state.tiersReady) {
      note.textContent = 'Paket modülleri sunucudan yükleniyor.';
    } else if (state.tiersError) {
      note.textContent = 'Paket modülleri alınamadı. Şablon seçiliyse kayıt sırasında sunucu seçilen paketi uygular.';
    } else if (!tier) {
      note.textContent = 'Bu slug için sunucuda şablon yok. Elle seçim, işaretlediğiniz modülleri kaydeder.';
    } else if (template) {
      note.textContent = 'Bu paket seçiliyken kayıt, sunucudaki şablonu kopyalar. Atanacak modüller:';
    } else {
      note.textContent = 'Şablondaki modüller aşağıdadır. Elle seçim açıkken kayıt, işaretlediğiniz kutuları kullanır. Paket seçmek lisansı kaydetmez.';
    }
    box.appendChild(note);
    if (tier && !state.tiersError) {
      var list = document.createElement('ul');
      modules.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'slug';
        li.textContent = item;
        list.appendChild(li);
      });
      box.appendChild(list);
    }
    markAssigned(tier && !state.tiersError ? modules : []);
  }

  function markAssigned(slugs) {
    var selected = {};
    slugs.forEach(function (slug) { selected[slug] = true; });
    MODULE_SLUGS.forEach(function (slug) {
      var input = $('modul-' + slug);
      if (!input || !input.parentElement) return;
      input.parentElement.classList.toggle('is-assigned', !!selected[slug]);
    });
  }

  function request(method, path, body, flags) {
    var epoch = state.epoch;
    flags = flags || {};
    if (!flags.ignoreRate && Date.now() < state.rateUntil) {
      return Promise.resolve({
        status: 429,
        data: { status: 'error', error: 'rate_limited' },
        retryAfter: String(Math.max(1, Math.ceil((state.rateUntil - Date.now()) / 1000))),
        epoch: epoch,
        local: true
      });
    }
    var headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (flags.csrf) headers['X-CSRF-Token'] = state.csrf;
    return fetch(API_BASE + path, {
      method: method,
      credentials: 'same-origin',
      headers: headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    }).then(function (response) {
      return response.text().then(function (raw) {
        var data = null;
        if (raw) {
          try {
            data = JSON.parse(raw);
          } catch (err) {
            data = null;
          }
        }
        return {
          status: response.status,
          data: data,
          retryAfter: response.headers.get('Retry-After'),
          epoch: epoch
        };
      });
    }, function () {
      return { status: 0, data: null, retryAfter: null, epoch: epoch, network: true };
    });
  }

  function settle(res, flags) {
    flags = flags || {};
    if (!res || res.epoch !== state.epoch) return { ignored: true };
    if (res.network || res.status === 0) {
      return { ok: false, message: 'API sunucusuna ulaşılamadı. Kayıtlar gösterilmiyor.' };
    }
    if (res.status === 401 && !flags.login) {
      expire('Oturum sona erdi. Yeniden giriş yapın.');
      return { ignored: true, auth: true };
    }
    if (res.status === 429) {
      var seconds = parseRetry(res.retryAfter);
      armRate(seconds);
      return { ok: false, message: 'İstek sınırı doldu. ' + seconds + ' saniye bekleyin.', rate: true };
    }
    if (res.status === 403 && res.data && res.data.error === 'invalid_csrf') {
      refreshCsrf();
      return { ok: false, message: 'Güvenlik belirteci geçersiz. Belirteç yenilendi; işlemi yeniden deneyin.' };
    }
    if (res.status === 403 && res.data && res.data.error === 'https_required') {
      return { ok: false, message: ERROR_TEXT.https_required };
    }
    if (flags.session && res.status === 200 && res.data && typeof res.data.authenticated === 'boolean') {
      return { ok: true, data: res.data };
    }
    if (!res.data || typeof res.data !== 'object') {
      return { ok: false, message: 'Sunucu JSON yanıtı vermedi. HTTP ' + res.status + '.' };
    }
    if (res.status >= 200 && res.status < 300 && res.data.status === 'ok') {
      return { ok: true, data: res.data };
    }
    return { ok: false, message: errorText(res), status: res.status, data: res.data };
  }

  function errorText(res) {
    var code = res.data && typeof res.data.error === 'string' ? res.data.error : '';
    var fields = res.data && Array.isArray(res.data.fields) ? res.data.fields.filter(function (item) {
      return typeof item === 'string';
    }) : [];
    var base = ERROR_TEXT[code] || ('İstek tamamlanamadı. HTTP ' + res.status + (code ? '. Kod: ' + code : '') + '.');
    if (fields.length) base += ' Alanlar: ' + fields.join(', ') + '.';
    return base;
  }

  function parseRetry(value) {
    var seconds = parseInt(value, 10);
    if (!isFinite(seconds) || seconds < 1) return 60;
    return seconds;
  }

  function armRate(seconds) {
    state.rateUntil = Date.now() + (seconds * 1000);
  }

  function checkSession() {
    setScreen('boot');
    $('acilis-durum').textContent = 'Sunucudan oturum bilgisi isteniyor.';
    request('GET', '/api/admin/session', undefined, { ignoreRate: false }).then(function (res) {
      var out = settle(res, { session: true });
      if (out.ignored) return;
      if (!out.ok) {
        showLogin(out.message);
        return;
      }
      if (out.data.authenticated === true && typeof out.data.csrf_token === 'string' && typeof out.data.username === 'string') {
        enter(out.data.username, out.data.csrf_token);
        return;
      }
      showLogin('');
    });
  }

  function onLogin(event) {
    event.preventDefault();
    if ($('giris-gonder').disabled) return;
    var username = $('giris-kullanici').value;
    var password = $('giris-parola').value;
    $('giris-parola').value = '';
    if (username === '' || password === '') {
      showLogin('Kullanıcı adı ve parola birlikte gerekli.');
      return;
    }
    $('giris-gonder').disabled = true;
    $('giris-gonder').textContent = 'Giriş yapılıyor';
    request('POST', '/api/admin/login', { username: username, password: password }, { login: true }).then(function (res) {
      $('giris-gonder').disabled = false;
      $('giris-gonder').textContent = 'Giriş yap';
      password = '';
      var out = settle(res, { login: true });
      if (out.ignored) return;
      if (!out.ok) {
        showLogin(out.message);
        return;
      }
      if (typeof out.data.csrf_token !== 'string' || typeof out.data.username !== 'string') {
        showLogin('Giriş yanıtı eksik. Panel açılmadı.');
        return;
      }
      enter(out.data.username, out.data.csrf_token);
    });
  }

  function onLogout() {
    if ($('cikis').disabled) return;
    $('cikis').disabled = true;
    request('POST', '/api/admin/logout', {}, { csrf: true }).then(function (res) {
      $('cikis').disabled = false;
      var out = settle(res);
      if (out.auth || out.ignored) return;
      if (!out.ok) {
        setBanner(out.message);
        return;
      }
      expire('Çıkış yapıldı.');
    });
  }

  function enter(username, csrf) {
    state.csrf = csrf;
    state.username = username;
    $('kullanici-adi').textContent = username;
    clearBanner();
    setScreen('panel');
    showPanel('list');
    $('panel-baslik').focus();
    loadTiers();
    loadSummary();
    loadList();
  }

  function expire(message) {
    state.epoch += 1;
    state.csrf = '';
    state.username = '';
    state.license = null;
    state.editingId = null;
    state.tiers = [];
    state.tiersReady = false;
    state.tiersError = '';
    state.saving = false;
    hideKey();
    closeModal(true);
    wipeAdmin();
    showLogin(message);
  }

  function wipeAdmin() {
    $('kullanici-adi').textContent = '';
    ['ozet-total', 'ozet-usable', 'ozet-inactive', 'ozet-expired'].forEach(function (id) {
      $(id).textContent = '—';
    });
    $('ozet-durum').replaceChildren();
    $('liste-govde').replaceChildren();
    $('liste-durum').replaceChildren();
    $('liste-sayfa').hidden = true;
    $('ayrinti-alanlar').replaceChildren();
    $('anahtar-maske').textContent = '';
    $('denetim-govde').replaceChildren();
    $('denetim-durum').replaceChildren();
    $('denetim-sayfa').hidden = true;
    clearBanner();
    setFormMessage('');
    setDetailMessage('');
    resetForm();
  }

  function refreshCsrf() {
    request('GET', '/api/admin/session').then(function (res) {
      var out = settle(res, { session: true });
      if (!out.ok || out.ignored) return;
      if (out.data.authenticated === true && typeof out.data.csrf_token === 'string') {
        state.csrf = out.data.csrf_token;
        if (typeof out.data.username === 'string') {
          state.username = out.data.username;
          $('kullanici-adi').textContent = out.data.username;
        }
        return;
      }
      expire('Oturum sona erdi. Yeniden giriş yapın.');
    });
  }

  function showLogin(message) {
    setScreen('login');
    var box = $('giris-durum');
    if (message) {
      box.hidden = false;
      box.textContent = message;
      announce(message);
    } else {
      box.hidden = true;
      box.textContent = '';
    }
    $('giris-kullanici').focus();
  }

  function setScreen(name) {
    $('ekran-acilis').hidden = name !== 'boot';
    $('ekran-giris').hidden = name !== 'login';
    $('ekran-panel').hidden = name !== 'panel';
  }

  function showPanel(name) {
    $('ekran-liste').hidden = name !== 'list';
    $('ekran-form').hidden = name !== 'form';
    $('ekran-ayrinti').hidden = name !== 'detail';
    if (name !== 'detail') hideKey();
  }

  function setBanner(message) {
    var box = $('uyari');
    box.hidden = false;
    box.textContent = message;
    announce(message);
  }

  function clearBanner() {
    $('uyari').hidden = true;
    $('uyari').textContent = '';
  }

  function setFormMessage(message) {
    var box = $('form-durum');
    box.hidden = !message;
    box.textContent = message || '';
    if (message) announce(message);
  }

  function setDetailMessage(message) {
    var box = $('ayrinti-durum');
    box.hidden = !message;
    box.textContent = message || '';
    if (message) announce(message);
  }

  function announce(message) {
    $('canli').textContent = '';
    $('canli').textContent = message;
  }

  function loadSummary() {
    ['ozet-total', 'ozet-usable', 'ozet-inactive', 'ozet-expired'].forEach(function (id) {
      $(id).textContent = 'yükleniyor';
    });
    setSummaryStatus('Özet yükleniyor.', false);
    var epoch = state.epoch;
    request('GET', '/api/admin/summary').then(function (res) {
      if (epoch !== state.epoch) return;
      var out = settle(res);
      if (out.ignored) return;
      if (!out.ok || !isSummary(out.data)) {
        ['ozet-total', 'ozet-usable', 'ozet-inactive', 'ozet-expired'].forEach(function (id) {
          $(id).textContent = 'alınamadı';
        });
        setSummaryStatus(out.ok ? 'Özet yanıtı beklenen biçimde değil.' : out.message, true);
        return;
      }
      $('ozet-total').textContent = String(out.data.total);
      $('ozet-usable').textContent = String(out.data.usable);
      $('ozet-inactive').textContent = String(out.data.inactive);
      $('ozet-expired').textContent = String(out.data.expired);
      setSummaryStatus('Özet güncellendi.', false);
    });
  }

  function setSummaryStatus(message, isError) {
    var box = $('ozet-durum');
    box.replaceChildren();
    var text = document.createElement('p');
    text.className = isError ? 'banner' : 'hint';
    text.textContent = message;
    box.appendChild(text);
    if (isError) {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn btn-ghost';
      retry.textContent = 'Özeti yeniden dene';
      retry.addEventListener('click', function () {
        loadSummary();
        loadList();
      });
      box.appendChild(retry);
      announce(message);
    }
  }

  function isSummary(data) {
    return data && Number.isInteger(data.total) && Number.isInteger(data.usable) &&
      Number.isInteger(data.inactive) && Number.isInteger(data.expired);
  }

  function onSearch(event) {
    event.preventDefault();
    var q = $('filtre-q').value.trim();
    if (q.length > 191) {
      setListMessage('Arama 191 karakteri aşamaz.', true);
      return;
    }
    state.list.q = q;
    state.list.status = $('filtre-durum').value;
    state.list.perPage = Number($('filtre-boyut').value);
    state.list.sort = $('filtre-sira').value;
    state.list.dir = $('filtre-yon').value;
    state.list.page = 1;
    loadList();
  }

  function onClearFilters() {
    $('filtre-q').value = '';
    $('filtre-durum').value = '';
    $('filtre-boyut').value = '20';
    $('filtre-sira').value = 'created_at';
    $('filtre-yon').value = 'desc';
    state.list = { q: '', status: '', page: 1, perPage: 20, sort: 'created_at', dir: 'desc', total: 0 };
    loadList();
  }

  function changePage(delta) {
    var pages = pageCount(state.list.total, state.list.perPage);
    var next = state.list.page + delta;
    if (next < 1 || next > pages) return;
    state.list.page = next;
    loadList();
  }

  function loadList() {
    var seq = ++state.listSeq;
    setListMessage('Liste yükleniyor.', false);
    $('liste-govde').replaceChildren();
    $('liste-sayfa').hidden = true;
    var params = new URLSearchParams();
    if (state.list.q) params.set('q', state.list.q);
    if (state.list.status) params.set('status', state.list.status);
    params.set('page', String(state.list.page));
    params.set('per_page', String(state.list.perPage));
    params.set('sort', state.list.sort);
    params.set('dir', state.list.dir);
    request('GET', '/api/admin/licenses?' + params.toString()).then(function (res) {
      if (seq !== state.listSeq) return;
      var out = settle(res);
      if (out.ignored) return;
      if (!out.ok) {
        setListMessage(out.message, true);
        return;
      }
      if (!out.data || !Array.isArray(out.data.licenses) || !Number.isInteger(out.data.total)) {
        setListMessage('Liste yanıtı beklenen biçimde değil.', true);
        return;
      }
      state.list.total = out.data.total;
      renderRows(out.data.licenses);
      renderPager();
      if (out.data.licenses.length === 0) {
        setListMessage(state.list.total === 0 ? 'Bu filtreye uyan lisans yok.' : 'Bu sayfada kayıt yok.', false);
      } else {
        setListMessage(out.data.licenses.length + ' lisans listeleniyor.', false);
      }
    });
  }

  function setListMessage(message, isError) {
    var box = $('liste-durum');
    box.replaceChildren();
    var text = document.createElement('p');
    text.className = isError ? 'banner' : 'hint';
    text.textContent = message;
    box.appendChild(text);
    if (isError) {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'btn btn-ghost';
      retry.textContent = 'Yeniden dene';
      retry.addEventListener('click', function () {
        loadSummary();
        loadList();
      });
      box.appendChild(retry);
      announce(message);
    }
  }

  function renderRows(licenses) {
    var body = $('liste-govde');
    body.replaceChildren();
    licenses.forEach(function (license) {
      if (!license || typeof license !== 'object' || !Number.isInteger(license.id)) return;
      var row = document.createElement('tr');
      row.appendChild(cell('Firma', textOf(license.company_name)));
      row.appendChild(cell('Domain', license.domain ? textOf(license.domain) : 'Kilit yok'));
      row.appendChild(cell('Anahtar', textOf(license.key_hint) || '—'));
      var statusCell = document.createElement('td');
      statusCell.setAttribute('data-label', 'Durum');
      statusCell.appendChild(badge(textOf(license.state)));
      var record = document.createElement('div');
      record.className = 'hint';
      record.textContent = 'Kayıt: ' + labelOf(textOf(license.status));
      statusCell.appendChild(record);
      row.appendChild(statusCell);
      var action = document.createElement('td');
      action.setAttribute('data-label', 'İşlem');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-ghost';
      button.textContent = 'Ayrıntı';
      button.setAttribute('data-id', String(license.id));
      action.appendChild(button);
      row.appendChild(action);
      body.appendChild(row);
    });
  }

  function cell(label, value) {
    var td = document.createElement('td');
    var span = document.createElement('span');
    td.setAttribute('data-label', label);
    span.textContent = value;
    td.appendChild(span);
    return td;
  }

  function badge(stateName) {
    var span = document.createElement('span');
    span.className = 'badge ' + (STATE_LABELS[stateName] ? stateName : '');
    span.textContent = labelOf(stateName);
    return span;
  }

  function labelOf(value) {
    if (!value) return '—';
    return STATE_LABELS[value] || value;
  }

  function textOf(value) {
    return typeof value === 'string' ? value : '';
  }

  function renderPager() {
    var pages = pageCount(state.list.total, state.list.perPage);
    var nav = $('liste-sayfa');
    nav.hidden = state.list.total === 0;
    $('sayfa-bilgi').textContent = 'Sayfa ' + state.list.page + ' / ' + pages + '. Toplam ' + state.list.total + '.';
    $('sayfa-once').disabled = state.list.page <= 1;
    $('sayfa-sonra').disabled = state.list.page >= pages;
  }

  function pageCount(total, size) {
    if (!size) return 1;
    return Math.max(1, Math.ceil(total / size));
  }

  function onListClick(event) {
    var button = event.target.closest('button[data-id]');
    if (!button) return;
    openDetail(button.getAttribute('data-id'));
  }

  function backToList() {
    hideKey();
    state.license = null;
    state.editingId = null;
    showPanel('list');
    clearBanner();
    loadSummary();
    loadList();
    $('panel-baslik').focus();
  }

  function openCreate() {
    resetForm();
    state.editingId = null;
    $('form-baslik').textContent = 'Yeni lisans';
    $('alan-durum-aktif').checked = true;
    $('alan-suresiz').checked = true;
    $('modul-sablon').checked = true;
    fillTiers('');
    syncUnlimited();
    syncModuleMode();
    setFormMessage('');
    showPanel('form');
    $('form-baslik').focus();
  }

  function openEdit(license) {
    if (!license || license.state === 'arsiv' || license.archived_at) {
      setDetailMessage('Arşivli kayıt düzenlenemez.');
      return;
    }
    resetForm();
    state.editingId = license.id;
    $('form-baslik').textContent = 'Lisansı düzenle';
    $('alan-firma').value = textOf(license.company_name);
    fillTiers(textOf(license.tier));
    if (license.status === 'pasif') $('alan-durum-pasif').checked = true;
    else $('alan-durum-aktif').checked = true;
    $('alan-baslangic').value = textOf(license.starts_on);
    if (license.expires_on) {
      $('alan-suresiz').checked = false;
      $('alan-bitis').value = textOf(license.expires_on);
    } else {
      $('alan-suresiz').checked = true;
    }
    $('alan-ucret').value = textOf(license.amount_paid);
    $('alan-not').value = textOf(license.notes);
    $('modul-secim').checked = true;
    setCheckedModules(Array.isArray(license.modules) ? license.modules : []);
    syncUnlimited();
    syncModuleMode();
    setFormMessage('');
    showPanel('form');
    $('form-baslik').focus();
  }

  function resetForm() {
    $('form-lisans').reset();
    setCheckedModules([]);
    $('form-kaydet').disabled = false;
    $('form-kaydet').textContent = 'Kaydet';
  }

  function setCheckedModules(slugs) {
    var selected = {};
    slugs.forEach(function (slug) { selected[slug] = true; });
    MODULE_SLUGS.forEach(function (slug) {
      var input = $('modul-' + slug);
      if (input) input.checked = !!selected[slug];
    });
  }

  function syncModuleMode() {
    var template = $('modul-sablon').checked;
    MODULE_SLUGS.forEach(function (slug) {
      var input = $('modul-' + slug);
      if (input) input.disabled = template;
    });
    renderPackagePreview();
  }

  function syncUnlimited() {
    var unlimited = $('alan-suresiz').checked;
    $('alan-bitis').disabled = unlimited;
    if (unlimited) $('alan-bitis').value = '';
  }

  function onSave(event) {
    event.preventDefault();
    if (state.saving) return;
    var payload = buildPayload();
    if (payload.error) {
      setFormMessage(payload.error);
      return;
    }
    state.saving = true;
    $('form-kaydet').disabled = true;
    $('form-kaydet').textContent = 'Kaydediliyor';
    var creating = state.editingId === null;
    var path = creating ? '/api/admin/licenses' : '/api/admin/licenses/' + state.editingId;
    var method = creating ? 'POST' : 'PATCH';
    request(method, path, payload.body, { csrf: true }).then(function (res) {
      state.saving = false;
      $('form-kaydet').disabled = false;
      $('form-kaydet').textContent = 'Kaydet';
      var out = settle(res);
      if (out.ignored) return;
      if (!out.ok) {
        setFormMessage(out.message);
        return;
      }
      if (!out.data.license || typeof out.data.license !== 'object') {
        setFormMessage('Kayıt yanıtı beklenen biçimde değil. Başarı sayılmadı.');
        return;
      }
      state.license = out.data.license;
      hideKey();
      if (creating) {
        if (typeof out.data.api_key !== 'string' || out.data.api_key === '') {
          setDetailMessage('Lisans kaydı döndü fakat anahtar yanıtta yok.');
        } else {
          state.plainKey = out.data.api_key;
          setDetailMessage('Lisans oluşturuldu. Anahtar yalnız bu ekranda gösteriliyor.');
        }
      } else {
        setDetailMessage('Lisans güncellendi.');
      }
      state.auditPage = 1;
      renderDetail();
      showPanel('detail');
      if (state.plainKey) showKeyPanel();
      loadAudit();
      $('ayrinti-baslik').focus();
    });
  }

  function buildPayload() {
    var company = $('alan-firma').value.trim();
    if (company === '' || company.length > 191) {
      return { error: 'Firma adı gerekli ve 191 karakteri aşamaz.' };
    }
    var template = $('modul-sablon').checked;
    var tier = $('alan-paket').value;
    if (template && tier === '') {
      return { error: 'Şablon için seed paketlerinden birini seçin veya modülleri kendiniz işaretleyin.' };
    }
    var unlimited = $('alan-suresiz').checked;
    var starts = $('alan-baslangic').value;
    var expires = unlimited ? '' : $('alan-bitis').value;
    if (!unlimited && expires === '') {
      return { error: 'Bitiş tarihi girin veya süresiz seçin.' };
    }
    if (starts && expires && expires < starts) {
      return { error: 'Bitiş tarihi başlangıçtan önce olamaz.' };
    }
    var amount = $('alan-ucret').value;
    var notes = $('alan-not').value;
    if (amount.length > 64) return { error: 'Ücret 64 karakteri aşamaz.' };
    if (notes.length > 4000) return { error: 'Not 4000 karakteri aşamaz.' };
    var body = {
      company_name: company,
      status: $('alan-durum-pasif').checked ? 'pasif' : 'aktif',
      starts_on: starts || null,
      expires_on: unlimited ? null : expires,
      amount_paid: amount,
      notes: notes
    };
    if (tier) body.tier = tier;
    else if (state.editingId !== null) body.tier = null;
    if (!template) body.modules = selectedModules();
    return { body: body };
  }

  function selectedModules() {
    var chosen = {};
    MODULE_SLUGS.forEach(function (slug) {
      var input = $('modul-' + slug);
      if (input && input.checked) chosen[slug] = true;
    });
    return MODULE_SLUGS.filter(function (slug) { return chosen[slug]; });
  }

  function openDetail(id) {
    if (!/^[1-9][0-9]{0,17}$/.test(id)) {
      setBanner('Lisans numarası geçersiz.');
      return;
    }
    hideKey();
    state.license = null;
    state.auditPage = 1;
    showPanel('detail');
    $('ayrinti-alanlar').replaceChildren();
    ['anahtar-goster', 'islem-yenile', 'islem-kilit', 'islem-duzenle', 'islem-arsiv'].forEach(function (id) {
      $(id).disabled = true;
    });
    $('kilit-durum').textContent = '';
    setDetailMessage('Ayrıntı yükleniyor.');
    var seq = ++state.detailSeq;
    request('GET', '/api/admin/licenses/' + id).then(function (res) {
      if (seq !== state.detailSeq) return;
      var out = settle(res);
      if (out.ignored) return;
      if (!out.ok || !out.data.license) {
        setDetailMessage(out.ok ? 'Ayrıntı yanıtı beklenen biçimde değil.' : out.message);
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'btn btn-ghost';
        retry.textContent = 'Yeniden dene';
        retry.addEventListener('click', function () { openDetail(id); });
        $('ayrinti-durum').appendChild(document.createTextNode(' '));
        $('ayrinti-durum').appendChild(retry);
        return;
      }
      state.license = out.data.license;
      setDetailMessage('');
      renderDetail();
      loadAudit();
      $('ayrinti-baslik').focus();
    });
  }

  function renderDetail() {
    var license = state.license;
    if (!license) return;
    $('ayrinti-baslik').textContent = textOf(license.company_name) || 'Lisans ayrıntısı';
    var dl = $('ayrinti-alanlar');
    dl.replaceChildren();
    addFact(dl, 'Firma', textOf(license.company_name) || '—');
    addFact(dl, 'Paket', license.tier ? textOf(license.tier) : 'Paket yok');
    addFact(dl, 'Modüller', Array.isArray(license.modules) && license.modules.length ? license.modules.map(textOf).join(', ') : 'Yok');
    addFact(dl, 'Durum', labelOf(textOf(license.state)));
    addFact(dl, 'Kayıt durumu', labelOf(textOf(license.status)));
    addFact(dl, 'Başlangıç (UTC)', textOf(license.starts_on) || '—');
    addFact(dl, 'Bitiş (UTC)', license.expires_on ? textOf(license.expires_on) : 'Süresiz');
    addFact(dl, 'Ücret', textOf(license.amount_paid) || '—');
    addFact(dl, 'Not', textOf(license.notes) || '—');
    addFact(dl, 'Domain', license.domain ? textOf(license.domain) : 'Kilit yok');
    addFact(dl, 'Son görülme (UTC)', textOf(license.last_seen_at) || '—');
    addFact(dl, 'İstemci sürümü', textOf(license.client_version) || '—');
    addFact(dl, 'Arşiv (UTC)', textOf(license.archived_at) || '—');
    addFact(dl, 'Oluşturma (UTC)', textOf(license.created_at) || '—');
    addFact(dl, 'Güncelleme (UTC)', textOf(license.updated_at) || '—');
    $('anahtar-maske').textContent = textOf(license.key_hint) || '—';
    $('anahtar-goster').disabled = false;
    var archived = license.state === 'arsiv' || !!license.archived_at;
    $('islem-yenile').disabled = archived;
    $('islem-duzenle').disabled = archived;
    $('islem-arsiv').disabled = archived;
    $('islem-kilit').disabled = archived || !license.domain;
    $('kilit-durum').textContent = archived
      ? 'Arşivli kayıtta yenileme, düzenleme, kilit kaldırma ve yeniden arşivleme kapalı. Anahtar görüntüleme açık.'
      : (license.domain ? 'Domain kilidi: ' + textOf(license.domain) : 'Domain kilidi yok.');
    if (state.plainKey) showKeyPanel();
    else hideKey();
  }

  function addFact(dl, label, value) {
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }

  function showKeyPanel() {
    $('anahtar-deger').textContent = state.plainKey;
    $('anahtar-panel').hidden = false;
  }

  function hideKey() {
    state.plainKey = '';
    if ($('anahtar-deger')) $('anahtar-deger').textContent = '';
    if ($('anahtar-panel')) $('anahtar-panel').hidden = true;
  }

  function onReveal() {
    if (!state.license || $('anahtar-goster').disabled) return;
    $('anahtar-goster').disabled = true;
    request('POST', '/api/admin/licenses/' + state.license.id + '/reveal-key', {}, { csrf: true }).then(function (res) {
      $('anahtar-goster').disabled = false;
      var out = settle(res);
      if (out.ignored) return;
      if (!out.ok || typeof out.data.api_key !== 'string' || out.data.api_key === '') {
        setDetailMessage(out.ok ? 'Anahtar yanıtta yok. Görüntüleme başarılı sayılmadı.' : out.message);
        return;
      }
      state.plainKey = out.data.api_key;
      showKeyPanel();
      setDetailMessage('');
      loadAudit();
      $('anahtar-gizle').focus();
    });
  }

  function copyKey() {
    if (!state.plainKey || !navigator.clipboard || !navigator.clipboard.writeText) {
      setDetailMessage('Panoya kopyalanamadı. Anahtarı ekrandan seçin.');
      return;
    }
    var value = state.plainKey;
    navigator.clipboard.writeText(value).then(function () {
      announce('Anahtar panoya kopyalandı.');
    }, function () {
      setDetailMessage('Panoya kopyalanamadı. Anahtarı ekrandan seçin.');
    });
  }

  function onRegenerate() {
    if (!state.license || $('islem-yenile').disabled) return;
    openModal({
      title: 'Anahtarı yenile',
      text: 'Bu lisansın anahtarı değişir. Eski anahtar doğrulamada geçersiz olur.',
      confirm: 'Anahtarı yenile',
      action: function () {
        return request('POST', '/api/admin/licenses/' + state.license.id + '/regenerate-key', { confirm: true }, { csrf: true }).then(function (res) {
          var out = settle(res);
          if (out.ignored || out.auth) return { ok: false, auth: true };
          if (!out.ok || typeof out.data.api_key !== 'string' || !out.data.license) {
            return { ok: false, message: out.ok ? 'Yeni anahtar yanıtta yok. Yenileme başarılı sayılmadı.' : out.message };
          }
          state.plainKey = out.data.api_key;
          state.license = out.data.license;
          renderDetail();
          loadAudit();
          setDetailMessage('Anahtar yenilendi. Yeni anahtar yalnız bu ekranda gösteriliyor.');
          return { ok: true };
        });
      }
    });
  }

  function onUnlock() {
    if (!state.license || $('islem-kilit').disabled) return;
    openModal({
      title: 'Domain kilidini kaldır',
      text: 'Kilitli domain kaldırılır. Sonraki doğrulama yeni bir domain kilitleyebilir. Domain: ' + textOf(state.license.domain),
      confirm: 'Kilidi kaldır',
      action: function () {
        return request('POST', '/api/admin/licenses/' + state.license.id + '/unlock-domain', { confirm: true }, { csrf: true }).then(function (res) {
          var out = settle(res);
          if (out.ignored || out.auth) return { ok: false, auth: true };
          if (!out.ok || !out.data.license) {
            return { ok: false, message: out.message || 'Kilit kaldırılamadı.' };
          }
          state.license = out.data.license;
          renderDetail();
          loadAudit();
          setDetailMessage('Domain kilidi kaldırıldı.');
          return { ok: true };
        });
      }
    });
  }

  function onArchive() {
    if (!state.license || $('islem-arsiv').disabled) return;
    openModal({
      title: 'Lisansı arşivle',
      text: 'Lisans arşivlenir ve listeden çıkar. Kayıt silinmez.',
      confirm: 'Arşivle',
      action: function () {
        return request('POST', '/api/admin/licenses/' + state.license.id + '/archive', {}, { csrf: true }).then(function (res) {
          var out = settle(res);
          if (out.ignored || out.auth) return { ok: false, auth: true };
          if (!out.ok || !out.data.license) {
            return { ok: false, message: out.message || 'Arşivleme tamamlanamadı.' };
          }
          state.license = out.data.license;
          renderDetail();
          loadAudit();
          setDetailMessage('Lisans arşivlendi.');
          return { ok: true };
        });
      }
    });
  }

  function loadAudit() {
    if (!state.license) return;
    var seq = ++state.auditSeq;
    var id = state.license.id;
    $('denetim-durum').textContent = 'Denetim geçmişi yükleniyor.';
    $('denetim-govde').replaceChildren();
    var params = new URLSearchParams();
    params.set('license', String(id));
    params.set('page', String(state.auditPage));
    params.set('per_page', '20');
    request('GET', '/api/admin/audit?' + params.toString()).then(function (res) {
      if (seq !== state.auditSeq) return;
      var out = settle(res);
      if (out.ignored) return;
      if (!out.ok || !out.data || !Array.isArray(out.data.events)) {
        $('denetim-durum').textContent = '';
        var text = document.createElement('p');
        text.className = 'banner';
        text.textContent = out.ok ? 'Denetim yanıtı beklenen biçimde değil.' : out.message;
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'btn btn-ghost';
        retry.textContent = 'Yeniden dene';
        retry.addEventListener('click', loadAudit);
        $('denetim-durum').appendChild(text);
        $('denetim-durum').appendChild(retry);
        return;
      }
      state.auditTotal = Number.isInteger(out.data.total) ? out.data.total : out.data.events.length;
      renderAudit(out.data.events);
      var pages = pageCount(state.auditTotal, 20);
      $('denetim-sayfa').hidden = state.auditTotal === 0;
      $('denetim-bilgi').textContent = 'Sayfa ' + state.auditPage + ' / ' + pages + '. Toplam ' + state.auditTotal + '.';
      $('denetim-once').disabled = state.auditPage <= 1;
      $('denetim-sonra').disabled = state.auditPage >= pages;
      $('denetim-durum').textContent = out.data.events.length === 0 ? 'Denetim kaydı yok.' : out.data.events.length + ' olay listeleniyor.';
    });
  }

  function renderAudit(events) {
    var body = $('denetim-govde');
    body.replaceChildren();
    events.forEach(function (event) {
      if (!event || typeof event !== 'object') return;
      var row = document.createElement('tr');
      row.appendChild(cell('Zaman (UTC)', textOf(event.occurred_at) || '—'));
      var action = textOf(event.action);
      var label = ACTION_LABELS[action] ? ACTION_LABELS[action] + ' (' + action + ')' : (action || '—');
      row.appendChild(cell('İşlem', label));
      row.appendChild(cell('Kim', textOf(event.actor) || '—'));
      row.appendChild(cell('Ayrıntı', textOf(event.detail) || '—'));
      body.appendChild(row);
    });
  }

  function changeAudit(delta) {
    var pages = pageCount(state.auditTotal, 20);
    var next = state.auditPage + delta;
    if (next < 1 || next > pages) return;
    state.auditPage = next;
    loadAudit();
  }

  function openModal(options) {
    state.modalReturn = document.activeElement;
    state.modalAction = options.action;
    state.modalPending = false;
    $('onay-baslik').textContent = options.title;
    $('onay-metin').textContent = options.text;
    $('onay-tamam').textContent = options.confirm;
    $('onay-hata').hidden = true;
    $('onay-hata').textContent = '';
    $('onay-iptal').disabled = false;
    $('onay-tamam').disabled = false;
    $('onay').hidden = false;
    document.body.classList.add('modal-open');
    try {
      $('icerik').inert = true;
    } catch (err) {
      $('icerik').setAttribute('inert', '');
    }
    $('onay-iptal').focus();
  }

  function closeModal(fromExpire) {
    if ($('onay').hidden && !state.modalAction) return;
    $('onay').hidden = true;
    state.modalPending = false;
    state.modalAction = null;
    document.body.classList.remove('modal-open');
    if ($('icerik')) {
      try {
        $('icerik').inert = false;
      } catch (err) {
        $('icerik').removeAttribute('inert');
      }
    }
    var back = state.modalReturn;
    state.modalReturn = null;
    if (!fromExpire && back && typeof back.focus === 'function') back.focus();
  }

  function confirmModal() {
    if (state.modalPending || !state.modalAction) return;
    state.modalPending = true;
    $('onay-tamam').disabled = true;
    $('onay-iptal').disabled = true;
    $('onay-hata').hidden = true;
    var action = state.modalAction;
    Promise.resolve(action()).then(function (result) {
      if (!result || result.auth) return;
      if (result.ok === false) {
        state.modalPending = false;
        $('onay-tamam').disabled = false;
        $('onay-iptal').disabled = false;
        $('onay-hata').hidden = false;
        $('onay-hata').textContent = result.message || 'İşlem tamamlanamadı.';
        $('onay-hata').focus();
        return;
      }
      closeModal(false);
    }, function () {
      state.modalPending = false;
      $('onay-tamam').disabled = false;
      $('onay-iptal').disabled = false;
      $('onay-hata').hidden = false;
      $('onay-hata').textContent = 'İşlem tamamlanamadı.';
    });
  }

  function onModalKey(event) {
    if ($('onay').hidden) return;
    if (event.key === 'Escape') {
      if (state.modalPending) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      closeModal(false);
      return;
    }
    if (event.key !== 'Tab') return;
    var nodes = $('onay').querySelectorAll('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled])');
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
})();
