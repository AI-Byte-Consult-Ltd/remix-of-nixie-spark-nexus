import type { VideoGuide } from "./types";

const pt: VideoGuide = {
  guideHeading: "Como usar",
  guideIntro: "Do login ao primeiro vídeo em cerca de cinco minutos. NICS Video e NICS Studio usam um único login e um único saldo de créditos.",
  guides: [
    {
      title: "Entre e ganhe 10 créditos grátis",
      steps: [
        "Toque em “Entrar”, digite seu e-mail e toque em “Receber o código”.",
        "Abra o e-mail de noreply@aibyteconsult.com (veja também o spam) e digite o código de 6 dígitos. Ele vale por 15 minutos.",
        "Você continua conectado neste dispositivo, no NICS Video e no NICS Studio.",
        "Em “Preços”, toque em “Ganhar 10 créditos”, informe seu nome e confirme. Não precisa de cartão; os créditos são dados uma vez por e-mail e valem 30 dias.",
      ],
    },
    {
      title: "Edição automática com o NICS Video",
      steps: [
        "Em “Envie suas imagens”, escreva um título para as capas (o em inglês é opcional).",
        "Escolha até 20 clipes: MP4, MOV, AVI, MKV, M4V ou 3GP, até 1 GB cada e 1,5 GB no total.",
        "Toque em “Enviar e começar” e mantenha a página aberta até o envio terminar. Um pacote custa 10 créditos.",
        "Depois você pode fechar a página. O status mostra fila, análise das cenas, plano de edição, renderização e capas.",
        "Quando o pacote fica pronto, você recebe um e-mail com um link. Baixe o Short, o vídeo longo e as quatro capas em até 7 dias.",
      ],
    },
    {
      title: "Edite você mesmo no NICS Studio",
      steps: [
        "Abra o NICS Studio e adicione vídeos ou fotos em “Mídia”. O vídeo final pode ter até 3 minutos.",
        "Edite na linha do tempo: cortar, dividir, reordenar, adicionar texto, música, filtros, zooms e transições. A edição manual é grátis.",
        "Ou escreva para o agente em inglês ou russo, por exemplo: “cut the pauses, add captions 3 words at a time, a little bigger, and add zooms”. Cada pedido custa 1 crédito.",
        "Legendas: abra “Legendas”, escolha russo ou inglês e toque em “Gerar legendas” (1 crédito). Confira e corrija o texto.",
        "Escolha 9:16, 16:9 ou 1:1 e toque em “Exportar” (2 créditos), depois em “Baixar”. Os projetos são salvos sozinhos neste navegador.",
      ],
    },
    {
      title: "Compre um plano",
      steps: [
        "Quando os créditos acabam, o site mostra quantos são necessários e quantos restam.",
        "Em “Preços”, escolha Start, Creator ou Pro e toque em “Continuar para o pagamento”. Use o mesmo e-mail do login.",
        "Pague com cartão na página segura da Revolut, que abre em uma nova aba. A cobrança é em euros.",
        "Alguns minutos depois do pagamento, os créditos são ativados sozinhos por 30 dias. Continue enviando vídeos ou editando no NICS Studio.",
      ],
    },
  ],
  faqHeading: "Perguntas frequentes",
  faq: [
    {
      q: "Como funciona o NICS Video?",
      a: "Envie seus clipes e o sistema escolhe as melhores tomadas e monta para você um Short, um vídeo longo e capas. Para editar à mão, abra o NICS Studio, diga ao agente o que mudar, ajuste a linha do tempo e exporte quando estiver pronto.",
    },
    {
      q: "Quais vídeos posso usar?",
      a: "Para a edição automática: MP4, MOV, AVI, MKV, M4V ou 3GP, até 20 arquivos, 1 GB cada e 1,5 GB no total. O NICS Studio aceita vídeos MP4 ou MOV e fotos JPG ou PNG, para um vídeo final de até 3 minutos.",
    },
    {
      q: "Posso editar meus vídeos?",
      a: "Sim, no NICS Studio: corte e reordene clipes, adicione legendas, texto, música, filtros, zooms e transições, e alterne entre 9:16, 16:9 e 1:1. A edição manual não custa nada; os créditos são só para o agente, as legendas e a exportação.",
    },
    {
      q: "Quais idiomas são suportados?",
      a: "As capas saem em russo e inglês. Legendas e comandos para o agente funcionam em russo e inglês. O site e o editor estão disponíveis em 12 idiomas, e outros idiomas estão a caminho.",
    },
    {
      q: "Como funcionam os créditos?",
      a: "Um saldo para os dois serviços: um pacote automático custa 10 créditos, uma exportação no NICS Studio 2, um pedido ao agente 1, legendas 1. Os créditos só são descontados depois que o trabalho dá certo e valem 30 dias.",
    },
    {
      q: "Posso cancelar meu plano?",
      a: "Não há nada para cancelar: cada pagamento é uma compra única de créditos por 30 dias, sem renovação automática e sem cobranças recorrentes. Para continuar, compre um plano de novo.",
    },
    {
      q: "Quanto custa o NICS Video?",
      a: "Você começa grátis com 10 créditos, uma única vez. Depois, Start 14,99 EUR (60 créditos), Creator 34,99 EUR (250) ou Pro 69,99 EUR (700), cada um por 30 dias. Pagamento com cartão pela Revolut.",
    },
    {
      q: "O que é um crédito?",
      a: "O crédito é a unidade com que se paga o processamento: edição automática, reconhecimento de fala para legendas, pedidos ao agente e renderização do vídeo final. No plano Start, um crédito custa cerca de 25 centavos de euro.",
    },
    {
      q: "Onde meus arquivos ficam guardados?",
      a: "A edição automática roda no nosso próprio hardware, nunca em nuvens externas; os arquivos prontos ficam guardados por 7 dias. O NICS Studio funciona no seu dispositivo e não envia seus arquivos para lugar nenhum.",
    },
    {
      q: "O código de login não chegou",
      a: "Veja o spam e toque em “Enviar de novo”. Um mesmo e-mail pode receber no máximo 5 códigos por hora. Ainda não chegou? Escreva para info@aibyteconsult.com.",
    },
  ],
};

export default pt;
