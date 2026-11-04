(function () {
    var chave = 'fb_theme';
    var M = window.FB_MASCOTE;
    var VB = '-2 -14 126 118';

    var ZZZ =
        '<g class="zzz" font-family="Rajdhani, Arial, sans-serif" font-weight="700" fill="#ff8a33">' +
        '<text class="z z1" x="88" y="14" font-size="13">z</text>' +
        '<text class="z z2" x="99" y="4" font-size="10">z</text>' +
        '<text class="z z3" x="108" y="-4" font-size="8">z</text>' +
        '</g>';

    var PAD =
        '<g class="pad">' +
        '<rect x="78" y="80" width="38" height="20" rx="8" fill="#0a0a0a" stroke="#ff6a00" stroke-width="1.6"/>' +
        '<path d="M87 86v8M83 90h8" stroke="#ff8a33" stroke-width="2" stroke-linecap="round"/>' +
        '<circle class="btn-a" cx="104" cy="88" r="2" fill="#ff6a00"/>' +
        '<circle class="btn-b" cx="109" cy="92" r="2" fill="#ff8a33"/>' +
        '</g>';

    function raposa(tema) {
        if (!M) return '';

        return tema === 'dark'
            ? M.svg({ olhos: 'fechados', vb: VB, classe: 'fox-tt', extra: ZZZ })
            : M.svg({ olhos: 'abertos', vb: VB, classe: 'fox-tt', extra: PAD });
    }

    function lerTema() {
        try {
            return localStorage.getItem(chave) || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);

        try {
            localStorage.setItem(chave, tema);
        } catch (e) { }

        var botao = document.getElementById('theme-toggle');
        if (!botao) return;

        var claro = tema === 'light';
        var texto = claro ? 'Ativar modo escuro (a raposa vai dormir)' : 'Ativar modo claro (acordar a raposa)';

        botao.querySelector('.tt-fox').innerHTML = raposa(tema);
        botao.querySelector('.tt-txt').textContent = claro ? 'Dormir' : 'Acordar';
        botao.setAttribute('aria-label', texto);
        botao.setAttribute('title', texto);
        botao.setAttribute('aria-pressed', claro ? 'true' : 'false');
    }

    function iniciar() {
        var cabecalho = document.querySelector('header .wrap');

        if (!cabecalho || document.getElementById('theme-toggle')) {
            aplicarTema(lerTema());
            return;
        }

        var botao = document.createElement('button');
        botao.type = 'button';
        botao.id = 'theme-toggle';
        botao.className = 'theme-toggle';
        botao.innerHTML = '<span class="tt-fox" aria-hidden="true"></span><span class="tt-txt"></span>';

        botao.addEventListener('click', function () {
            var atual = document.documentElement.getAttribute('data-theme');
            aplicarTema(atual === 'dark' ? 'light' : 'dark');

            botao.classList.remove('tt-pop');
            void botao.offsetWidth;
            botao.classList.add('tt-pop');
        });

        cabecalho.appendChild(botao);
        aplicarTema(lerTema());
    }

    // Aplica o tema salvo o mais cedo possível
    document.documentElement.setAttribute('data-theme', lerTema());

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();