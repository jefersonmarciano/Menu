$(document).ready(function(){
    cardapio.eventos.init();
})

let cardapio = {};
let MEU_CARRINHO = [];

cardapio.eventos = {
    init: () => {
        cardapio.metodos.obeterItensCardapio();
    }
};

cardapio.metodos = {

    // obtem a lista de itens do cardapio
    obeterItensCardapio: (categoria='burgers', vermais = false) => {

        let filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $("#itensCardapio").html('')
            $("#btnVerMais").removeClass('hidden');

        }

        

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.',','))
            .replace(/\${id}/g, e.id)

            // botao ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp)
            }

            // paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)
            }
           

        })

        // remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-" + categoria).addClass('active')

    },
    //clique no botao de ver mais
    verMais: () => {

        let ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; 
        cardapio.metodos.obeterItensCardapio(ativo,true)

        $("#btnVerMais").addClass('hidden');

    },


    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },
    // adicionar ao carrinho o item do cardapio
    adicionarAoCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            
            // obter a categoria ativa
            let categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obtenha a lista de itens
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id })

            if (item.length > 0) {

                // validar se existe o mesmo item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id })


                // caso ja exista o item so alterar a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                    
                }
                // se nao existe o item do carrinho, adiciona ele
                else {

                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])

                }

                cardapio.metodos.mensagem("Item adicionado ao carrinho!", 'green')
                // reseta para zero depois de adicionar no carrinho
                $("#qntd-" + id).text(0)  
                
                cardapio.metodos.atualizarBadgeTotal();
                
            }

        }

    },
    // atualiza o badge de totais dos botoes "meu cariinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden'); 
            $(".container-total-carrinho").removeClass('hidden')
        }
        else{
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden')
        }

        $(".badge-total-carrinho").html(total)

    },

    mensagem: (texto, cor= 'red', tempo = 1500) => {        
        // pego um numero aleatorio e multiplico pela data atual
        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown')
            $("#msg-" + id).addClass('fadeOutUp')
            $("#msg-" + id).remove();

        }, tempo)

    }


}

cardapio.templates = {

    item:`
                <div class="col-3 mb-5">
                    <div class="card card-item" id="produto-\${id}">
                        <div class="img-produto">
                            <img src="\${img}">
                        </div>
                        <p class="title-produto text-center mt-4">
                            <b>\${nome}</b>
                        </p>
                        <p class="price-produto text-center">
                            <b>R$ \${preco}</b>
                        </p>
                        <div class="add-carrinho">
                            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                            <span class="add-numero-itens" id="qntd-\${id}">0</span>
                            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                            <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                        </div>
                    </div>
                </div>

    `

}