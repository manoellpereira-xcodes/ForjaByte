(function () {
    var header = document.querySelector('header');

    // Sombra no cabeçalho ao rolar a página
    function marcarCabecalho() {
        if (header) header.classList.toggle('rolou', window.scrollY > 8);
    }

    window.addEventListener('scroll', marcarCabecalho, { passive: true });
    marcarCabecalho();

    var reduz = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduz || !('IntersectionObserver' in window)) return;

    // Barra de progresso de leitura no topo
    var barra = document.createElement('div');
    barra.className = 'progresso';
    barra.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barra);

    function atualizarProgresso() {
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var valor = total > 0 ? window.scrollY / total : 0;
        barra.style.transform = 'scaleX(' + Math.min(1, Math.max(0, valor)) + ')';
    }

    window.addEventListener('scroll', atualizarProgresso, { passive: true });
    window.addEventListener('resize', atualizarProgresso);
    atualizarProgresso();

    // Elementos que aparecem suavemente ao entrar na tela
    var seletores = [
        'section .titulo',
        '.faixa .fx',
        '.cat',
        '.duo > *',
        '.publico .pub',
        '.sobre-dupla .info-card',
        '.passo',
        '.valor-card',
        '.cta .wrap > *',
        '.carrinho',
        '.aviso'
    ].join(',');

    var elementos = document.querySelectorAll(seletores);
    var contagem = new Map();

    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(elementos, function (el) {
        var pai = el.parentElement;
        var indice = contagem.get(pai) || 0;

        contagem.set(pai, indice + 1);
        el.style.setProperty('--atraso', Math.min(indice, 6) * 90 + 'ms');
        el.classList.add('reveal');
        observador.observe(el);
    });
})();