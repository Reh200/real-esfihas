// ======================================================
// CARRINHO
// ======================================================

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];


// ======================================================
// CONFIGURAÇÃO DO CARDÁPIO DE ESFIHAS
// ======================================================

let cardapioEsfirras = {};

function mapearCardapioDoHTML() {

    cardapioEsfirras = {};

    const itens = document.querySelectorAll(
        'section:not(#bebidas) article.item'
    );

    itens.forEach(item => {

        const categoria =
            item.getAttribute('data-categoria') || 'esfirra';

        if (
            categoria.toLowerCase() === 'bebida' ||
            categoria.toLowerCase() === 'bebidas'
        ) {
            return;
        }

        const nomeElement =
            item.querySelector('strong') ||
            item.querySelector('h4');

        const selectPreco =
            item.querySelector('.select-preco');

        if (nomeElement && selectPreco) {

            const nomeEsfirra =
                nomeElement.innerText.trim();

            cardapioEsfirras[nomeEsfirra] = {};

            Array.from(selectPreco.options).forEach(opcao => {

                const valorPreco =
                    parseFloat(opcao.value);

                if (!isNaN(valorPreco)) {

                    cardapioEsfirras[nomeEsfirra][opcao.text] =
                        valorPreco;
                }

            });
        }
    });
}

document.addEventListener(
    'DOMContentLoaded',
    mapearCardapioDoHTML
);


// ======================================================
// ADICIONAR AO CARRINHO
// ======================================================

function adicionarAoCarrinho(botao) {

    const itemElement =
        botao.closest('.item');

    if (!itemElement) return;


    // ==================================================
    // VERIFICA SE É O COMBO
    // ==================================================

    const combo =
        itemElement.querySelector('.select-esfiha-sabor');

    const selectRefri =
        itemElement.querySelector('.select-refri');


    if (combo && selectRefri) {

        adicionarComboAoCarrinho(itemElement);

        return;
    }


    // ==================================================
    // PRODUTOS NORMAIS
    // ==================================================

    const categoria =
        itemElement.getAttribute('data-categoria') ||
        'esfirra';

    const nomeElement =
        itemElement.querySelector('strong') ||
        itemElement.querySelector('h4');

    const select =
        itemElement.querySelector('.select-preco');

    if (!nomeElement || !select) {

        return alert(
            "Não foi possível identificar o produto."
        );
    }

    const nomeBase =
        nomeElement.innerText.trim();

    const preco =
        parseFloat(select.value);

    if (isNaN(preco)) {

        return alert(
            "Preço do produto inválido."
        );
    }

    const opcaoTexto =
        select.options[
            select.selectedIndex
        ].text;

    const detalheOpcao =
        opcaoTexto
            .split(/ - R\$/i)[0]
            .trim();

    const nomeFinal =
        detalheOpcao &&
        detalheOpcao !== opcaoTexto
            ? `${nomeBase} (${detalheOpcao})`
            : nomeBase;


    const existente =
        carrinho.find(
            p => p.nome === nomeFinal
        );


    if (existente) {

        existente.quantidade += 1;

    } else {

        carrinho.push({

            nome: nomeFinal,
            preco: preco,
            quantidade: 1,
            categoria: categoria

        });
    }


    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    );


    if (
        typeof exibirCarrinho === 'function'
    ) {

        exibirCarrinho();
    }


    alert(
        `✅ ${nomeFinal} adicionado ao carrinho!`
    );
}


// ======================================================
// ADICIONAR COMBO DE 10 ESFIHAS
// ======================================================

function adicionarComboAoCarrinho(itemElement) {

    const selecoes =
        itemElement.querySelectorAll(
            '.select-esfiha-sabor'
        );

    const selectRefri =
        itemElement.querySelector(
            '.select-refri'
        );


    // ==================================================
    // VERIFICA SE EXISTEM 10 SELEÇÕES
    // ==================================================

    if (selecoes.length !== 10) {

        return alert(
            "⚠️ O combo precisa ter exatamente 10 opções de esfiha."
        );
    }


    // ==================================================
    // VERIFICA SE TODAS AS 10 ESFIHAS FORAM ESCOLHIDAS
    // ==================================================

    const saboresSelecionados = [];

    let faltando = [];


    selecoes.forEach((select, index) => {

        const sabor = select.value;

        if (!sabor) {

            faltando.push(index + 1);

        } else {

            saboresSelecionados.push(sabor);
        }
    });


    if (faltando.length > 0) {

        return alert(
            `⚠️ Você ainda não escolheu o sabor da(s) esfiha(s): ${faltando.join(', ')}.\n\nEscolha os sabores das 10 esfihas para continuar.`
        );
    }


    // ==================================================
    // VERIFICA O REFRIGERANTE
    // ==================================================

    if (!selectRefri || !selectRefri.value) {

        return alert(
            "⚠️ Escolha o refrigerante de 2 litros antes de adicionar o combo ao carrinho."
        );
    }


    const refrigerante =
        selectRefri.value;


    // ==================================================
    // MONTA A LISTA DOS SABORES
    // ==================================================

    const quantidadeSabores = {};

    saboresSelecionados.forEach(sabor => {

        if (quantidadeSabores[sabor]) {

            quantidadeSabores[sabor] += 1;

        } else {

            quantidadeSabores[sabor] = 1;
        }
    });


    const listaSabores =
        Object.entries(quantidadeSabores)
            .map(
                ([sabor, quantidade]) =>
                    `${quantidade}x ${sabor}`
            )
            .join(', ');


    // ==================================================
    // PREÇO DO COMBO
    // ==================================================

    const preco =
        54.90;


    // ==================================================
    // NOME FINAL DO COMBO
    // ==================================================

    const nomeFinal =
        `Combo 10 Esfihas + Refri 2L (${listaSabores} | ${refrigerante})`;


    // ==================================================
    // VERIFICA SE JÁ EXISTE O MESMO COMBO
    // ==================================================

    const existente =
        carrinho.find(
            p => p.nome === nomeFinal
        );


    if (existente) {

        existente.quantidade += 1;

    } else {

        carrinho.push({

            nome: nomeFinal,

            preco: preco,

            quantidade: 1,

            categoria: 'combo',

            sabores: saboresSelecionados,

            refrigerante: refrigerante

        });
    }


    // ==================================================
    // SALVA NO LOCALSTORAGE
    // ==================================================

    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    );


    // ==================================================
    // ATUALIZA O CARRINHO
    // ==================================================

    if (
        typeof exibirCarrinho === 'function'
    ) {

        exibirCarrinho();
    }


    // ==================================================
    // AVISO DE SUCESSO
    // ==================================================

    alert(
        `✅ Combo adicionado ao carrinho!\n\n` +
        `🍕 10 esfihas:\n${listaSabores}\n\n` +
        `🥤 Refrigerante: ${refrigerante}\n\n` +
        `💰 Valor: R$ 54,90`
    );
}


// ======================================================
// BOTÃO "VOLTAR AO TOPO"
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const backToTopBtn =
            document.getElementById(
                "back-to-top-btn"
            );

        window.onscroll = function () {

            if (backToTopBtn) {

                scrollFunction();
            }
        };


        function scrollFunction() {

            if (
                document.body.scrollTop > 300 ||
                document.documentElement.scrollTop > 300
            ) {

                backToTopBtn.style.display =
                    "block";

            } else {

                backToTopBtn.style.display =
                    "none";
            }
        }
    }
);


// ======================================================
// VOLTAR AO TOPO
// ======================================================

function voltarAoTopo() {

    window.scrollTo({

        top: 0,

        behavior: 'smooth'

    });
}