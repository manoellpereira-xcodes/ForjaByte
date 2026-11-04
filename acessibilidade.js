(function () {
    var CHAVE = 'fb_a11y';
    var estado = {
        fs: 100,
        contraste: false,
        anim: false
    };

    try {
        estado = Object.assign(
            estado,
            JSON.parse(localStorage.getItem(CHAVE) || '{}')
        );
    } catch (e) { }

    function $(id) {
        return document.getElementById(id);
    }

    function salvar() {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(estado));
        } catch (e) { }
    }

    function aplicar() {
        document.documentElement.style.setProperty('--fs', estado.fs + '%');
        document.body.classList.toggle('contraste', estado.contraste);
        document.body.classList.toggle('sem-anim', estado.anim);

        var contraste = $('a11y-c');
        var animacao = $('a11y-a');
        var tamanho = $('a11y-fs');

        if (contraste) {
            contraste.setAttribute('aria-pressed', String(estado.contraste));
        }

        if (animacao) {
            animacao.setAttribute('aria-pressed', String(estado.anim));
        }

        if (tamanho) {
            tamanho.textContent = estado.fs + '%';
        }
    }

    function avisar(texto) {
        var live = $('a11y-live');

        if (live) {
            live.textContent = '';
            setTimeout(function () {
                live.textContent = texto;
            }, 50);
        }
    }

    var caixa = document.createElement('div');
    caixa.className = 'a11y';

    caixa.innerHTML =
        '<div class="a11y-painel" id="a11y-painel" role="region" aria-label="Opções de acessibilidade">' +

        '<div class="a11y-topo">' +
        '<h2>Acessibilidade</h2>' +
        '<button type="button" class="a11y-fechar" id="a11y-fechar" aria-label="Fechar painel de acessibilidade">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '</div>' +

        '<div class="a11y-grupo">' +
        '<span class="a11y-rotulo" id="a11y-rot-texto">Tamanho do texto</span>' +
        '<div class="a11y-tam" role="group" aria-labelledby="a11y-rot-texto">' +
        '<button type="button" class="a11y-btn" id="a11y-menos" aria-label="Diminuir texto">A−</button>' +
        '<output id="a11y-fs" aria-live="off">100%</output>' +
        '<button type="button" class="a11y-btn" id="a11y-mais" aria-label="Aumentar texto">A+</button>' +
        '</div>' +
        '</div>' +

        '<div class="a11y-grupo">' +
        '<span class="a11y-rotulo">Visual</span>' +
        '<button type="button" class="a11y-op" id="a11y-c" aria-pressed="false">' +
        '<span>Alto contraste</span><span class="a11y-sw" aria-hidden="true"></span>' +
        '</button>' +
        '<button type="button" class="a11y-op" id="a11y-a" aria-pressed="false">' +
        '<span>Pausar animações</span><span class="a11y-sw" aria-hidden="true"></span>' +
        '</button>' +
        '</div>' +

        '<div class="a11y-grupo">' +
        '<span class="a11y-rotulo">Leitura em voz alta</span>' +
        '<div class="a11y-dupla">' +
        '<button type="button" class="a11y-btn" id="a11y-ler">▶ Ouvir</button>' +
        '<button type="button" class="a11y-btn" id="a11y-parar">■ Parar</button>' +
        '</div>' +
        '</div>' +

        '<button type="button" class="a11y-btn a11y-reset" id="a11y-reset">Restaurar padrão</button>' +
        '</div>' +

        '<button type="button" class="a11y-toggle" id="a11y-toggle" aria-expanded="false" aria-controls="a11y-painel" aria-label="Abrir opções de acessibilidade" title="Acessibilidade">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="4.5" r="2"/>' +
        '<path d="M4 8.5l8 1.5 8-1.5M12 10v4.5M12 14.5l-3.5 6M12 14.5l3.5 6"/>' +
        '</svg>' +
        '</button>' +

        '<div class="sr" id="a11y-live" aria-live="polite"></div>';

    document.body.appendChild(caixa);

    function abrirFechar(abrir) {
        var aberto = typeof abrir === 'boolean' ? abrir : !caixa.classList.contains('aberto');
        caixa.classList.toggle('aberto', aberto);
        $('a11y-toggle').setAttribute('aria-expanded', String(aberto));
    }

    $('a11y-toggle').addEventListener('click', function () {
        abrirFechar();
    });

    $('a11y-fechar').addEventListener('click', function () {
        abrirFechar(false);
        $('a11y-toggle').focus();
    });

    caixa.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && caixa.classList.contains('aberto')) {
            abrirFechar(false);
            $('a11y-toggle').focus();
        }
    });

    $('a11y-mais').addEventListener('click', function () {
        estado.fs = Math.min(150, estado.fs + 10);
        salvar();
        aplicar();
        avisar('Texto em ' + estado.fs + ' por cento.');
    });

    $('a11y-menos').addEventListener('click', function () {
        estado.fs = Math.max(80, estado.fs - 10);
        salvar();
        aplicar();
        avisar('Texto em ' + estado.fs + ' por cento.');
    });

    $('a11y-c').addEventListener('click', function () {
        estado.contraste = !estado.contraste;
        salvar();
        aplicar();
        avisar(estado.contraste ? 'Alto contraste ativado.' : 'Alto contraste desativado.');
    });

    $('a11y-a').addEventListener('click', function () {
        estado.anim = !estado.anim;
        salvar();
        aplicar();
        avisar(estado.anim ? 'Animações pausadas.' : 'Animações ativadas.');
    });

    var synth = window.speechSynthesis;

    function pararLeitura() {
        if (synth) synth.cancel();
    }

    $('a11y-parar').addEventListener('click', pararLeitura);

    $('a11y-ler').addEventListener('click', function () {
        if (!synth) {
            avisar('Seu navegador não suporta leitura em voz alta.');
            return;
        }

        pararLeitura();

        var alvo = document.querySelector('main') || document.body;
        var partes = alvo.innerText
            .split(/\n+/)
            .filter(function (texto) {
                return texto.trim().length > 1;
            });

        partes.forEach(function (texto) {
            var fala = new SpeechSynthesisUtterance(texto);
            fala.lang = 'pt-BR';
            fala.rate = 1;
            synth.speak(fala);
        });
    });

    $('a11y-reset').addEventListener('click', function () {
        estado = {
            fs: 100,
            contraste: false,
            anim: false
        };

        salvar();
        aplicar();
        pararLeitura();
        avisar('Configurações restauradas.');
    });

    window.addEventListener('beforeunload', pararLeitura);

    aplicar();

    // Tradutor de Libras VLibras. Requer conexão com a internet.
    var vlibras = document.createElement('div');
    vlibras.setAttribute('vw', '');
    vlibras.className = 'enabled';
    vlibras.innerHTML =
        '<div vw-access-button class="active"></div>' +
        '<div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';

    document.body.appendChild(vlibras);

    var script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';

    script.onload = function () {
        try {
            if (window.VLibras) {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
            }
        } catch (e) { }
    };

    document.head.appendChild(script);
})();