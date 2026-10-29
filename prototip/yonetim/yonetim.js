(function () {
  'use strict';

  var MODULES = [
    ['restoran-menu', 'Restoran Menü'],
    ['yorum-feedback', 'Yorum ve geri bildirim'],
    ['qr-masa', 'QR Masa'],
    ['qr-analiz', 'İstatistikler'],
    ['qr-galeri', 'Galeri'],
    ['qr-ceviri', 'Çeviri'],
    ['qr-chatbot', 'Menü asistanı'],
    ['qr-calisma-saatleri', 'Çalışma saatleri'],
    ['qr-masa-oturum-guvenligi', 'Masa oturum güvenliği'],
    ['qr-acilis-ekrani', 'Açılış ekranı'],
    ['header-footer-builder', 'Üst ve alt bilgi'],
    ['qr-menu-muhendisligi', 'Menü mühendisliği'],
    ['qr-servis-paneli', 'Servis paneli']
  ];

  var TIERS = [
    { slug: 'baslangic', label: 'Başlangıç' },
    { slug: 'pro', label: 'Pro' },
    { slug: 'kurumsal', label: 'Kurumsal' }
  ];

  var TIER_MODULES = {
    baslangic: ['restoran-menu', 'qr-masa', 'yorum-feedback'],
    pro: ['restoran-menu', 'qr-masa', 'yorum-feedback', 'qr-analiz', 'qr-galeri', 'qr-ceviri', 'qr-calisma-saatleri', 'qr-acilis-ekrani', 'header-footer-builder'],
    kurumsal: MODULES.map(function (item) { return item[0]; })
  };

  var STATE_LABELS = {
    kullanilabilir: 'Kullanılabilir',
    pasif: 'Pasif',
    suresi_dolmus: 'Süresi dolmuş',
    arsiv: 'Arşiv'
  };

  var NAV = [
    ['genel', 'Genel bakış'],
    ['isletmeler', 'İşletmeler'],
    ['lisanslar', 'Lisanslar'],
    ['abonelikler', 'Abonelikler'],
    ['moduller', 'Modüller']
  ];

  var records = [
    row(1, 'Sentetik Kafe Ada', 'kafeada.example', 'aktif', 'pro', '2026-01-01', '2027-06-30', '1490.00', 'Örnek kafe kaydı.', TIER_MODULES.pro),
    row(2, 'Sentetik Pastane', 'pastane.example', 'pasif', 'pro', '2026-02-01', '', '0.00', 'Örnek pasif kayıt.', TIER_MODULES.pro),
    row(3, 'Sentetik Otel', 'otel.example', 'aktif', '', '2025-01-01', '2025-12-31', '749.00', 'Örnek süresi dolmuş kayıt. Paket seçilmedi.', ['restoran-menu', 'qr-masa']),
    row(4, 'Sentetik Test Fırın', 'firin.example', 'pasif', 'baslangic', '2026-03-01', '2026-11-30', '749.00', 'Örnek başlangıç kaydı.', TIER_MODULES.baslangic),
    row(5, 'Sentetik Balık Restoran', 'balik.example', 'aktif', 'kurumsal', '2026-02-01', '2027-02-01', '2990.00', 'Örnek kurumsal kayıt.', TIER_MODULES.kurumsal),
    row(6, 'Sentetik Kafe Liman', 'liman.example', 'aktif', 'baslangic', '2026-04-01', '', '749.00', 'Örnek süresiz kayıt.', TIER_MODULES.baslangic)
  ];

  var ui = { q: '', notice: '' };
  var menuReturn = null;

  function row(id, company, domain, status, tier, starts, expires, amount, notes, modules) {
    return {
      id: id,
      company_name: company,
      domain: domain,
      status: status,
      tier: tier,
      starts_on: starts,
      expires_on: expires,
      amount_paid: amount,
      notes: notes,
      modules: modules.slice(),
      archived_at: '',
      last_seen_at: '',
      client_version: ''
    };
  }

  function h(tag, props, kids) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) {
      var value = props[key];
      if (value == null || value === false) return;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key.slice(0, 2) === 'on' && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
      else node.setAttribute(key, String(value));
    });
    (kids || []).forEach(function (kid) {
      if (kid == null) return;
      node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    });
    return node;
  }

  function moduleName(slug) {
    var found = MODULES.filter(function (item) { return item[0] === slug; })[0];
    return found ? found[1] : slug;
  }

  function tierName(slug) {
    var found = TIERS.filter(function (item) { return item.slug === slug; })[0];
    return found ? found.label : 'Paket yok';
  }

  function expired(expiresOn) {
    if (!expiresOn) return false;
    var end = Date.parse(expiresOn + 'T23:59:59Z');
    return !Number.isNaN(end) && end < Date.now();
  }

  function stateOf(record) {
    if (record.archived_at) return 'arsiv';
    if (record.status !== 'aktif') return 'pasif';
    if (expired(record.expires_on)) return 'suresi_dolmus';
    return 'kullanilabilir';
  }

  function stateLabel(record) {
    return STATE_LABELS[stateOf(record)] || stateOf(record);
  }

  function money(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) number = 0;
    return number.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
  }

  function period(record) {
    var start = record.starts_on || '—';
    var end = record.expires_on ? record.expires_on : 'Süresiz';
    return start + ' → ' + end;
  }

  function findRecord(id) {
    return records.filter(function (item) { return item.id === id; })[0] || null;
  }

  function matchesQuery(record) {
    var q = ui.q.trim().toLocaleLowerCase('tr');
    if (!q) return true;
    return (record.company_name + ' ' + (record.domain || '')).toLocaleLowerCase('tr').indexOf(q) !== -1;
  }

  function route() {
    var hash = (location.hash || '#genel').replace(/^#/, '');
    var parts = hash.split('/').filter(Boolean);
    var name = parts[0] || 'genel';
    if (name === 'isletme' && parts[1]) {
      return { name: parts[2] === 'duzenle' ? 'duzenle' : 'detay', id: Number(parts[1]), section: 'isletmeler' };
    }
    if (name === 'modul' && parts[1]) {
      return { name: 'modul', slug: decodeURIComponent(parts[1]), section: 'moduller' };
    }
    var known = NAV.some(function (item) { return item[0] === name; });
    return { name: known ? name : 'genel', section: known ? name : 'genel' };
  }

  function titleFor(current) {
    if (current.name === 'detay' || current.name === 'duzenle') {
      var record = findRecord(current.id);
      return record ? record.company_name : 'İşletme';
    }
    if (current.name === 'modul') return moduleName(current.slug);
    var item = NAV.filter(function (entry) { return entry[0] === current.name; })[0];
    return item ? item[1] : 'Genel bakış';
  }

  function renderNav(current) {
    var nav = document.getElementById('menu');
    nav.replaceChildren.apply(nav, NAV.map(function (item) {
      return h('a', {
        class: 'nav-link',
        href: '#' + item[0],
        text: item[1],
        'aria-current': current.section === item[0] ? 'page' : false
      });
    }));
  }

  function badge(record) {
    return h('span', { class: 'durum ' + stateOf(record), text: stateLabel(record) });
  }

  function cell(label, node) {
    var span = h('span', { 'data-label': label });
    span.appendChild(typeof node === 'string' ? document.createTextNode(node) : node);
    return span;
  }

  function table(kind, headers, rows) {
    var head = h('div', { class: 'satir baslik', role: 'row' }, headers.map(function (label) {
      return h('span', { text: label });
    }));
    return h('div', { class: 'liste ' + kind, role: 'table' }, [head].concat(rows));
  }

  function notice() {
    if (!ui.notice) return null;
    var text = ui.notice;
    ui.notice = '';
    return h('p', { class: 'bildirim', role: 'status', text: text });
  }

  function backLink(href, label) {
    return h('a', { class: 'btn-yazi', href: href, text: label });
  }

  function renderOverview() {
    var usable = records.filter(function (item) { return stateOf(item) === 'kullanilabilir'; });
    var subscriptions = records.filter(function (item) { return item.tier && !item.archived_at; });
    var total = records.reduce(function (sum, item) { return sum + (Number(item.amount_paid) || 0); }, 0);
    var page = document.createElement('div');
    page.appendChild(notice() || document.createTextNode(''));
    page.appendChild(h('div', { class: 'ozet' }, [
      kpi('İşletme sayısı', String(records.length)),
      kpi('Aktif lisanslar', String(usable.length)),
      kpi('Abonelikler', String(subscriptions.length)),
      kpi('Kayıtlı ödeme toplamı', money(total))
    ]));
    page.appendChild(h('p', { class: 'yardim', text: 'Aktif lisans, kullanılabilir durumdaki örnek kayıttır. Abonelik, paket atanmış kayıttır. Tutarlar örnek ödeme alanıdır; tahsilat yapılmaz.' }));
    page.appendChild(h('h2', { text: 'Paket dağılımı' }));
    page.appendChild(h('div', { class: 'kartlar' }, TIERS.map(function (tier) {
      var count = records.filter(function (item) { return item.tier === tier.slug; }).length;
      return kpi(tier.label, String(count) + ' kayıt');
    })));
    page.appendChild(h('h2', { text: 'Son işletmeler' }));
    page.appendChild(businessTable(records.slice(0, 4), false));
    return page;
  }

  function kpi(label, value) {
    return h('article', { class: 'kart' }, [
      h('span', { text: label }),
      h('strong', { text: value })
    ]);
  }

  function businessTable(list, searchable) {
    var wrap = document.createElement('div');
    if (searchable) {
      var form = h('form', { class: 'ara', role: 'search', onsubmit: function (event) { event.preventDefault(); } }, [
        h('input', {
          type: 'search',
          value: ui.q,
          placeholder: 'İşletme veya domain ara',
          'aria-label': 'İşletme veya domain ara',
          oninput: function (event) {
            ui.q = event.target.value;
            paint();
            var field = document.querySelector('.ara input');
            if (field) {
              field.focus();
              var end = field.value.length;
              field.setSelectionRange(end, end);
            }
          }
        })
      ]);
      wrap.appendChild(form);
    }
    var shown = list.filter(matchesQuery);
    if (!shown.length) {
      wrap.appendChild(h('p', { class: 'muted', text: 'Bu aramaya uyan örnek işletme yok.' }));
      return wrap;
    }
    wrap.appendChild(table('', ['Firma', 'Domain', 'Paket', 'Durum', 'İşlem'], shown.map(function (record) {
      return h('a', { class: 'satir', href: '#isletme/' + record.id }, [
        cell('Firma', record.company_name),
        cell('Domain', record.domain || '—'),
        cell('Paket', tierName(record.tier)),
        cell('Durum', badge(record)),
        cell('İşlem', 'Ayrıntı')
      ]);
    })));
    return wrap;
  }

  function renderBusinesses() {
    var page = document.createElement('div');
    page.appendChild(notice() || h('p', { class: 'yardim', text: 'Liste, lisans kaydındaki işletme adı ve domain ile aranır.' }));
    page.appendChild(businessTable(records, true));
    return page;
  }

  function renderLicenses() {
    var page = document.createElement('div');
    page.appendChild(h('p', { class: 'yardim', text: 'Her satır bir lisans kaydıdır. İşletme eşleşmesi, kayıttaki firma ve domaindir.' }));
    page.appendChild(table('lisans', ['No', 'İşletme', 'Durum', 'Süre', 'Eşleşme'], records.map(function (record) {
      return h('a', { class: 'satir', href: '#isletme/' + record.id }, [
        cell('No', String(record.id)),
        cell('İşletme', record.company_name),
        cell('Durum', badge(record)),
        cell('Süre', period(record)),
        cell('Eşleşme', record.domain || 'Domain yok')
      ]);
    })));
    return page;
  }

  function renderSubscriptions() {
    var page = document.createElement('div');
    page.appendChild(h('p', { class: 'yardim', text: 'Abonelik durumu, lisansın kullanılabilir, pasif veya süresi dolmuş halidir. Paketler Başlangıç, Pro ve Kurumsal’dır.' }));
    page.appendChild(table('abonelik', ['İşletme', 'Paket', 'Süre', 'Durum', 'Ödenen'], records.map(function (record) {
      return h('a', { class: 'satir', href: '#isletme/' + record.id }, [
        cell('İşletme', record.company_name),
        cell('Paket', tierName(record.tier)),
        cell('Süre', period(record)),
        cell('Durum', badge(record)),
        cell('Ödenen', money(record.amount_paid))
      ]);
    })));
    return page;
  }

  function renderModules() {
    var page = document.createElement('div');
    page.appendChild(h('p', { class: 'yardim', text: 'Modül listesi lisans şemasındaki 13 kayıtla aynıdır. Paket ilişkisi şablon tablosundan okunur.' }));
    page.appendChild(h('div', { class: 'kartlar' }, MODULES.map(function (item) {
      var slug = item[0];
      var owners = TIERS.filter(function (tier) {
        return TIER_MODULES[tier.slug].indexOf(slug) !== -1;
      });
      return h('a', { class: 'kart modul', href: '#modul/' + encodeURIComponent(slug) }, [
        h('strong', { text: item[1] }),
        h('span', { text: slug }),
        h('span', { class: 'rozetler' }, owners.map(function (tier) {
          return h('span', { class: 'rozet', text: tier.label });
        }))
      ]);
    })));
    return page;
  }

  function renderModule(slug) {
    var page = document.createElement('div');
    if (!MODULES.some(function (item) { return item[0] === slug; })) {
      page.appendChild(h('p', { text: 'Bu modül listede yok.' }));
      page.appendChild(backLink('#moduller', 'Modüllere dön'));
      return page;
    }
    var owners = TIERS.filter(function (tier) { return TIER_MODULES[tier.slug].indexOf(slug) !== -1; });
    var users = records.filter(function (record) { return record.modules.indexOf(slug) !== -1; });
    page.appendChild(h('p', { class: 'muted', text: slug }));
    page.appendChild(h('h2', { text: 'Paketler' }));
    page.appendChild(h('div', { class: 'rozetler' }, owners.length ? owners.map(function (tier) {
      return h('span', { class: 'rozet', text: tier.label });
    }) : [h('span', { class: 'muted', text: 'Şablonda yok' })]));
    page.appendChild(h('h2', { text: 'Örnek kayıtlarda' }));
    if (!users.length) page.appendChild(h('p', { class: 'muted', text: 'Bu modül örnek kayıtlarda seçili değil.' }));
    else page.appendChild(businessTable(users, false));
    page.appendChild(h('div', { class: 'eylem' }, [backLink('#moduller', 'Modüllere dön')]));
    return page;
  }

  function facts(record) {
    var list = h('div', { class: 'kartlar' }, [
      fact('Durum', stateLabel(record)),
      fact('Paket', tierName(record.tier)),
      fact('Domain', record.domain || '—'),
      fact('Süre', period(record)),
      fact('Ödenen tutar', money(record.amount_paid)),
      fact('Lisans no', String(record.id))
    ]);
    return list;
  }

  function fact(label, value) {
    return h('article', { class: 'kart' }, [
      h('span', { text: label }),
      h('strong', { text: value })
    ]);
  }

  function renderDetail(id) {
    var record = findRecord(id);
    var page = document.createElement('div');
    page.appendChild(notice() || document.createTextNode(''));
    if (!record) {
      page.appendChild(h('p', { text: 'Örnek kayıt bulunamadı.' }));
      page.appendChild(backLink('#isletmeler', 'İşletmelere dön'));
      return page;
    }
    page.appendChild(facts(record));
    page.appendChild(h('h2', { text: 'Modüller' }));
    page.appendChild(h('div', { class: 'rozetler' }, record.modules.map(function (slug) {
      return h('a', { class: 'rozet', href: '#modul/' + encodeURIComponent(slug), text: moduleName(slug) });
    })));
    page.appendChild(h('h2', { text: 'Not' }));
    page.appendChild(h('p', { text: record.notes || 'Not yok.' }));
    page.appendChild(h('p', { class: 'yardim', text: 'Domain, lisans doğrulamasının kilit alanıdır. Anahtar bu ekranda gösterilmez.' }));
    page.appendChild(h('div', { class: 'eylem' }, [
      h('a', { class: 'btn', href: '#isletme/' + record.id + '/duzenle', text: 'Düzenle' }),
      backLink('#isletmeler', 'İşletmelere dön'),
      backLink('#lisanslar', 'Lisanslara dön')
    ]));
    return page;
  }

  function renderEdit(id) {
    var record = findRecord(id);
    var page = document.createElement('div');
    if (!record) {
      page.appendChild(h('p', { text: 'Örnek kayıt bulunamadı.' }));
      return page;
    }
    var error = h('p', { class: 'durum hata', role: 'alert', hidden: 'hidden' });
    var form = h('form', { class: 'panel', onsubmit: function (event) { event.preventDefault(); save(record, form, error); } });
    form.appendChild(error);
    form.appendChild(field('Firma', 'company_name', 'text', record.company_name, true));
    form.appendChild(h('p', { class: 'yardim', text: 'Domain: ' + (record.domain || '—') + '. Bu örnek formda domain değişmez.' }));
    form.appendChild(selectField('Lisans durumu', 'status', [
      ['aktif', 'Aktif'],
      ['pasif', 'Pasif']
    ], record.status));
    form.appendChild(selectField('Paket', 'tier', [['', 'Paket yok']].concat(TIERS.map(function (tier) {
      return [tier.slug, tier.label];
    })), record.tier));
    var dates = h('div', { class: 'iki' }, [
      field('Başlangıç', 'starts_on', 'date', record.starts_on, false),
      field('Bitiş', 'expires_on', 'date', record.expires_on, false)
    ]);
    form.appendChild(dates);
    form.appendChild(field('Ödenen tutar', 'amount_paid', 'text', record.amount_paid, true));
    form.appendChild(area('Not', 'notes', record.notes));
    form.appendChild(h('h2', { text: 'Modüller' }));
    form.appendChild(h('div', { class: 'kutular' }, MODULES.map(function (item) {
      var box = h('label', { class: 'kutu' }, [
        h('input', { type: 'checkbox', name: 'modules', value: item[0], checked: record.modules.indexOf(item[0]) !== -1 ? 'checked' : false }),
        h('span', { text: item[1] })
      ]);
      return box;
    })));
    form.appendChild(h('div', { class: 'eylem' }, [
      h('button', { class: 'btn-yazi', type: 'button', text: 'Paket şablonunu doldur', onclick: function () { applyTier(form); } }),
      h('button', { class: 'btn', type: 'submit', text: 'Örnek kaydı güncelle' }),
      h('a', { class: 'btn-yazi', href: '#isletme/' + record.id, text: 'Vazgeç' })
    ]));
    form.appendChild(h('p', { class: 'yardim', text: 'Güncelleme yalnız bu tarayıcı oturumundaki örnek listeyi değiştirir.' }));
    page.appendChild(form);
    return page;
  }

  function field(label, name, type, value, required) {
    return h('label', { class: 'alan' }, [
      h('span', { text: label }),
      h('input', { name: name, type: type, value: value || '', required: required ? 'required' : false, maxlength: name === 'company_name' ? '120' : '32' })
    ]);
  }

  function area(label, name, value) {
    return h('label', { class: 'alan' }, [
      h('span', { text: label }),
      h('textarea', { name: name, maxlength: '500', text: value || '' })
    ]);
  }

  function selectField(label, name, options, value) {
    return h('label', { class: 'alan' }, [
      h('span', { text: label }),
      h('select', { name: name }, options.map(function (option) {
        return h('option', { value: option[0], text: option[1], selected: option[0] === value ? 'selected' : false });
      }))
    ]);
  }

  function applyTier(form) {
    var tier = new FormData(form).get('tier');
    var slugs = TIER_MODULES[tier] || [];
    form.querySelectorAll('input[name="modules"]').forEach(function (input) {
      input.checked = slugs.indexOf(input.value) !== -1;
    });
  }

  function save(record, form, error) {
    var data = new FormData(form);
    var company = String(data.get('company_name') || '').trim();
    var status = String(data.get('status') || '');
    var tier = String(data.get('tier') || '');
    var starts = String(data.get('starts_on') || '');
    var expires = String(data.get('expires_on') || '');
    var amount = String(data.get('amount_paid') || '').trim();
    var notes = String(data.get('notes') || '').trim();
    var modules = data.getAll('modules').map(String);
    var problem = '';
    if (!company || company.length > 120) problem = 'Firma adı gerekli.';
    else if (status !== 'aktif' && status !== 'pasif') problem = 'Lisans durumu aktif veya pasif olmalı.';
    else if (tier && !TIER_MODULES[tier]) problem = 'Paket listede yok.';
    else if ((starts && !/^\d{4}-\d{2}-\d{2}$/.test(starts)) || (expires && !/^\d{4}-\d{2}-\d{2}$/.test(expires))) problem = 'Tarih biçimi geçersiz.';
    else if (starts && expires && expires < starts) problem = 'Bitiş, başlangıçtan önce olamaz.';
    else if (!/^\d+(\.\d{1,2})?$/.test(amount)) problem = 'Ödenen tutar sayı olmalı.';
    else if (modules.some(function (slug) { return !MODULES.some(function (item) { return item[0] === slug; }); })) problem = 'Modül listesi geçersiz.';
    if (problem) {
      error.hidden = false;
      error.textContent = problem;
      return;
    }
    record.company_name = company;
    record.status = status;
    record.tier = tier;
    record.starts_on = starts;
    record.expires_on = expires;
    record.amount_paid = Number(amount).toFixed(2);
    record.notes = notes;
    record.modules = modules;
    ui.notice = 'Örnek kayıt güncellendi. Veritabanına yazılmadı.';
    var nextHash = '#isletme/' + record.id;
    if (location.hash === nextHash) paint();
    else location.hash = nextHash;
  }

  function render(current) {
    if (current.name === 'genel') return renderOverview();
    if (current.name === 'isletmeler') return renderBusinesses();
    if (current.name === 'lisanslar') return renderLicenses();
    if (current.name === 'abonelikler') return renderSubscriptions();
    if (current.name === 'moduller') return renderModules();
    if (current.name === 'modul') return renderModule(current.slug);
    if (current.name === 'detay') return renderDetail(current.id);
    if (current.name === 'duzenle') return renderEdit(current.id);
    return renderOverview();
  }

  function closeMenu(restore) {
    var open = document.getElementById('uygulama').classList.contains('menu-acik');
    document.getElementById('uygulama').classList.remove('menu-acik');
    document.getElementById('menu-ac').setAttribute('aria-expanded', 'false');
    document.getElementById('perde').hidden = true;
    if (restore && open && menuReturn && typeof menuReturn.focus === 'function') menuReturn.focus();
  }

  function openMenu() {
    menuReturn = document.activeElement;
    document.getElementById('uygulama').classList.add('menu-acik');
    document.getElementById('menu-ac').setAttribute('aria-expanded', 'true');
    document.getElementById('perde').hidden = false;
    var first = document.querySelector('.nav-link');
    if (first) first.focus();
  }

  function paint() {
    var current = route();
    var heading = titleFor(current);
    document.getElementById('sayfa-baslik').textContent = heading;
    document.title = heading + ' — Yönetim paneli';
    renderNav(current);
    var page = document.getElementById('sayfa');
    var next = render(current);
    page.replaceChildren(next);
    closeMenu(false);
  }

  document.getElementById('menu-ac').addEventListener('click', openMenu);
  document.getElementById('menu-kapat').addEventListener('click', function () { closeMenu(true); });
  document.getElementById('perde').addEventListener('click', function () { closeMenu(true); });
  document.getElementById('menu').addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu(true);
  });
  window.addEventListener('hashchange', paint);
  if (!location.hash) location.hash = '#genel';
  paint();
})();
