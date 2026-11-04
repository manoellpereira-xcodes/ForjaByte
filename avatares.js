(function () {
    var M = window.FB_MASCOTE;
    if (!M) return;

    var VB = '-14 -12 128 128';

    var PRESETS = [
        { id: 'classica', nome: 'Clássica', bg: '#26262b', o: {} },
        { id: 'noturna', nome: 'Noturna', bg: '#ff6a00', o: { base: '#3a3a42', escuro: '#1d1d22', claro: '#8a8a96', claro2: '#6f6f7a' } },
        { id: 'artica', nome: 'Ártica', bg: '#26262b', o: { base: '#e9e9ef', escuro: '#9a9aa6', claro: '#ffffff', claro2: '#d8d8e0' } },
        { id: 'hacker', nome: 'Hacker', bg: '#111111', o: { olhos: 'visor' } },
        { id: 'dourada', nome: 'Dourada', bg: '#3a2a10', o: { base: '#f5b82e', escuro: '#b8800a' } },
        { id: 'sonolenta', nome: 'Sonolenta', bg: '#26262b', o: { olhos: 'fechados', headset: false } }
    ];

    function achar(id) {
        for (var i = 0; i < PRESETS.length; i++) {
            if (PRESETS[i].id === id) return PRESETS[i];
        }
        return null;
    }

    function ehFoto(av) {
        return typeof av === 'string' && av.indexOf('data:image') === 0;
    }

    function html(av) {
        if (ehFoto(av)) return '<img src="' + av + '" alt="">';

        var p = achar(av) || PRESETS[0];
        var o = { vb: VB, bg: p.bg };
        for (var k in p.o) o[k] = p.o[k];
        return M.svg(o);
    }

    function processar(arquivo, ok, falha) {
        if (!/^image\/(png|jpe?g|webp|gif)$/.test(arquivo.type)) {
            return falha('Use uma imagem PNG, JPG, WEBP ou GIF.');
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            return falha('A imagem deve ter até 5 MB.');
        }

        var leitor = new FileReader();

        leitor.onerror = function () { falha('Não foi possível ler o arquivo.'); };

        leitor.onload = function () {
            var img = new Image();

            img.onerror = function () { falha('Não foi possível abrir essa imagem.'); };

            img.onload = function () {
                var tam = 160;
                var c = document.createElement('canvas');
                c.width = tam;
                c.height = tam;

                var lado = Math.min(img.width, img.height);
                c.getContext('2d').drawImage(
                    img,
                    (img.width - lado) / 2, (img.height - lado) / 2, lado, lado,
                    0, 0, tam, tam
                );

                ok(c.toDataURL('image/jpeg', 0.85));
            };

            img.src = leitor.result;
        };

        leitor.readAsDataURL(arquivo);
    }

    // Seletor de avatar / envio de foto
    function seletor(cont, inicial, aoMudar) {
        var valor = inicial || 'classica';

        cont.innerHTML =
            '<div class="av-sel">' +
            '<span class="av av-m av-previa" data-p></span>' +
            '<div class="av-grade" role="group" aria-label="Escolha um avatar" data-g></div>' +
            '<div class="av-envio">' +
            '<button type="button" class="btn out av-up" data-up>Enviar minha foto</button>' +
            '<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden data-f>' +
            '<small>PNG, JPG, WEBP ou GIF, até 5 MB. A foto fica salva só neste navegador.</small>' +
            '<div class="erro" data-e role="alert"></div>' +
            '</div>' +
            '</div>';

        var previa = cont.querySelector('[data-p]');
        var grade = cont.querySelector('[data-g]');
        var arq = cont.querySelector('[data-f]');
        var msg = cont.querySelector('[data-e]');

        function desenhar(foco) {
            previa.innerHTML = html(valor);

            var h = '';

            if (ehFoto(valor)) {
                h += '<button type="button" class="av-op" aria-pressed="true" aria-label="Sua foto" data-v="foto">' + html(valor) + '</button>';
            }

            PRESETS.forEach(function (p) {
                h += '<button type="button" class="av-op" aria-pressed="' + (valor === p.id) + '" aria-label="Avatar ' + p.nome + '" data-v="' + p.id + '">' + html(p.id) + '</button>';
            });

            grade.innerHTML = h;

            if (foco) {
                var alvo = grade.querySelector('[data-v="' + foco + '"]');
                if (alvo) alvo.focus();
            }
        }

        grade.addEventListener('click', function (e) {
            var b = e.target.closest('[data-v]');
            if (!b || b.getAttribute('data-v') === 'foto') return;

            msg.textContent = '';
            valor = b.getAttribute('data-v');
            desenhar(valor);

            if (aoMudar) aoMudar(valor);
        });

        cont.querySelector('[data-up]').addEventListener('click', function () {
            arq.click();
        });

        arq.addEventListener('change', function () {
            var f = arq.files && arq.files[0];
            if (!f) return;

            msg.textContent = '';

            processar(f, function (dataUrl) {
                valor = dataUrl;
                desenhar('foto');
                if (aoMudar) aoMudar(valor);
            }, function (texto) {
                msg.textContent = texto;
            });

            arq.value = '';
        });

        desenhar();

        return {
            valor: function () { return valor; },
            definir: function (v) { valor = v || 'classica'; msg.textContent = ''; desenhar(); }
        };
    }

    window.FB_AVATAR = { presets: PRESETS, html: html, seletor: seletor, ehFoto: ehFoto };

    /* ---------- Avatar e nome no menu quando a pessoa está conectada ---------- */

    function lerSessao() {
        try {
            return JSON.parse(sessionStorage.getItem('fb_sessao') || 'null');
        } catch (e) {
            return null;
        }
    }

    function atualizarMenu() {
        var link = document.querySelector('nav a[href="cadastro.html"]');
        if (!link) return;

        if (!link.getAttribute('data-txt')) {
            link.setAttribute('data-txt', link.textContent);
        }

        var s = lerSessao();

        if (s) {
            link.classList.add('nav-user');
            link.textContent = '';

            var av = document.createElement('span');
            av.className = 'av av-mini';
            av.innerHTML = html(s.avatar);

            var nome = document.createElement('span');
            nome.textContent = String(s.nome || '').split(' ')[0];

            link.appendChild(av);
            link.appendChild(nome);
            link.setAttribute('aria-label', 'Minha conta: ' + s.nome);
        } else {
            link.classList.remove('nav-user');
            link.textContent = link.getAttribute('data-txt');
            link.removeAttribute('aria-label');
        }
    }

    window.addEventListener('fb-sessao', atualizarMenu);
    atualizarMenu();
})();