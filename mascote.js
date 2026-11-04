(function () {
    var PADRAO = {
        base: '#ff7a1a',
        escuro: '#c2410c',
        claro: '#fff1e6',
        claro2: '#f0dccb',
        tinta: '#0a0a0a',
        olho: '#ff8a33',
        olhos: 'abertos',   // 'abertos' | 'fechados' | 'visor'
        headset: true,
        vb: '0 0 100 100',
        bg: null,
        classe: '',
        rotulo: null,
        extra: ''
    };

    function esc(t) {
        return String(t).replace(/"/g, '&quot;');
    }

    function svg(op) {
        var o = {}, k;
        for (k in PADRAO) o[k] = PADRAO[k];
        if (op) for (k in op) o[k] = op[k];

        var t = o.tinta;

        var s = '<svg xmlns="http://www.w3.org/2000/svg" class="fox ' + o.classe + '" viewBox="' + o.vb + '" ' +
            (o.rotulo ? 'role="img" aria-label="' + esc(o.rotulo) + '"' : 'aria-hidden="true"') +
            ' focusable="false">';

        if (o.bg) s += '<circle cx="50" cy="52" r="64" fill="' + o.bg + '"/>';

        s += '<g class="fox-corpo">';

        // Cabeça
        s += '<path d="M10 5 L35 29 Q50 27 65 29 L90 5 L95 45 L86 70 L50 95 L14 70 L5 45 Z" fill="' + o.base + '"/>';
        s += '<path d="M50 27 L65 29 L90 5 L95 45 L86 70 L50 95 Z" fill="#000" opacity=".14"/>';

        // Interior das orelhas
        s += '<g class="orelha-e"><path d="M15 15 L30 30 L12 36 Z" fill="' + t + '" opacity=".85"/></g>';
        s += '<g class="orelha-d"><path d="M85 15 L70 30 L88 36 Z" fill="' + t + '" opacity=".85"/></g>';

        // Bochechas e focinho
        s += '<path d="M5 46 L24 54 L28 73 L14 70 Z" fill="' + o.claro + '"/>';
        s += '<path d="M95 46 L76 54 L72 73 L86 70 Z" fill="' + o.claro2 + '"/>';
        s += '<path d="M50 95 L27 72 Q36 60 50 65 Q64 60 73 72 Z" fill="' + o.claro + '"/>';

        // Marca da testa
        s += '<path d="M50 27 L56 44 L50 51 L44 44 Z" fill="' + o.escuro + '"/>';

        // Olhos
        if (o.olhos === 'fechados') {
            s += '<path d="M27 52 Q34 58 42 52 M58 52 Q66 58 73 52" fill="none" stroke="' + t + '" stroke-width="2" stroke-linecap="round"/>';
        } else if (o.olhos === 'visor') {
            s += '<path d="M22 46 L78 46 L74 58 L26 58 Z" fill="' + t + '"/>';
            s += '<path d="M27 52 L73 52" stroke="' + o.olho + '" stroke-width="1.8" stroke-linecap="round"/>';
        } else {
            s += '<g class="olhos">' +
                '<path d="M27 47 L42 51 L38 57 L26 53 Z" fill="' + t + '"/>' +
                '<path d="M73 47 L58 51 L62 57 L74 53 Z" fill="' + t + '"/>' +
                '<circle cx="35" cy="53" r="1.8" fill="' + o.olho + '"/>' +
                '<circle cx="65" cy="53" r="1.8" fill="' + o.olho + '"/>' +
                '</g>';
            s += '<path d="M24 44 L44 48 M76 44 L56 48" stroke="' + t + '" stroke-width="1.8" stroke-linecap="round"/>';
        }

        // Nariz e boca
        s += '<path d="M44 72 L56 72 L50 78 Z" fill="' + t + '"/>';
        s += '<path d="M50 78 L50 83 M50 83 Q44 87 39 84 M50 83 Q56 87 61 84" fill="none" stroke="' + t + '" stroke-width="1.3" stroke-linecap="round"/>';

        // Headset
        if (o.headset) {
            s += '<path d="M8 45 C5 -11 95 -11 92 45" fill="none" stroke="' + t + '" stroke-width="4.2" stroke-linecap="round"/>';
            s += '<path d="M8 45 C5 -11 95 -11 92 45" fill="none" stroke="#ff6a00" stroke-width="1" stroke-linecap="round"/>';
            s += '<rect x="2" y="43" width="11" height="23" rx="4" fill="' + t + '" stroke="#ff6a00" stroke-width="1.2"/>';
            s += '<rect x="87" y="43" width="11" height="23" rx="4" fill="' + t + '" stroke="#ff6a00" stroke-width="1.2"/>';
            s += '<path d="M6 65 Q7 82 28 83" fill="none" stroke="' + t + '" stroke-width="1.8" stroke-linecap="round"/>';
            s += '<circle cx="29.5" cy="83" r="2.6" fill="#ff6a00" stroke="' + t + '" stroke-width=".8"/>';
        }

        s += '</g>' + o.extra + '</svg>';
        return s;
    }

    // Preenche os elementos <span data-mascote="..."></span> da página
    function preencher() {
        var els = document.querySelectorAll('[data-mascote]');

        Array.prototype.forEach.call(els, function (el) {
            if (el.firstChild) return;

            el.innerHTML = svg({
                classe: el.getAttribute('data-mascote') === 'grande' ? 'fox-anim' : '',
                rotulo: el.getAttribute('data-rotulo') || null
            });
        });
    }

    // Ícone da aba do navegador
    function favicon() {
        var l = document.createElement('link');
        l.rel = 'icon';
        l.type = 'image/svg+xml';
        l.href = 'data:image/svg+xml,' + encodeURIComponent(svg({ classe: '' }));
        document.head.appendChild(l);
    }

    window.FB_MASCOTE = { svg: svg, preencher: preencher };

    preencher();
    favicon();
})();