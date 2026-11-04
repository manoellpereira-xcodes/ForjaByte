(function () {
    var produtos = window.FB_PRODUTOS;
    var U = window.FB_UTIL;
    var imagens = window.FB_IMAGENS;

    var categorias = ['Todos', 'Ofertas', 'PCs montados', 'Peças', 'Periféricos', 'Escritório'];
    var categoria = 'Todos';
    var termo = '';
    var carrinho = {};

    // Abre já filtrado quando vem da página inicial (catalogo.html?cat=Peças)
    try {
        var pedida = new URLSearchParams(location.search).get('cat') || '';
        if (categorias.indexOf(pedida) > -1) categoria = pedida;
    } catch (e) { }

    try {
        carrinho = JSON.parse(localStorage.getItem('fb_cart') || '{}');
    } catch (e) {
        carrinho = {};
    }

    function $(id) {
        return document.getElementById(id);
    }

    function salvarCarrinho() {
        try {
            localStorage.setItem('fb_cart', JSON.stringify(carrinho));
        } catch (e) { }
    }

    function aviso(texto, tipo) {
        var elemento = $('m-cart');
        elemento.className = 'msg ' + (tipo || 'ok');
        elemento.textContent = texto;
    }

    function contarCategoria(cat) {
        if (cat === 'Todos') return produtos.length;

        return produtos.filter(function (p) {
            return cat === 'Ofertas' ? p.off > 0 : p.cat === cat;
        }).length;
    }

    function desenharCategorias() {
        $('chips').innerHTML = categorias.map(function (cat) {
            return '<button type="button" class="chip" data-cat="' + U.escapar(cat) +
                '" aria-pressed="' + (cat === categoria) + '">' +
                '<span>' + U.escapar(cat) + '</span>' +
                '<span class="chip-n">' + contarCategoria(cat) + '</span>' +
                '</button>';
        }).join('');
    }

    function renderizarProdutos() {
        var limite = Number($('preco-max').value);
        var ordem = $('ordenar').value;

        var encontrados = produtos.filter(function (p) {
            var texto = (p.nome + ' ' + p.cat + ' ' + p.sp.join(' ')).toLowerCase();
            var okCat = categoria === 'Todos' ||
                (categoria === 'Ofertas' ? p.off > 0 : p.cat === categoria);

            return okCat && texto.includes(termo) && p.preco <= limite;
        });

        if (ordem === 'menor') encontrados.sort(function (a, b) { return a.preco - b.preco; });
        if (ordem === 'maior') encontrados.sort(function (a, b) { return b.preco - a.preco; });
        if (ordem === 'nome') encontrados.sort(function (a, b) { return a.nome.localeCompare(b.nome, 'pt-BR'); });

        $('resultado').textContent = encontrados.length +
            (encontrados.length === 1 ? ' produto encontrado' : ' produtos encontrados');

        $('lista').innerHTML = encontrados.length
            ? encontrados.map(U.card).join('')
            : '<p class="vazio">Nenhum produto encontrado. Ajuste os filtros.</p>';
    }

    function atualizarMini(qtd, total, animar) {
        $('mini-qtd').textContent = qtd;
        $('mini-total').textContent = U.moeda(total);

        if (animar) {
            var caixa = $('mini-carrinho');
            caixa.classList.remove('bump');
            void caixa.offsetWidth;
            caixa.classList.add('bump');
        }
    }

    function renderizarCarrinho(animar) {
        var ids = Object.keys(carrinho).filter(function (id) {
            return carrinho[id] > 0 && produtos.some(function (p) { return p.id === Number(id); });
        });

        var total = 0;
        var quantidade = 0;

        if (!ids.length) {
            atualizarMini(0, 0, animar);

            $('cart-conteudo').innerHTML =
                '<div class="carrinho-vazio">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>' +
                '<path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6"/>' +
                '</svg>' +
                '<p>Seu carrinho está vazio. Adicione produtos do catálogo.</p>' +
                '<a class="btn" href="#lista">Ver produtos</a>' +
                '</div>';
            return;
        }

        var itens = ids.map(function (id) {
            var p = U.achar(id);
            var qtd = carrinho[id];
            var subtotal = p.preco * qtd;
            var nome = U.escapar(p.nome);

            total += subtotal;
            quantidade += qtd;

            return '<li>' +
                '<img class="item-img" src="' + (imagens[p.img] || imagens.pc) + '" alt="">' +
                '<span class="item-info"><strong>' + nome + '</strong><small>' + U.moeda(p.preco) + ' cada' +
                (p.off ? ' (-' + p.off + '%)' : '') + '</small></span>' +
                '<span class="q">' +
                '<button type="button" data-m="' + id + '" aria-label="Diminuir quantidade de ' + nome + '">−</button>' +
                '<span>' + qtd + '</span>' +
                '<button type="button" data-p="' + id + '" aria-label="Aumentar quantidade de ' + nome + '">+</button>' +
                '</span>' +
                '<span class="item-sub"><strong>' + U.moeda(subtotal) + '</strong>' +
                '<button type="button" class="remover" data-r="' + id + '" aria-label="Remover ' + nome + ' do carrinho">Remover</button></span>' +
                '</li>';
        }).join('');

        atualizarMini(quantidade, total, animar);

        $('cart-conteudo').innerHTML =
            '<div class="cart-grid">' +
            '<ul class="itens">' + itens + '</ul>' +
            '<div class="resumo">' +
            '<h3>Resumo do pedido</h3>' +
            '<div class="res-linha"><span>Itens</span><span>' + quantidade + '</span></div>' +
            '<div class="res-linha"><span>Subtotal</span><span>' + U.moeda(total) + '</span></div>' +
            '<div class="total"><span>Total</span><span>' + U.moeda(total) + '</span></div>' +
            '<div class="acoes">' +
            '<button type="button" class="p" id="fin">Finalizar pedido</button>' +
            '<button type="button" class="s" id="lim">Limpar carrinho</button>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    U.fallback($('lista'));

    $('chips').addEventListener('click', function (e) {
        var botao = e.target.closest('[data-cat]');
        if (!botao) return;
        categoria = botao.dataset.cat;
        desenharCategorias();
        renderizarProdutos();
    });

    $('busca').addEventListener('input', function () {
        termo = this.value.trim().toLowerCase();
        renderizarProdutos();
    });

    $('preco-max').addEventListener('change', renderizarProdutos);
    $('ordenar').addEventListener('change', renderizarProdutos);

    $('limpar-filtros').addEventListener('click', function () {
        categoria = 'Todos';
        termo = '';
        $('busca').value = '';
        $('preco-max').value = '999999';
        $('ordenar').value = 'padrao';
        desenharCategorias();
        renderizarProdutos();
    });

    $('lista').addEventListener('click', function (e) {
        var botao = e.target.closest('[data-add]');
        if (!botao) return;

        var id = botao.dataset.add;
        carrinho[id] = (carrinho[id] || 0) + 1;
        salvarCarrinho();
        renderizarCarrinho(true);

        aviso(U.achar(id).nome + ' adicionado ao carrinho.');
    });

    $('cart-conteudo').addEventListener('click', function (e) {
        var botao = e.target.closest('button');
        if (!botao) return;

        if (botao.dataset.p) {
            carrinho[botao.dataset.p] = (carrinho[botao.dataset.p] || 0) + 1;
        } else if (botao.dataset.m) {
            carrinho[botao.dataset.m]--;
            if (carrinho[botao.dataset.m] <= 0) delete carrinho[botao.dataset.m];
        } else if (botao.dataset.r) {
            delete carrinho[botao.dataset.r];
            aviso('Item removido do carrinho.');
        } else if (botao.id === 'lim') {
            carrinho = {};
            aviso('Carrinho esvaziado.');
        } else if (botao.id === 'fin') {
            aviso('Pedido demonstrativo: nenhuma compra real foi realizada.');
            return;
        } else {
            return;
        }

        salvarCarrinho();
        renderizarCarrinho(true);
    });

    desenharCategorias();
    renderizarProdutos();
    renderizarCarrinho(false);
})();