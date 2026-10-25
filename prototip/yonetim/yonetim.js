(function () {
  'use strict';

  var status = document.getElementById('cizim-durum');
  var list = document.getElementById('cizim-liste');
  var data = window.QRMO_MODULES;

  function text(value) {
    return document.createTextNode(value == null ? '' : String(value));
  }

  function titles(node, found) {
    if (!node || typeof node !== 'object') return;
    if (node.frame === 'window' && typeof node.title === 'string' && node.title !== '') {
      found.push(node.title);
    }
    if (Array.isArray(node)) {
      node.forEach(function (item) { titles(item, found); });
      return;
    }
    Object.keys(node).forEach(function (key) { titles(node[key], found); });
  }

  if (!data || !Array.isArray(data.modules)) {
    status.textContent = 'Modül çizimleri yüklenemedi. Sayfayı depo kökünden açın.';
    return;
  }

  var modules = data.modules.filter(function (mod) {
    return mod && typeof mod.slug === 'string' && typeof mod.name === 'string';
  });

  list.replaceChildren();
  modules.forEach(function (mod) {
    var found = [];
    titles(mod, found);
    var unique = found.filter(function (title, index) {
      return found.indexOf(title) === index;
    });

    var card = document.createElement('article');
    card.className = 'card';

    var heading = document.createElement('h3');
    heading.appendChild(text(mod.name));
    card.appendChild(heading);

    var badge = document.createElement('p');
    badge.className = 'badge';
    badge.appendChild(text('Örnek veri'));
    card.appendChild(badge);

    if (unique.length) {
      var screens = document.createElement('ul');
      unique.forEach(function (title) {
        var item = document.createElement('li');
        item.appendChild(text(title));
        screens.appendChild(item);
      });
      card.appendChild(screens);
    }

    var link = document.createElement('a');
    link.href = '../../moduller/' + encodeURIComponent(mod.slug) + '/';
    link.appendChild(text('Tanıtım sayfasını aç'));
    card.appendChild(link);
    list.appendChild(card);
  });

  status.textContent = modules.length + ' modül çizimi listelendi. Hepsi örnek veri kullanır.';
})();
