(function () {
    var imagens = {
        pc: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=700&q=80',
        pc2: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=700&q=80',
        cpu: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=700&q=80',
        gpu: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=700&q=80',
        ram: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=700&q=80',
        ssd: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=700&q=80',
        teclado: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
        mouse: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80',
        headset: 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=700&q=80',
        monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80',
        cadeira: 'https://images.unsplash.com/photo-1598300053653-7ca5b8a1f9f7?auto=format&fit=crop&w=700&q=80',
        fonte: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80'
    };

    var produtos = [
        { id: 1, nome: 'PC Gamer Fox Entrada', cat: 'PCs montados', img: 'pc', preco: 3499, sp: ['Processador 6 núcleos', '16 GB RAM DDR4', 'SSD NVMe 500 GB'] },
        { id: 2, nome: 'PC Gamer Fox Pro', cat: 'PCs montados', img: 'pc2', preco: 5999, sp: ['Processador 8 núcleos', '32 GB RAM DDR4', 'SSD NVMe 1 TB'] },
        { id: 3, nome: 'PC Gamer Fox Ultra', cat: 'PCs montados', img: 'pc', preco: 9499, sp: ['Processador 12 núcleos', '32 GB RAM DDR5', 'SSD NVMe 2 TB'] },
        { id: 4, nome: 'PC Office Núcleo', cat: 'PCs montados', img: 'pc2', preco: 2299, sp: ['Processador 4 núcleos', '8 GB RAM', 'SSD 240 GB'] },
        { id: 5, nome: 'Processador 6 Núcleos', cat: 'Peças', img: 'cpu', preco: 899, sp: ['6 núcleos / 12 threads', 'Até 4.5 GHz', 'Cooler incluso'] },
        { id: 6, nome: 'Placa de Vídeo 8 GB', cat: 'Peças', img: 'gpu', preco: 2199, sp: ['8 GB de memória', 'Dois ventiladores', 'HDMI e DisplayPort'] },
        { id: 7, nome: 'Memória RAM 16 GB', cat: 'Peças', img: 'ram', preco: 289, sp: ['DDR4 3200 MHz', 'Kit 2 x 8 GB', 'Dissipador de calor'] },
        { id: 8, nome: 'SSD NVMe 1 TB', cat: 'Peças', img: 'ssd', preco: 429, sp: ['Formato M.2', 'Alta velocidade', 'Armazenamento 1 TB'] },
        { id: 9, nome: 'Placa-mãe Gaming', cat: 'Peças', img: 'cpu', preco: 799, sp: ['Compatível com processadores selecionados', 'Slots de memória', 'Conexões variadas'] },
        { id: 10, nome: 'Fonte 650 W', cat: 'Peças', img: 'fonte', preco: 399, sp: ['Potência 650 W', 'Proteções elétricas', 'Ventilação integrada'] },
        { id: 11, nome: 'Gabinete Gamer RGB', cat: 'Peças', img: 'pc', preco: 349, sp: ['Painel lateral transparente', 'Ventilação frontal', 'Visual gamer'] },
        { id: 12, nome: 'Cooler para Processador', cat: 'Peças', img: 'cpu', preco: 159, sp: ['Dissipação de calor', 'Ventilador integrado', 'Instalação simplificada'] },
        { id: 13, nome: 'Teclado Mecânico RGB', cat: 'Periféricos', img: 'teclado', preco: 249, sp: ['Switch mecânico', 'Iluminação RGB', 'Layout ABNT2'] },
        { id: 14, nome: 'Mouse Gamer 12.000 DPI', cat: 'Periféricos', img: 'mouse', preco: 129, sp: ['Sensor óptico', '6 botões programáveis', 'Iluminação RGB'] },
        { id: 15, nome: 'Headset Gamer 7.1', cat: 'Periféricos', img: 'headset', preco: 199, sp: ['Som surround virtual', 'Microfone integrado', 'Conexão USB'] },
        { id: 16, nome: 'Monitor 24 polegadas', cat: 'Periféricos', img: 'monitor', preco: 899, sp: ['Tela Full HD', '144 Hz demonstrativo', 'HDMI e DisplayPort'] },
        { id: 17, nome: 'Webcam Full HD', cat: 'Periféricos', img: 'monitor', preco: 179, sp: ['Vídeo Full HD', 'Microfone integrado', 'Conexão USB'] },
        { id: 18, nome: 'Cadeira Gamer', cat: 'Periféricos', img: 'cadeira', preco: 899, sp: ['Encosto reclinável', 'Apoio para braços', 'Design ergonômico'] },
        { id: 19, nome: 'Kit Teclado e Mouse', cat: 'Escritório', img: 'teclado', preco: 119, sp: ['Conexão sem fio', 'Teclas silenciosas', 'Uso diário'] },
        { id: 20, nome: 'Monitor para Escritório', cat: 'Escritório', img: 'monitor', preco: 649, sp: ['Tela Full HD', 'Uso profissional', 'Conexão HDMI'] },
        { id: 21, nome: 'PC Gamer Fox Elite', cat: 'PCs montados', img: 'pc2', preco: 7999, sp: ['Processador 8 núcleos de alto clock', '32 GB RAM DDR5', 'SSD NVMe 1 TB + Placa de vídeo 12 GB'] },
        { id: 22, nome: 'PC Creator Studio', cat: 'PCs montados', img: 'pc', preco: 7499, sp: ['Processador 12 núcleos', '64 GB RAM DDR5', 'SSD NVMe 2 TB para projetos'] },
        { id: 23, nome: 'PC Office Plus', cat: 'PCs montados', img: 'pc2', preco: 3199, sp: ['Processador 6 núcleos', '16 GB RAM DDR4', 'SSD NVMe 500 GB'] },
        { id: 24, nome: 'Placa de Vídeo 12 GB', cat: 'Peças', img: 'gpu', preco: 3899, sp: ['12 GB de memória', 'Três ventiladores', 'HDMI e DisplayPort'] },
        { id: 25, nome: 'Placa de Vídeo 16 GB', cat: 'Peças', img: 'gpu', preco: 5499, sp: ['16 GB de memória', 'Refrigeração reforçada', 'Ideal para 1440p e 4K'] },
        { id: 26, nome: 'Processador 8 Núcleos', cat: 'Peças', img: 'cpu', preco: 1399, sp: ['8 núcleos / 16 threads', 'Até 4.9 GHz', 'Cooler incluso'] },
        { id: 27, nome: 'Processador 12 Núcleos', cat: 'Peças', img: 'cpu', preco: 2299, sp: ['12 núcleos / 24 threads', 'Até 5.2 GHz', 'Desbloqueado para overclock'] },
        { id: 28, nome: 'Memória RAM 32 GB DDR5', cat: 'Peças', img: 'ram', preco: 749, sp: ['DDR5 5600 MHz', 'Kit 2 x 16 GB', 'Dissipador de calor'] },
        { id: 29, nome: 'SSD NVMe 2 TB', cat: 'Peças', img: 'ssd', preco: 799, sp: ['Formato M.2', 'Alta velocidade de leitura', 'Armazenamento 2 TB'] },
        { id: 30, nome: 'Water Cooler 240 mm', cat: 'Peças', img: 'cpu', preco: 449, sp: ['Radiador de 240 mm', 'Dois ventiladores PWM', 'Iluminação ARGB'] },
        { id: 31, nome: 'Fonte 750 W 80 Plus Gold', cat: 'Peças', img: 'fonte', preco: 649, sp: ['Potência 750 W', 'Certificação 80 Plus Gold', 'Cabos modulares'] },
        { id: 32, nome: 'Teclado 60% Sem Fio', cat: 'Periféricos', img: 'teclado', preco: 299, sp: ['Formato compacto 60%', 'Conexão Bluetooth e USB', 'Iluminação RGB'] },
        { id: 33, nome: 'Mouse Sem Fio Ultraleve', cat: 'Periféricos', img: 'mouse', preco: 189, sp: ['Peso reduzido', 'Sensor óptico preciso', 'Bateria de longa duração'] },
        { id: 34, nome: 'Monitor 27 polegadas QHD', cat: 'Periféricos', img: 'monitor', preco: 1799, sp: ['Resolução QHD', '165 Hz demonstrativo', 'HDMI e DisplayPort'] },
        { id: 35, nome: 'Mousepad Extended', cat: 'Periféricos', img: 'mouse', preco: 79, sp: ['Tamanho grande', 'Base antiderrapante', 'Superfície de baixo atrito'] },
        { id: 36, nome: 'Microfone USB para Streaming', cat: 'Periféricos', img: 'headset', preco: 229, sp: ['Captação cardioide', 'Conexão USB', 'Botão de mudo'] },
        { id: 37, nome: 'Headset Gamer Sem Fio', cat: 'Periféricos', img: 'headset', preco: 349, sp: ['Conexão sem fio 2.4 GHz', 'Microfone removível', 'Bateria para uso prolongado'] },
        { id: 38, nome: 'Monitor 22 polegadas', cat: 'Escritório', img: 'monitor', preco: 529, sp: ['Tela Full HD', 'Painel que reduz cansaço visual', 'Conexão HDMI e VGA'] },
        { id: 39, nome: 'Nobreak 600 VA', cat: 'Escritório', img: 'fonte', preco: 399, sp: ['Protege contra queda de energia', 'Tomadas no padrão brasileiro', 'Bateria selada'] },
        { id: 40, nome: 'Suporte Articulado para Monitor', cat: 'Escritório', img: 'monitor', preco: 169, sp: ['Ajuste de altura e ângulo', 'Compatível com padrão VESA', 'Organiza os cabos'] }
    ];

    // id do produto: percentual de desconto
    var OFERTAS = {
        1: 12, 2: 10, 3: 15, 4: 8, 6: 10, 7: 15, 8: 12, 13: 20, 14: 15, 15: 18,
        16: 10, 18: 12, 21: 10, 24: 8, 28: 12, 29: 15, 32: 10, 34: 8, 37: 20, 38: 12
    };

    produtos.forEach(function (p) {
        p.de = p.preco;                       // preço original
        p.off = OFERTAS[p.id] || 0;           // % de desconto
        if (p.off) p.preco = Math.round(p.de * (100 - p.off) / 100);
    });

    function moeda(v) {
        return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function escapar(t) {
        return String(t).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function card(p, i) {
        var url = imagens[p.img] || imagens.pc;

        return '<article class="prod" style="--i:' + Math.min(i || 0, 12) + '">' +
            '<div class="img">' +
            (p.off ? '<span class="selo-off">-' + p.off + '%</span>' : '') +
            '<img src="' + url + '" alt="' + escapar(p.nome) + '" loading="lazy"></div>' +
            '<div class="corpo">' +
            '<span class="cat-tag">' + escapar(p.cat) + '</span>' +
            '<h3>' + escapar(p.nome) + '</h3>' +
            '<ul>' + p.sp.map(function (s) { return '<li>' + escapar(s) + '</li>'; }).join('') + '</ul>' +
            '<div class="preco">' +
            (p.off ? '<span class="de">' + moeda(p.de) + '</span>' : '') +
            moeda(p.preco) +
            '<small>ou 10x de ' + moeda(p.preco / 10) + ' • preço demonstrativo</small></div>' +
            '<button type="button" data-add="' + p.id + '">Adicionar ao carrinho</button>' +
            '</div></article>';
    }

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
            return true;
        } catch (e) {
            return false;
        }
    }

    // Imagem de reserva se alguma foto da internet não carregar
    function fallback(el) {
        el.addEventListener('error', function (e) {
            var img = e.target;

            if (img.tagName === 'IMG' && !img.getAttribute('data-reserva')) {
                img.setAttribute('data-reserva', '1');
                img.src = imagens.pc;
            }
        }, true);
    }

    window.FB_PRODUTOS = produtos;
    window.FB_IMAGENS = imagens;
    window.FB_UTIL = {
        moeda: moeda,
        escapar: escapar,
        card: card,
        adicionar: adicionar,
        fallback: fallback,
        achar: function (id) {
            return produtos.filter(function (p) { return p.id === Number(id); })[0];
        }
    };
})();