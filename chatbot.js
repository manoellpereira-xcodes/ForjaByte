(function () {
    var REABRIR = 'fb_chat_reabrir';

    /* ---------- Produtos (mesmos IDs do catalogo.js) ---------- */

    var PRODUTOS = {
        1: { n: 'PC Gamer Fox Entrada', p: 3499, d: '6 núcleos • 16 GB DDR4 • SSD NVMe 500 GB' },
        2: { n: 'PC Gamer Fox Pro', p: 5999, d: '8 núcleos • 32 GB DDR4 • SSD NVMe 1 TB' },
        3: { n: 'PC Gamer Fox Ultra', p: 9499, d: '12 núcleos • 32 GB DDR5 • SSD NVMe 2 TB' },
        4: { n: 'PC Office Núcleo', p: 2299, d: '4 núcleos • 8 GB RAM • SSD 240 GB' },
        5: { n: 'Processador 6 Núcleos', p: 899, d: '6 núcleos / 12 threads • até 4.5 GHz' },
        6: { n: 'Placa de Vídeo 8 GB', p: 2199, d: '8 GB • dois ventiladores • HDMI e DisplayPort' },
        7: { n: 'Memória RAM 16 GB', p: 289, d: 'DDR4 3200 MHz • kit 2 x 8 GB' },
        8: { n: 'SSD NVMe 1 TB', p: 429, d: 'Formato M.2 • alta velocidade • 1 TB' },
        9: { n: 'Placa-mãe Gaming', p: 799, d: 'Slots de memória • conexões variadas' },
        10: { n: 'Fonte 650 W', p: 399, d: '650 W • proteções elétricas' },
        11: { n: 'Gabinete Gamer RGB', p: 349, d: 'Painel lateral transparente • ventilação frontal' },
        12: { n: 'Cooler para Processador', p: 159, d: 'Ventilador integrado • instalação simples' },
        13: { n: 'Teclado Mecânico RGB', p: 249, d: 'Switch mecânico • RGB • layout ABNT2' },
        14: { n: 'Mouse Gamer 12.000 DPI', p: 129, d: 'Sensor óptico • 6 botões programáveis' },
        15: { n: 'Headset Gamer 7.1', p: 199, d: 'Som surround virtual • microfone • USB' },
        16: { n: 'Monitor 24 polegadas', p: 899, d: 'Full HD • 144 Hz demonstrativo' },
        17: { n: 'Webcam Full HD', p: 179, d: 'Vídeo Full HD • microfone integrado' },
        18: { n: 'Cadeira Gamer', p: 899, d: 'Encosto reclinável • design ergonômico' },
        19: { n: 'Kit Teclado e Mouse', p: 119, d: 'Sem fio • teclas silenciosas' },
        20: { n: 'Monitor para Escritório', p: 649, d: 'Full HD • conexão HDMI' },
        21: { n: 'PC Gamer Fox Elite', p: 7999, d: '8 núcleos • 32 GB DDR5 • placa de vídeo 12 GB' },
        22: { n: 'PC Creator Studio', p: 7499, d: '12 núcleos • 64 GB DDR5 • SSD NVMe 2 TB' },
        23: { n: 'PC Office Plus', p: 3199, d: '6 núcleos • 16 GB DDR4 • SSD NVMe 500 GB' },
        24: { n: 'Placa de Vídeo 12 GB', p: 3899, d: '12 GB • três ventiladores' },
        25: { n: 'Placa de Vídeo 16 GB', p: 5499, d: '16 GB • ideal para 1440p e 4K' },
        26: { n: 'Processador 8 Núcleos', p: 1399, d: '8 núcleos / 16 threads • até 4.9 GHz' },
        27: { n: 'Processador 12 Núcleos', p: 2299, d: '12 núcleos / 24 threads • até 5.2 GHz' },
        28: { n: 'Memória RAM 32 GB DDR5', p: 749, d: 'DDR5 5600 MHz • kit 2 x 16 GB' },
        29: { n: 'SSD NVMe 2 TB', p: 799, d: 'Formato M.2 • 2 TB' },
        30: { n: 'Water Cooler 240 mm', p: 449, d: 'Dois ventiladores PWM • ARGB' },
        31: { n: 'Fonte 750 W 80 Plus Gold', p: 649, d: '750 W • cabos modulares' },
        32: { n: 'Teclado 60% Sem Fio', p: 299, d: 'Compacto • Bluetooth e USB • RGB' },
        33: { n: 'Mouse Sem Fio Ultraleve', p: 189, d: 'Peso reduzido • bateria de longa duração' },
        34: { n: 'Monitor 27 polegadas QHD', p: 1799, d: 'Resolução QHD • 165 Hz demonstrativo' },
        35: { n: 'Mousepad Extended', p: 79, d: 'Tamanho grande • base antiderrapante' },
        36: { n: 'Microfone USB para Streaming', p: 229, d: 'Captação cardioide • botão de mudo' },
        37: { n: 'Headset Gamer Sem Fio', p: 349, d: '2.4 GHz • microfone removível' },
        38: { n: 'Monitor 22 polegadas', p: 529, d: 'Full HD • HDMI e VGA' },
        39: { n: 'Nobreak 600 VA', p: 399, d: 'Protege contra queda de energia' },
        40: { n: 'Suporte Articulado para Monitor', p: 169, d: 'Ajuste de altura • padrão VESA' }
    };

    // Usa os preços atualizados (com desconto) do produtos.js
    if (window.FB_PRODUTOS) {
        window.FB_PRODUTOS.forEach(function (x) {
            if (PRODUTOS[x.id]) PRODUTOS[x.id].p = x.preco;
        });
    }

    var GRUPOS = {
        cpu: {
            titulo: 'processadores',
            ids: [5, 26, 27],
            dica: 'Dica: confira se o processador é compatível com o soquete da sua placa-mãe.'
        },
        gpu: {
            titulo: 'placas de vídeo',
            ids: [6, 24, 25],
            dica: 'Dica: para as placas de 12 e 16 GB, prefira uma fonte de 650 W ou mais.'
        },
        ram: {
            titulo: 'memórias RAM',
            ids: [7, 28],
            dica: 'Dica: memórias DDR4 e DDR5 não são compatíveis entre si. Veja o que a sua placa-mãe aceita.'
        },
        ssd: {
            titulo: 'SSDs',
            ids: [8, 29],
            dica: 'Dica: SSD NVMe M.2 precisa de um slot M.2 livre na placa-mãe.'
        },
        outros: {
            titulo: 'placa-mãe, fontes, coolers e gabinete',
            ids: [9, 10, 31, 12, 30, 11],
            dica: 'Dica: escolha a fonte pela soma do consumo das peças, deixando uma folga.'
        },
        tm: {
            titulo: 'teclados e mouses',
            ids: [13, 32, 14, 33, 19],
            dica: ''
        },
        av: {
            titulo: 'áudio e vídeo',
            ids: [15, 37, 36, 17],
            dica: ''
        },
        mon: {
            titulo: 'monitores',
            ids: [38, 20, 16, 34],
            dica: 'Dica: monitores de 144 Hz ou mais são ótimos para jogos; para escritório, Full HD já resolve.'
        },
        acc: {
            titulo: 'cadeira e acessórios',
            ids: [18, 35, 40],
            dica: ''
        },
        esc: {
            titulo: 'itens para escritório',
            ids: [4, 23, 19, 38, 39, 40],
            dica: ''
        }
    };

    var PC_REC = {
        jogos: { a: [1], b: [2], c: [21, 3] },
        trabalho: { a: [4, 23], b: [23, 2], c: [22] },
        criacao: { a: [1], b: [2], c: [22, 3] }
    };

    var USO_TXT = {
        jogos: 'jogos',
        trabalho: 'trabalho e estudo',
        criacao: 'edição e criação de conteúdo'
    };

    var FAIXA_TXT = {
        a: 'até R$ 4.000',
        b: 'até R$ 7.000',
        c: 'acima de R$ 7.000'
    };

    var DUVIDAS = {
        garantia: 'Todos os produtos contam com garantia e suporte, e o atendimento é transparente. Como este site é uma demonstração escolar, as condições exatas ainda não estão definidas.',
        pagamento: 'Os cartões de produto mostram um parcelamento em 10x de exemplo. Como o site é demonstrativo, nenhuma compra real é realizada.',
        entrega: 'Este é um site demonstrativo, então não há entrega real. Em uma loja de verdade, o prazo e o frete seriam calculados no fechamento do pedido.',
        montagem: 'A montagem funciona assim: 1) conversamos sobre o seu uso; 2) escolhemos as peças certas; 3) montamos e testamos; 4) entregamos o setup pronto, com garantia e suporte.'
    };

    var estado = { faixa: null };
    var iniciado = false;

    /* ---------- Utilidades ---------- */

    function moeda(v) {
        return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function norm(t) {
        return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function orcamento(t) {
        var m = t.match(/(\d+)\s*mil/);
        if (m) return Number(m[1]) * 1000;

        m = t.match(/(\d{1,3}(?:\.\d{3})+|\d{4,})/);
        if (m) return Number(m[1].replace(/\./g, ''));

        return 0;
    }

    function uso(t) {
        if (/jogo|jogar|game|gamer|fps|valorant|fortnite/.test(t)) return 'jogos';
        if (/edic|video|render|criac|stream|design|3d/.test(t)) return 'criacao';
        if (/trabalho|trabalhar|estudo|estudar|faculdade|escola|office/.test(t)) return 'trabalho';
        return '';
    }

    /* ---------- Interface ---------- */

    var ICONE_RAPOSA =
        '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
        '<path d="M6 4 L15 12 Q20 11 25 12 L34 4 L36 18 L33 27 L20 37 L7 27 L4 18 Z" fill="#ff6a00"/>' +
        '<path d="M12 20 L18 21 L17 23 L11 22 Z M28 20 L22 21 L23 23 L29 22 Z" fill="#0a0a0a"/>' +
        '<path d="M17 30 L23 30 L20 33 Z" fill="#0a0a0a"/>' +
        '</svg>';

    var raiz = document.createElement('div');
    raiz.className = 'cb';

    raiz.innerHTML =
        '<section class="cb-painel" id="cb-painel" role="dialog" aria-label="Assistente de compras da ForjaByte">' +
        '<header class="cb-topo">' +
        '<div class="cb-avatar">' + ICONE_RAPOSA + '</div>' +
        '<div class="cb-titulo"><strong>Assistente ForjaByte</strong><small>Ajuda para escolher PC e peças</small></div>' +
        '<button type="button" class="cb-fechar" id="cb-fechar" aria-label="Fechar assistente">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '</header>' +
        '<div class="cb-log" id="cb-log" role="log" aria-live="polite" aria-label="Conversa com o assistente"></div>' +
        '<form class="cb-form" id="cb-form" autocomplete="off">' +
        '<label class="sr" for="cb-texto">Digite sua mensagem</label>' +
        '<input type="text" id="cb-texto" placeholder="Ex.: PC para jogos até 5 mil" maxlength="200">' +
        '<button type="submit" class="cb-enviar" aria-label="Enviar mensagem">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12l16-8-6 16-3-7z"/></svg>' +
        '</button>' +
        '</form>' +
        '<p class="cb-aviso">Assistente automático com respostas pré-definidas.</p>' +
        '</section>' +
        '<button type="button" class="cb-toggle" id="cb-toggle" aria-expanded="false" aria-controls="cb-painel" aria-label="Abrir assistente de compras">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>' +
        '<span>Ajuda para comprar</span>' +
        '</button>';

    document.body.appendChild(raiz);

    var log = document.getElementById('cb-log');
    var campo = document.getElementById('cb-texto');
    var botao = document.getElementById('cb-toggle');

    function rolar() {
        log.scrollTop = log.scrollHeight;
    }

    function usuario(texto) {
        var el = document.createElement('div');
        el.className = 'cb-msg cb-user';
        el.textContent = texto;
        log.appendChild(el);
        rolar();
    }

    function limparOpcoes() {
        var antigas = log.querySelectorAll('.cb-opcoes');
        Array.prototype.forEach.call(antigas, function (el) { el.remove(); });
    }

    function falar(texto, depois) {
        var el = document.createElement('div');
        el.className = 'cb-msg cb-bot cb-digitando';
        el.setAttribute('aria-label', 'Digitando');
        el.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(el);
        rolar();

        setTimeout(function () {
            el.className = 'cb-msg cb-bot';
            el.removeAttribute('aria-label');
            el.textContent = texto;
            rolar();

            if (depois) depois();
        }, 450);
    }

    function opcoes(lista) {
        var caixa = document.createElement('div');
        caixa.className = 'cb-opcoes';

        lista.forEach(function (item) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'cb-opcao';
            b.textContent = item[0];

            b.addEventListener('click', function () {
                limparOpcoes();
                usuario(item[0]);
                item[1]();
            });

            caixa.appendChild(b);
        });

        log.appendChild(caixa);
        rolar();
    }

    function cartoes(ids) {
        var caixa = document.createElement('div');
        caixa.className = 'cb-cartoes';

        ids.forEach(function (id) {
            var p = PRODUTOS[id];
            if (!p) return;

            var c = document.createElement('div');
            c.className = 'cb-cartao';

            var nome = document.createElement('strong');
            nome.textContent = p.n;

            var det = document.createElement('span');
            det.className = 'cb-det';
            det.textContent = p.d;

            var preco = document.createElement('span');
            preco.className = 'cb-preco';
            preco.textContent = moeda(p.p);

            var add = document.createElement('button');
            add.type = 'button';
            add.className = 'cb-add';
            add.textContent = 'Adicionar ao carrinho';
            add.setAttribute('aria-label', 'Adicionar ' + p.n + ' ao carrinho');
            add.addEventListener('click', function () { adicionar(id); });

            c.appendChild(nome);
            c.appendChild(det);
            c.appendChild(preco);
            c.appendChild(add);
            caixa.appendChild(c);
        });

        log.appendChild(caixa);
        rolar();
    }

    function linkCarrinho() {
        var a = document.createElement('a');
        a.className = 'cb-opcao cb-link';
        a.href = 'catalogo.html#carrinho-sec';
        a.textContent = 'Ver meu carrinho';
        log.appendChild(a);
        rolar();
    }

    /* ---------- Carrinho ---------- */

    function adicionar(id) {
        var c = {};

        try {
            c = JSON.parse(localStorage.getItem('fb_cart') || '{}');
        } catch (e) {
            c = {};
        }

        c[id] = (c[id] || 0) + 1;

        try {
            localStorage.setItem('fb_cart', JSON.stringify(c));
        } catch (e) {
            falar('Não consegui salvar o carrinho neste navegador.');
            return;
        }

        var nome = PRODUTOS[id].n;

        // Na página do catálogo, recarrega para o carrinho aparecer atualizado
        if (/catalogo\.html$/.test(location.pathname)) {
            try {
                sessionStorage.setItem(REABRIR, nome);
            } catch (e) { }

            location.reload();
            return;
        }

        falar(nome + ' foi adicionado ao carrinho.', function () {
            linkCarrinho();
            posAcao();
        });
    }

    /* ---------- Conversa ---------- */

    function menu() {
        falar('Como posso ajudar?', function () {
            opcoes([
                ['Quero um PC pronto', pcUso],
                ['Peças para montar ou atualizar', pecas],
                ['Periféricos', perifericos],
                ['Itens para escritório', function () { grupo('esc'); }],
                ['Dúvidas (garantia, pagamento...)', duvidas]
            ]);
        });
    }

    function posAcao() {
        falar('Posso ajudar com mais alguma coisa?', function () {
            opcoes([
                ['Voltar ao menu', menu],
                ['Abrir catálogo completo', function () { location.href = 'catalogo.html'; }]
            ]);
        });
    }

    function saudacao() {
        falar('Olá! Sou o assistente da ForjaByte e posso ajudar você a escolher um PC, peças ou periféricos.', menu);
    }

    /* PC pronto */

    function pcUso() {
        falar('Para que você vai usar o computador?', function () {
            opcoes([
                ['Jogos', function () { escolherUso('jogos'); }],
                ['Trabalho e estudo', function () { escolherUso('trabalho'); }],
                ['Edição e criação', function () { escolherUso('criacao'); }]
            ]);
        });
    }

    function escolherUso(u) {
        if (estado.faixa) {
            var f = estado.faixa;
            estado.faixa = null;
            pcRec(u, f);
        } else {
            pcOrc(u);
        }
    }

    function pcOrc(u) {
        falar('Perfeito, para ' + USO_TXT[u] + '. Qual é o seu orçamento?', function () {
            opcoes([
                ['Até R$ 4.000', function () { pcRec(u, 'a'); }],
                ['Até R$ 7.000', function () { pcRec(u, 'b'); }],
                ['Acima de R$ 7.000', function () { pcRec(u, 'c'); }]
            ]);
        });
    }

    function pcRec(u, f) {
        var ids = PC_REC[u][f];

        falar('Para ' + USO_TXT[u] + ', ' + FAIXA_TXT[f] + ', estas são as melhores opções do catálogo:', function () {
            cartoes(ids);

            falar('Todos os PCs prontos são montados e testados. Quer ver outra faixa de preço?', function () {
                opcoes([
                    ['Ver outra faixa de preço', function () { pcOrc(u); }],
                    ['Ver peças avulsas', pecas],
                    ['Abrir catálogo completo', function () { location.href = 'catalogo.html'; }],
                    ['Voltar ao menu', menu]
                ]);
            });
        });
    }

    function pcFlow(u, b) {
        if (b && b < 2299) {
            falar('O PC pronto mais em conta do catálogo custa R$ 2.299. Com esse valor, posso sugerir peças ou periféricos.', function () {
                opcoes([
                    ['Ver peças', pecas],
                    ['Ver periféricos', perifericos],
                    ['Voltar ao menu', menu]
                ]);
            });
            return;
        }

        var f = b ? (b <= 4000 ? 'a' : (b <= 7000 ? 'b' : 'c')) : '';

        if (u && f) return pcRec(u, f);

        if (f) {
            estado.faixa = f;
            return pcUso();
        }

        if (u) return pcOrc(u);

        pcUso();
    }

    /* Peças e periféricos */

    function pecas() {
        falar('Qual peça você procura?', function () {
            opcoes([
                ['Processador', function () { grupo('cpu'); }],
                ['Placa de vídeo', function () { grupo('gpu'); }],
                ['Memória RAM', function () { grupo('ram'); }],
                ['SSD', function () { grupo('ssd'); }],
                ['Placa-mãe, fonte e cooler', function () { grupo('outros'); }]
            ]);
        });
    }

    function perifericos() {
        falar('O que você quer incluir no seu setup?', function () {
            opcoes([
                ['Teclado e mouse', function () { grupo('tm'); }],
                ['Headset, microfone e webcam', function () { grupo('av'); }],
                ['Monitor', function () { grupo('mon'); }],
                ['Cadeira e acessórios', function () { grupo('acc'); }]
            ]);
        });
    }

    function grupo(chave) {
        var g = GRUPOS[chave];

        falar('Estas são as nossas opções de ' + g.titulo + ':', function () {
            cartoes(g.ids);

            if (g.dica) {
                falar(g.dica, posAcao);
            } else {
                posAcao();
            }
        });
    }

    /* Dúvidas */

    function duvidas() {
        falar('Sobre o que você quer saber?', function () {
            opcoes([
                ['Garantia e suporte', function () { duvida('garantia'); }],
                ['Formas de pagamento', function () { duvida('pagamento'); }],
                ['Entrega', function () { duvida('entrega'); }],
                ['Montagem sob medida', function () { duvida('montagem'); }]
            ]);
        });
    }

    function duvida(chave) {
        falar(DUVIDAS[chave], posAcao);
    }

    /* Texto digitado pela pessoa */

    function entender(texto) {
        var t = norm(texto);
        var u = uso(t);
        var b = orcamento(t);

        if (/\b(oi|ola|opa|e ai|bom dia|boa tarde|boa noite)\b/.test(t) && t.length < 25) return saudacao();
        if (/garantia|assistencia|suporte tecnico|atendimento/.test(t)) return duvida('garantia');
        if (/pagamento|parcel|cartao|pix|boleto|pagar/.test(t)) return duvida('pagamento');
        if (/entrega|frete|prazo|enviar/.test(t)) return duvida('entrega');
        if (/montagem|sob medida|personaliz/.test(t)) return duvida('montagem');

        if (/carrinho|finalizar/.test(t)) {
            return falar('Seu carrinho fica na página do catálogo.', function () {
                linkCarrinho();
                posAcao();
            });
        }

        if (/placa de video|placa grafica|gpu|\bvga\b/.test(t)) return grupo('gpu');
        if (/processador|\bcpu\b/.test(t)) return grupo('cpu');
        if (/memoria|\bram\b/.test(t)) return grupo('ram');
        if (/\bssd\b|armazenamento|\bhd\b/.test(t)) return grupo('ssd');
        if (/fonte|cooler|gabinete|placa.mae/.test(t)) return grupo('outros');

        if (/mousepad|cadeira|suporte|articulado/.test(t)) return grupo('acc');
        if (/teclado|mouse/.test(t)) return grupo('tm');
        if (/headset|fone|microfone|webcam|camera/.test(t)) return grupo('av');
        if (/monitor|tela/.test(t)) return grupo('mon');
        if (/escritorio|nobreak/.test(t)) return grupo('esc');

        if (/\bpcs?\b|computador|desktop|maquina/.test(t) || u || b) return pcFlow(u, b);

        falar('Não entendi muito bem. Você pode escolher uma das opções abaixo ou escrever algo como "PC para jogos até 5 mil" ou "placa de vídeo".', menu);
    }

    /* ---------- Abrir e fechar ---------- */

    function abrir(foco) {
        raiz.classList.add('aberto');
        botao.setAttribute('aria-expanded', 'true');
        botao.setAttribute('aria-label', 'Fechar assistente de compras');

        if (!iniciado) {
            iniciado = true;
            saudacao();
        }

        if (foco !== false) campo.focus();
    }

    function fechar() {
        raiz.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir assistente de compras');
    }

    botao.addEventListener('click', function () {
        if (raiz.classList.contains('aberto')) {
            fechar();
        } else {
            abrir();
        }
    });

    document.getElementById('cb-fechar').addEventListener('click', function () {
        fechar();
        botao.focus();
    });

    raiz.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && raiz.classList.contains('aberto')) {
            fechar();
            botao.focus();
        }
    });

    document.getElementById('cb-form').addEventListener('submit', function (e) {
        e.preventDefault();

        var texto = campo.value.trim();
        if (!texto) return;

        campo.value = '';
        limparOpcoes();
        usuario(texto);
        entender(texto);
    });

    /* Depois de adicionar um item no catálogo, a página recarrega: reabre o chat */

    var reabrir = null;

    try {
        reabrir = sessionStorage.getItem(REABRIR);
        sessionStorage.removeItem(REABRIR);
    } catch (e) { }

    if (reabrir) {
        iniciado = true;
        abrir(false);

        falar(reabrir + ' foi adicionado ao carrinho.', function () {
            linkCarrinho();
            posAcao();
        });
    }
})();