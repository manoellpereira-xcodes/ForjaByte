(function () {
    var P = window.FB_PRODUTOS;
    var U = window.FB_UTIL;
    if (!P || !U) return;

    function $(id) {
        return document.getElementById(id);
    }

    /* ---------- Contagem regressiva até domingo à noite ---------- */

    function fimDaSemana() {
        var a = new Date();
        var dias = (7 - a.getDay()) % 7;
        return new Date(a.getFullYear(), a.getMonth(), a.getDate() + dias, 23, 59, 59);
    }

    var alvo = fimDaSemana();

    function dois(n) {
        return n < 10 ? '0' + n : String(n);
    }

    function tick() {
        var ms = alvo - new Date();

        if (ms <= 0) {
            alvo = fimDaSemana();
            ms = Math.max(0, alvo - new Date());
        }

        var s = Math.floor(ms / 1000);

        $('cd-d').textContent = dois(Math.floor(s / 86400));
        $('cd-h').textContent = dois(Math.floor(s % 86400 / 3600));
        $('cd-m').textContent = dois(Math.floor(s % 3600 / 60));
        $('cd-s').textContent = dois(s % 60);
    }

    tick();
    setInterval(tick, 1000);

    /* ---------- Ofertas relâmpago (carrossel) ---------- */

    var ofertas = P.filter(function (p) { return p.off > 0; })
        .sort(function (a, b) { return b.off - a.off || a.preco - b.preco; });

    var lista = $('rel-lista');
    lista.innerHTML = ofertas.slice(0, 10).map(U.card).join('');
    U.fallback(lista);

    function passo(dir) {
        var c = lista.querySelector('.prod');
        var largura = (c ? c.offsetWidth : 260) + 16;
        lista.scrollBy({ left: dir * largura * 2, behavior: 'smooth' });
    }

    $('rel-prev').addEventListener('click', function () { passo(-1); });
    $('rel-next').addEventListener('click', function () { passo(1); });

    /* ---------- Oferta do dia (muda a cada dia) ---------- */

    var hoje = new Date();
    var diaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
    var d = ofertas[diaDoAno % ofertas.length];

    $('dia').innerHTML =
        '<div class="dest-img"><span class="selo-off">-' + d.off + '%</span>' +
        '<img src="' + window.FB_IMAGENS[d.img] + '" alt="' + U.escapar(d.nome) + '" loading="lazy"></div>' +
        '<div class="dest-info">' +
        '<span class="tag">Oferta do dia</span>' +
        '<h2>' + U.escapar(d.nome) + '</h2>' +
        '<ul>' + d.sp.map(function (s) { return '<li>' + U.escapar(s) + '</li>'; }).join('') + '</ul>' +
        '<div class="dest-preco"><span class="de">' + U.moeda(d.de) + '</span>' +
        '<strong>' + U.moeda(d.preco) + '</strong>' +
        '<small>ou 10x de ' + U.moeda(d.preco / 10) + ' • preço demonstrativo</small></div>' +
        '<div><button type="button" class="btn" data-add="' + d.id + '">Adicionar ao carrinho</button>' +
        '<a class="btn out" href="catalogo.html?cat=Ofertas">Ver todas as ofertas</a></div>' +
        '</div>';

    U.fallback($('dia'));

    /* ---------- Mais vendidos (abas) ---------- */

    var VENDIDOS = {
        'Todos': [1, 14, 15, 8, 13, 7, 16, 19],
        'PCs montados': [1, 2, 23, 4],
        'Peças': [7, 8, 5, 6],
        'Periféricos': [14, 13, 15, 16],
        'Escritório': [19, 20, 38, 39]
    };

    var abas = Object.keys(VENDIDOS);
    var aba = 'Todos';

    function desenharAbas() {
        $('vend-chips').innerHTML = abas.map(function (a) {
            return '<button type="button" class="chip" data-aba="' + U.escapar(a) +
                '" aria-pressed="' + (a === aba) + '">' + U.escapar(a) + '</button>';
        }).join('');
    }

    function desenharVendidos() {
        $('vend-lista').innerHTML = VENDIDOS[aba].map(function (id, i) {
            return U.card(U.achar(id), i);
        }).join('');
    }

    $('vend-chips').addEventListener('click', function (e) {
        var b = e.target.closest('[data-aba]');
        if (!b) return;

        aba = b.getAttribute('data-aba');
        desenharAbas();
        desenharVendidos();

        var ativo = $('vend-chips').querySelector('[aria-pressed="true"]');
        if (ativo) ativo.focus();
    });

    desenharAbas();
    desenharVendidos();
    U.fallback($('vend-lista'));

    /* ---------- Aviso ao adicionar ao carrinho ---------- */

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);

    var tempo = null;

    function avisar(html) {
        toast.innerHTML = html;
        toast.classList.add('on');
        clearTimeout(tempo);
        tempo = setTimeout(function () { toast.classList.remove('on'); }, 3800);
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-add]');
        if (!b) return;

        var p = U.achar(b.getAttribute('data-add'));
        if (!p) return;

        if (U.adicionar(p.id)) {
            avisar('<span>' + U.escapar(p.nome) + ' adicionado ao carrinho.</span>' +
                '<a href="catalogo.html#carrinho-sec">Ver carrinho</a>');
        } else {
            avisar('<span>Não foi possível salvar o carrinho neste navegador.</span>');
        }
    });
})();