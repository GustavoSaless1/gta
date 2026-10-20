# GTA — Seu personagem com IA

Projeto de estudo do evento DevClub, feito com HTML, CSS e JavaScript.
Permite selecionar Lucia, Jason ou CJ e transformar uma foto em personagem pelo Puter.js.

## Organização

```text
gta/
├── index.html          # Estrutura da página
├── README.md           # Orientações do projeto
└── assets/
    ├── css/
    │   └── styles.css  # Aparência e adaptação para celular
    ├── js/
    │   └── scripts.js  # Personagens, envio da foto e integração com IA
    └── img/            # Personagens e imagens de fundo
```

## Como abrir

1. Abra esta pasta no VS Code.
2. Com a extensão Live Server instalada, clique com o botão direito em `index.html` e escolha **Open with Live Server**.
3. Use o endereço exibido pelo Live Server, normalmente `http://localhost:5500/`.

O Puter precisa de um endereço HTTP para autenticar. Abrir o HTML diretamente pelo explorador de arquivos (`file://`) não permite o login.

## Como usar a IA

1. Clique na câmera e escolha uma foto JPG, PNG ou WebP de até 10 MB.
2. Entre na sua conta Puter quando solicitado e aguarde a transformação.
3. Depois de gerar, clique na sua miniatura para retornar ao seu personagem após selecionar outros.
4. Para substituir a imagem, clique em **Gerar outra foto** e confirme. Se a nova geração falhar, a anterior continua disponível.

A geração depende da disponibilidade do modelo e do saldo da conta Puter e pode ter custo. Não é necessário colocar uma chave de API no projeto.

A imagem gerada fica guardada apenas enquanto a página está aberta. Atualizar ou fechar a página remove esse resultado.

## Onde editar

- Textos e botões: `index.html`.
- Cores, tamanhos e posicionamento: `assets/css/styles.css`.
- Pedido enviado à IA e comportamento dos personagens: `assets/js/scripts.js`.
- Imagens: `assets/img/`. Os três fundos foram preservados; o atual é `background2.jpg`.
