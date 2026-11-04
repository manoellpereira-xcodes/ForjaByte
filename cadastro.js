(function () {
    var KEY_USERS = 'fb_users';
    var KEY_SESSION = 'fb_sessao';
    var IDADE_MINIMA = 18; // idade mínima para criar a conta
    // Se o arquivo de avatares não carregar, o resto do cadastro continua funcionando
    var AV = window.FB_AVATAR || {
        seletor: function () {
            return { valor: function () { return 'classica'; }, definir: function () { } };
        },
        html: function () { return ''; }
    };

    if (!window.FB_AVATAR) {
        console.error('ForjaByte: avatares não carregou. Confira o nome do arquivo no <script> (avatars.js x avatares.js).');
    }

    var UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

    function $(id) {
        return document.getElementById(id);
    }

    function soDigitos(t) {
        return String(t || '').replace(/\D/g, '');
    }

    /* ---------- Armazenamento ---------- */

    function lerUsuarios() {
        try {
            return JSON.parse(localStorage.getItem(KEY_USERS) || '{}');
        } catch (e) {
            return {};
        }
    }

    function salvarUsuarios(usuarios) {
        try {
            localStorage.setItem(KEY_USERS, JSON.stringify(usuarios));
            return true;
        } catch (e) {
            return false;
        }
    }

    function lerSessao() {
        try {
            return JSON.parse(sessionStorage.getItem(KEY_SESSION) || 'null');
        } catch (e) {
            return null;
        }
    }

    function gravarSessao(s) {
        try {
            sessionStorage.setItem(KEY_SESSION, JSON.stringify(s));
            return true;
        } catch (e) {
            return false;
        }
    }

    function avisarSessao() {
        window.dispatchEvent(new Event('fb-sessao'));
    }

    /* ---------- Mensagens e erros ---------- */

    function mensagem(id, tipo, texto) {
        var el = $(id);
        el.className = 'msg ' + tipo;
        el.textContent = texto;
    }

    function limparMensagem(id) {
        var el = $(id);
        el.className = 'msg';
        el.textContent = '';
    }

    function erro(id, texto, campo) {
        $(id).textContent = texto || '';

        if (campo) {
            if (texto) {
                $(campo).setAttribute('aria-invalid', 'true');
            } else {
                $(campo).removeAttribute('aria-invalid');
            }
        }

        return !texto;
    }

    function hash(senha) {
        // Hash demonstrativo. Não substitui autenticação segura no servidor.
        var h = 2166136261;
        for (var i = 0; i < senha.length; i++) {
            h ^= senha.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return (h >>> 0).toString(16);
    }

    /* ---------- Máscaras e formatação ---------- */

    function mascaraCep(v) {
        var d = soDigitos(v).slice(0, 8);
        return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    }

    function mascaraTel(v) {
        var d = soDigitos(v).slice(0, 11);

        if (d.length > 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
        if (d.length > 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
        if (d.length > 2) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
        return d;
    }

    function formatarData(iso) {
        var p = String(iso || '').split('-');
        return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : '';
    }

    // Idade completa a partir de "AAAA-MM-DD". Retorna null se a data for inválida.
    function calcularIdade(iso) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
        if (!m) return null;

        var ano = Number(m[1]);
        var mes = Number(m[2]);
        var dia = Number(m[3]);
        var data = new Date(ano, mes - 1, dia);

        if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return null;

        var hoje = new Date();
        var idade = hoje.getFullYear() - ano;

        if (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)) idade--;

        return idade < 0 ? null : idade;
    }

    /* ---------- Seletor de foto do cadastro ---------- */

    var pickCad = AV.seletor($('pick-cad'), 'classica');
    var pickUser = null;

    /* ---------- Abas ---------- */

    function abrirAba(nome, focar) {
        var cadastro = nome === 'cad';

        $('aba-cad').setAttribute('aria-selected', String(cadastro));
        $('aba-login').setAttribute('aria-selected', String(!cadastro));
        $('aba-cad').tabIndex = cadastro ? 0 : -1;
        $('aba-login').tabIndex = cadastro ? -1 : 0;
        $('f-cad').hidden = !cadastro;
        $('f-login').hidden = cadastro;

        if (focar) {
            $(cadastro ? 'aba-cad' : 'aba-login').focus();
        }
    }

    $('aba-cad').addEventListener('click', function () { abrirAba('cad'); });
    $('aba-login').addEventListener('click', function () { abrirAba('login'); });

    document.querySelector('.abas').addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
            e.preventDefault();
            var emCadastro = $('aba-cad').getAttribute('aria-selected') === 'true';

            if (e.key === 'Home') {
                abrirAba('cad', true);
            } else if (e.key === 'End') {
                abrirAba('login', true);
            } else {
                abrirAba(emCadastro ? 'login' : 'cad', true);
            }
        }
    });

    /* ---------- Força da senha ---------- */

    var textosForca = ['Mínimo de 8 caracteres, com letras e números.', 'Força da senha: fraca', 'Força da senha: razoável', 'Força da senha: boa', 'Força da senha: forte'];

    function nivelSenha(senha) {
        if (!senha) return 0;

        var pontos = 0;

        if (senha.length >= 8) pontos++;
        if (senha.length >= 12) pontos++;
        if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
        if (/\d/.test(senha) && /[^A-Za-z0-9]/.test(senha)) pontos++;

        return Math.max(1, Math.min(pontos, 4));
    }

    function atualizarForca(senha) {
        var nivel = nivelSenha(senha);
        $('forca-barra').setAttribute('data-nivel', String(nivel));
        $('forca-txt').textContent = textosForca[nivel];
    }

    $('c-senha').addEventListener('input', function () {
        atualizarForca(this.value);
    });

    /* ---------- Mostrar senhas ---------- */

    $('c-ver').addEventListener('change', function () {
        $('c-senha').type = this.checked ? 'text' : 'password';
        $('c-conf').type = this.checked ? 'text' : 'password';
    });

    $('l-ver').addEventListener('change', function () {
        $('l-senha').type = this.checked ? 'text' : 'password';
    });

    /* ---------- Idade (a partir da data de nascimento) ---------- */

    var TEXTO_IDADE = 'Usamos para calcular sua idade.';

    $('c-nasc').max = new Date().toISOString().slice(0, 10);

    $('c-nasc').addEventListener('input', function () {
        var idade = calcularIdade(this.value);
        $('idade-txt').textContent = idade === null ? TEXTO_IDADE : 'Idade: ' + idade + (idade === 1 ? ' ano' : ' anos');
    });

    /* ---------- Telefone ---------- */

    $('c-tel').addEventListener('input', function () {
        this.value = mascaraTel(this.value);
    });

    /* ---------- CEP: máscara e preenchimento automático (ViaCEP) ---------- */

    var cepConsultado = '';
    var consultaAtual = 0;

    function statusCep(tipo, texto) {
        var el = $('cep-status');
        el.className = 'cep-status' + (tipo ? ' ' + tipo : '');
        el.textContent = texto || '';
    }

    function pegarJson(url, controle) {
        return fetch(url, controle ? { signal: controle.signal } : {}).then(function (r) {
            if (!r.ok) throw new Error('http ' + r.status);
            return r.json();
        });
    }

    // Normaliza as respostas das duas APIs: { rua, bairro, cidade, uf } ou null se o CEP não existe
    function viaCep(cep, controle) {
        return pegarJson('https://viacep.com.br/ws/' + cep + '/json/', controle).then(function (d) {
            if (d.erro) return null;
            return { rua: d.logradouro, bairro: d.bairro, cidade: d.localidade, uf: d.uf };
        });
    }

    function brasilApi(cep, controle) {
        return pegarJson('https://brasilapi.com.br/api/cep/v2/' + cep, controle).then(function (d) {
            return { rua: d.street, bairro: d.neighborhood, cidade: d.city, uf: d.state };
        });
    }

    function preencherEndereco(d) {
        var campos = [
            ['c-rua', 'e-rua', d.rua],
            ['c-bairro', 'e-bairro', d.bairro],
            ['c-cidade', 'e-cidade', d.cidade],
            ['c-uf', 'e-uf', d.uf]
        ];

        campos.forEach(function (c) {
            $(c[0]).value = c[2] || '';
            if (c[2]) erro(c[1], '', c[0]);
        });
    }

    function buscarCep() {
        var cep = soDigitos($('c-cep').value);

        if (cep.length !== 8) {
            cepConsultado = '';
            statusCep('', '');
            return;
        }

        if (cep === cepConsultado) return;
        cepConsultado = cep;

        var minhaConsulta = ++consultaAtual;
        var controle = window.AbortController ? new AbortController() : null;
        var limite = setTimeout(function () { if (controle) controle.abort(); }, 8000);

        statusCep('load', 'Buscando endereço...');

        viaCep(cep, controle)
            .catch(function () {
                // ViaCEP fora do ar ou bloqueado: tenta a BrasilAPI
                return brasilApi(cep, window.AbortController ? new AbortController() : null);
            })
            .then(function (d) {
                if (minhaConsulta !== consultaAtual) return;

                if (!d) {
                    cepConsultado = '';
                    statusCep('bad', 'CEP não encontrado. Confira os números ou preencha o endereço manualmente.');
                    return;
                }

                preencherEndereco(d);
                erro('e-cep', '', 'c-cep');

                // CEPs gerais (cidades pequenas) vêm sem rua e/ou bairro: avisa o que falta
                var faltou = [];
                if (!d.rua) faltou.push('rua');
                if (!d.bairro) faltou.push('bairro');

                if (faltou.length) {
                    statusCep('ok', 'Cidade encontrada. Esse CEP não traz ' + faltou.join(' e ') + ': preencha manualmente.');
                    $(!d.rua ? 'c-rua' : 'c-bairro').focus();
                } else {
                    statusCep('ok', 'Endereço encontrado. Confira e informe o número.');
                    if (document.activeElement === $('c-cep')) $('c-num').focus();
                }
            })
            .catch(function () {
                if (minhaConsulta !== consultaAtual) return;
                cepConsultado = '';
                statusCep('bad', 'Não foi possível consultar o CEP agora. Preencha o endereço manualmente.');
            })
            .then(function () {
                clearTimeout(limite);
            });
    }

    $('c-cep').addEventListener('input', function () {
        this.value = mascaraCep(this.value);
        buscarCep();
    });

    $('c-cep').addEventListener('blur', buscarCep);

    $('c-uf').addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-z]/g, '').toUpperCase();
    });

    /* ---------- Dados da conta conectada ---------- */

    function linhaDado(lista, rotulo, valor) {
        if (!valor) return;

        var linha = document.createElement('div');
        var dt = document.createElement('dt');
        var dd = document.createElement('dd');

        dt.textContent = rotulo;
        dd.textContent = valor;

        linha.appendChild(dt);
        linha.appendChild(dd);
        lista.appendChild(linha);
    }

    function textoEndereco(e) {
        if (!e) return '';

        var rua = e.rua + (e.numero ? ', ' + e.numero : '') + (e.complemento ? ' - ' + e.complemento : '');
        return rua + '\n' + e.bairro + ' - ' + e.cidade + '/' + e.uf + '\nCEP ' + mascaraCep(e.cep);
    }

    function desenharDados(sessao) {
        var lista = $('dados-logado');
        var u = lerUsuarios()[sessao.email] || {};
        var idade = calcularIdade(u.nasc);

        lista.textContent = '';

        linhaDado(lista, 'Idade', idade === null ? '' : idade + (idade === 1 ? ' ano' : ' anos') + ' (' + formatarData(u.nasc) + ')');
        linhaDado(lista, 'Telefone', mascaraTel(u.telefone));
        linhaDado(lista, 'Endereço', textoEndereco(u.endereco));
    }

    /* ---------- Estado da sessão ---------- */

    function mostrarEstado() {
        var sessao = lerSessao();

        $('logado').style.display = sessao ? 'block' : 'none';
        $('forms').style.display = sessao ? 'none' : 'grid';

        if (sessao) {
            $('nome-logado').textContent = sessao.nome;
            $('email-logado').textContent = sessao.email || '';
            $('avatar-logado').innerHTML = AV.html(sessao.avatar);
            desenharDados(sessao);
        } else {
            $('troca-foto').hidden = true;
            $('alterar-foto').setAttribute('aria-expanded', 'false');
        }

        avisarSessao();
    }

    /* ---------- Criar conta ---------- */

    $('f-cad').addEventListener('submit', function (e) {
        e.preventDefault();

        var nome = $('c-nome').value.trim().replace(/\s+/g, ' ');
        var nasc = $('c-nasc').value;
        var tel = soDigitos($('c-tel').value);
        var cep = soDigitos($('c-cep').value);
        var rua = $('c-rua').value.trim();
        var numero = $('c-num').value.trim();
        var comp = $('c-comp').value.trim();
        var bairro = $('c-bairro').value.trim();
        var cidade = $('c-cidade').value.trim();
        var uf = $('c-uf').value.trim().toUpperCase();
        var email = $('c-email').value.trim().toLowerCase();
        var senha = $('c-senha').value;
        var conf = $('c-conf').value;

        var ok = true;
        var primeiro = null;

        function checar(campo, idErro, texto) {
            var bom = erro(idErro, texto, campo);
            if (!bom && !primeiro) primeiro = campo;
            ok = bom && ok;
        }

        var idade = calcularIdade(nasc);
        var erroNasc = '';

        if (!nasc || idade === null) erroNasc = 'Informe sua data de nascimento.';
        else if (idade > 120) erroNasc = 'Confira a data de nascimento.';
        else if (idade < IDADE_MINIMA) erroNasc = 'É preciso ter ' + IDADE_MINIMA + ' anos ou mais para criar a conta.';

        var erroTel = '';

        if (tel.length < 10 || tel.length > 11 || tel.charAt(0) === '0' || (tel.length === 11 && tel.charAt(2) !== '9')) {
            erroTel = 'Informe um telefone válido com DDD.';
        }

        checar('c-nome', 'e-nome', nome.split(' ').length < 2 || nome.length < 5 ? 'Informe nome e sobrenome.' : '');
        checar('c-nasc', 'e-nasc', erroNasc);
        checar('c-tel', 'e-tel', erroTel);
        checar('c-cep', 'e-cep', cep.length === 8 ? '' : 'Informe um CEP com 8 números.');
        checar('c-rua', 'e-rua', rua.length < 3 ? 'Informe a rua ou avenida.' : '');
        checar('c-num', 'e-num', numero ? '' : 'Informe o número (ou S/N).');
        checar('c-bairro', 'e-bairro', bairro.length < 2 ? 'Informe o bairro.' : '');
        checar('c-cidade', 'e-cidade', cidade.length < 2 ? 'Informe a cidade.' : '');
        checar('c-uf', 'e-uf', UFS.indexOf(uf) > -1 ? '' : 'UF inválida.');
        checar('c-email', 'e-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Informe um e-mail válido.');
        checar('c-senha', 'e-senha', senha.length >= 8 && /[A-Za-z]/.test(senha) && /\d/.test(senha) ? '' : 'Use 8 caracteres ou mais, incluindo letras e números.');
        checar('c-conf', 'e-conf', conf === senha ? '' : 'As senhas não coincidem.');
        checar('c-termos', 'e-termos', $('c-termos').checked ? '' : 'Marque a caixa para continuar.');

        if (!ok) {
            mensagem('m-cad', 'bad', 'Corrija os campos indicados.');
            if (primeiro) $(primeiro).focus();
            return;
        }

        var usuarios = lerUsuarios();

        if (usuarios[email]) {
            mensagem('m-cad', 'bad', 'Este e-mail já está cadastrado neste navegador.');
            return;
        }

        usuarios[email] = {
            nome: nome,
            nasc: nasc,
            telefone: tel,
            endereco: {
                cep: cep,
                rua: rua,
                numero: numero,
                complemento: comp,
                bairro: bairro,
                cidade: cidade,
                uf: uf
            },
            senha: hash(senha),
            avatar: pickCad.valor()
        };

        if (!salvarUsuarios(usuarios)) {
            mensagem('m-cad', 'bad', 'Não foi possível salvar os dados neste navegador.');
            return;
        }

        limparMensagem('m-cad');
        this.reset();
        atualizarForca('');
        pickCad.definir('classica');

        cepConsultado = '';
        statusCep('', '');
        $('idade-txt').textContent = TEXTO_IDADE;
        $('c-senha').type = 'password';
        $('c-conf').type = 'password';

        abrirAba('login');
        $('l-email').value = email;
        mensagem('m-login', 'ok', 'Conta criada com sucesso. Agora é só entrar.');
        $('l-senha').focus();
    });

    /* ---------- Entrar ---------- */

    $('f-login').addEventListener('submit', function (e) {
        e.preventDefault();

        var email = $('l-email').value.trim().toLowerCase();
        var senha = $('l-senha').value;
        var usuarios = lerUsuarios();
        var usuario = usuarios[email];

        if (!usuario || usuario.senha !== hash(senha)) {
            mensagem('m-login', 'bad', 'E-mail ou senha incorretos.');
            return;
        }

        if (!gravarSessao({
            nome: usuario.nome,
            email: email,
            avatar: usuario.avatar || 'classica'
        })) {
            mensagem('m-login', 'bad', 'Não foi possível iniciar a sessão.');
            return;
        }

        limparMensagem('m-login');
        this.reset();
        $('l-senha').type = 'password';

        mostrarEstado();
    });

    /* ---------- Alterar foto (conta conectada) ---------- */

    $('alterar-foto').addEventListener('click', function () {
        var s = lerSessao();
        if (!s) return;

        var abrir = $('troca-foto').hidden;

        if (abrir) {
            pickUser = AV.seletor($('pick-user'), s.avatar);
        }

        $('troca-foto').hidden = !abrir;
        this.setAttribute('aria-expanded', String(abrir));
        limparMensagem('m-foto');
    });

    $('salvar-foto').addEventListener('click', function () {
        var s = lerSessao();
        if (!s || !pickUser) return;

        var novo = pickUser.valor();
        var usuarios = lerUsuarios();

        if (usuarios[s.email]) {
            usuarios[s.email].avatar = novo;

            if (!salvarUsuarios(usuarios)) {
                mensagem('m-foto', 'bad', 'Não foi possível salvar a foto neste navegador.');
                return;
            }
        }

        s.avatar = novo;
        gravarSessao(s);

        $('avatar-logado').innerHTML = AV.html(novo);
        mensagem('m-foto', 'ok', 'Foto de perfil atualizada.');
        avisarSessao();
    });

    /* ---------- Sair ---------- */

    $('sair').addEventListener('click', function () {
        try {
            sessionStorage.removeItem(KEY_SESSION);
        } catch (e) { }

        abrirAba('login');
        mostrarEstado();
    });

    /* ---------- Início ---------- */

    abrirAba(Object.keys(lerUsuarios()).length ? 'login' : 'cad');
    mostrarEstado();
})();