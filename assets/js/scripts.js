/* 
    1) Lógica de Programação 
        Saber a sequencia que o computador/projeto
        quer que você execute as coisas

    2) Algoritmo
        Receita de bolo, passo a passo, para que o computador entenda o que você quer que ele faça


    ALGOROITMO 1
    [x] Saber quem é quem (imagem, botão...)
    [x] Saber que o botão foi clicado (qual botão)
    [x] Trocar a foto e o nome do personagem
    
    ALGORITMO 2
    [ ] Pegar a imagem do usuario
    [ ] Enviar para a IA imagem + o que eu quero que ela faça
    [ ] Receber a imagem da IA
    [ ] Colocar a imagem no site
    



    3) Variaveis
        - É um pedacinho da memória do computador que você pode guardar alguma coisa
        - Exemplo: 
            let nome = "Lucia"
            let idade = 15
            let altura = 1.60
            let peso = 50
    4) Funções
        É um pedacinho de código que SÓ EXECUTA QUANDO VOCÊ CHAMA ELA

    HTML = document
    querySelector = selecionar ALGO no HTML

    ( ) = entre parenteses você coloca o que você quer selecionar
    Quem ? Classe = .nomeDaClasse

    console.log() = mostrar no console do navegador
    innerHTML = colocar algo dentro do HTML

    1)criar uma variavel para guardar o que eu quero
    2)ir no HTML ( com o document)
    3) Selecionar quem eu quero com o querySelector
    4) Colocar entre parenteses quem eu quero selecionar (classe)

*/


let nome = document.querySelector(".nome")
let personagem = document.querySelector(".personagem")
// Guarda o resultado enquanto esta página estiver aberta, mesmo ao trocar de personagem.
let minhaImagemGerada = null

function mostrarMeuPersonagem() {
    if (minhaImagemGerada) {
        escolherPersonagem('Você', minhaImagemGerada, '#ffd319')
    } else {
        document.querySelector('#foto').click()
    }
}

function gerarOutraImagem() {
    if (window.confirm('Quer gerar outra imagem? A atual só será substituída se a nova ficar pronta.')) {
        document.querySelector('#foto').click()
    }
}


function escolherPersonagem(nomePersonagem, imagemPersonagem, cor) {

    if (nomePersonagem === "cj") {
        nome.innerHTML = '<span class="letra-c">C</span><span class="letra-j">J</span>'
    } else {

        nome.textContent = nomePersonagem
    }
    personagem.src = imagemPersonagem
    personagem.alt = `Personagem ${nomePersonagem}`
    nome.style.color = cor
    document.querySelector('.gerar-outra').hidden = nomePersonagem !== 'Você' || !minhaImagemGerada

}

// Lê a foto, pede a transformação ao Puter e mostra a imagem devolvida pela IA.
async function lerFoto(campoFoto) {
    const foto = campoFoto.files[0]
    const botao = document.querySelector('.voce')
    const status = document.querySelector('.status-foto')

    if (!foto || botao.disabled) return

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(foto.type)) {
        status.textContent = 'Escolha uma foto em JPG, PNG ou WebP.'
        campoFoto.value = ''
        return
    }

    if (foto.size > 10 * 1024 * 1024) {
        status.textContent = 'Escolha uma foto de até 10 MB.'
        campoFoto.value = ''
        return
    }

    botao.disabled = true
    document.querySelector('.gerar-outra').disabled = true
    campoFoto.disabled = true
    document.querySelector('.menu').setAttribute('aria-busy', 'true')

    try {
        if (!window.puter) {
            throw new Error('O serviço de IA não carregou. Atualize a página e tente novamente.')
        }

        // O acesso acontece pela conta Puter, sem colocar chaves secretas no site.
        if (!puter.auth.isSignedIn()) {
            status.textContent = 'Entre na sua conta Puter na janela que abrir para continuar.'
            await puter.auth.signIn()
        }

        status.textContent = 'Criando seu personagem… aguarde a IA terminar.'
        const imagemOriginal = await new Promise((resolve, reject) => {
            const leitor = new FileReader()
            leitor.onload = () => resolve(leitor.result)
            leitor.onerror = () => reject(new Error('Não foi possível ler essa foto. Escolha outra.'))
            leitor.readAsDataURL(foto)
        })

        const desenho = await puter.ai.txt2img(
            'Transforme a pessoa desta foto em um personagem de ilustração promocional de GTA: contorno preto grosso, cores vivas, mantendo o rosto parecido e as características da pessoa. Mostre o corpo inteiro da cabeça aos pés, incluindo todo o cabelo, braços, mãos e calçados. Complete as partes do corpo que não aparecem na foto original. Composição vertical, pessoa centralizada, com margem transparente ao redor de toda a silhueta. Não corte nenhuma parte do corpo nas bordas. Fundo totalmente transparente: sem cenário, sem chão e sem sombra. Sem textos ou logotipos.',
            {
                model: 'replicate:openai/gpt-image-2.5-flare',
                input_image: imagemOriginal,
                quality: 'medium',
                providerOptions: { background: 'transparent' }
            }
        )

        // Puter retorna um elemento de imagem. Usamos o endereço dele no personagem.
        const endereco = typeof desenho === 'string' ? desenho : desenho?.src
        if (!endereco) throw new Error('A IA não devolveu uma imagem. Tente novamente.')

        const previa = new Image()
        previa.src = endereco
        await previa.decode()
        minhaImagemGerada = endereco
        const miniatura = document.querySelector('.miniatura-voce')
        miniatura.src = endereco
        miniatura.hidden = false
        document.querySelector('.icone-camera').hidden = true
        botao.setAttribute('aria-label', 'Mostrar meu personagem')
        botao.title = 'Mostrar meu personagem'
        escolherPersonagem('Você', endereco, '#ffd319')
        status.textContent = 'Pronto! Você virou um personagem.'
    } catch (erro) {
        console.error('Erro ao criar personagem:', erro)
        status.textContent = erro instanceof Error && !window.puter
            ? erro.message
            : 'Não foi possível criar seu personagem. Confira o login e o saldo no Puter e tente novamente.'
    } finally {
        botao.disabled = false
        document.querySelector('.gerar-outra').disabled = false
        campoFoto.disabled = false
        campoFoto.value = ''
        document.querySelector('.menu').removeAttribute('aria-busy')
    }
}
