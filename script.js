const botaoFonteMenos = document.getElementById("btn-fonte-menos");
const botaoFonteMais = document.getElementById("btn-fonte-mais");
const botaoContraste = document.getElementById("btn-contraste");
const botaoVoz = document.getElementById("btn-voz");

const areaPerguntasRapidas = document.getElementById("perguntas-rapidas");
const areaConversa = document.getElementById("conversa");
const botaoOuvir = document.getElementById("btn-ouvir");
const formularioPergunta = document.getElementById("form-pergunta");
const campoPergunta = document.getElementById("campo-pergunta");

const campoHtml = document.getElementById("campo-html");
const botaoAnalisar = document.getElementById("btn-analisar");
const botaoExemplo = document.getElementById("btn-exemplo");
const areaResultado = document.getElementById("resultado");

const campoMensagem = document.getElementById("campo-mensagem");
const botaoDetectar = document.getElementById("btn-detectar");
const botaoExemploGolpe = document.getElementById("btn-exemplo-golpe");
const areaResultadoGolpe = document.getElementById("resultado-golpe");

const corTextoEscolhida = document.getElementById("cor-texto-escolhida");
const corFundoEscolhida = document.getElementById("cor-fundo-escolhida");
const previa = document.getElementById("previa");
const areaResultadoContraste = document.getElementById("resultado-contraste");

const seletorSimulacao = document.getElementById("simulacao");

const botoesDeRolagem = document.querySelectorAll("[data-ir-para]");

for (const botao of botoesDeRolagem) {
  botao.onclick = function () {
    const idDaSecao = botao.dataset.irPara;
    const destino = document.getElementById(idDaSecao);
    if (destino) {
      destino.scrollIntoView();
    }
  };
}

let tamanhoDaFonte = 17;

function mudarFonte(novoTamanho) {

  if (novoTamanho < 13) {
    novoTamanho = 13;
  }
  if (novoTamanho > 28) {
    novoTamanho = 28;
  }

  tamanhoDaFonte = novoTamanho;

  document.documentElement.style.setProperty("--tamanho-fonte", tamanhoDaFonte + "px");
  salvarPreferencias();
}

botaoFonteMais.onclick = function () {
  mudarFonte(tamanhoDaFonte + 2);
};

botaoFonteMenos.onclick = function () {
  mudarFonte(tamanhoDaFonte - 2);
};

botaoContraste.onclick = function () {
  const pagina = document.documentElement;
  const estaLigado = pagina.getAttribute("data-contrast") === "on";

  if (estaLigado) {
    pagina.removeAttribute("data-contrast");
    botaoContraste.setAttribute("aria-pressed", "false");
  } else {
    pagina.setAttribute("data-contrast", "on");
    botaoContraste.setAttribute("aria-pressed", "true");
  }
  salvarPreferencias();
};

let vozLigada = false;
let ultimaResposta = "";

botaoVoz.onclick = function () {
  vozLigada = !vozLigada;
  botaoVoz.setAttribute("aria-pressed", vozLigada);

  if (vozLigada === false) {
    speechSynthesis.cancel();
  }
  salvarPreferencias();
};

function falar(texto, forcar) {
  if (vozLigada === false && !forcar) {
    return;
  }
  if (!("speechSynthesis" in window)) {
    return;
  }

  speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  fala.rate = 0.9;
  speechSynthesis.speak(fala);
}

botaoOuvir.onclick = function () {
  if (ultimaResposta !== "") {
    falar(ultimaResposta, true);
  }
};

const assuntos = [
  {
    pergunta: "Como fazer um Pix?",
    palavrasChave: ["pix"],
    resposta:
      "1. Abra o aplicativo oficial do seu banco.\n" +
      "2. Toque em “Pix” e depois em “Transferir”.\n" +
      "3. Digite o CPF, celular ou chave, ou leia o QR Code.\n" +
      "4. Confira o nome de quem vai receber antes de confirmar.\n" +
      "5. Digite o valor e confirme com sua senha."
  },
  {
    pergunta: "Isso é golpe?",
    palavrasChave: ["golpe", "fraude", "suspeit", "falso", "mensagem", "link"],
    resposta:
      "Desconfie quando a mensagem:\n" +
      "• tem muita pressa (“sua conta será bloqueada”);\n" +
      "• pede senha, código ou dados do cartão;\n" +
      "• vem de número novo dizendo ser parente ou banco;\n" +
      "• traz um link estranho.\n\n" +
      "Não clique nem responda. Ligue para o banco pelo número do cartão."
  },
  {
    pergunta: "Criar senha segura",
    palavrasChave: ["senha"],
    resposta:
      "Use uma frase longa que só você entenda, como “meu gato dorme no sofa 2024”.\n" +
      "• Não use data de nascimento nem 123456.\n" +
      "• Use senhas diferentes no banco e nas redes.\n" +
      "• Nunca conte a senha para ninguém."
  },
  {
    pergunta: "O que é gov.br?",
    palavrasChave: ["gov", "inss", "documento"],
    resposta:
      "É a sua identidade na internet para serviços do governo (INSS, Receita, carteira de trabalho).\n\n" +
      "1. Baixe o app “gov.br”.\n" +
      "2. Toque em “Crie sua conta”.\n" +
      "3. Informe o CPF e siga os passos.\n" +
      "4. Guarde a senha em lugar seguro.\n\n" +
      "O governo nunca pede senha por mensagem."
  },
  {
    pergunta: "WhatsApp básico",
    palavrasChave: ["whatsapp", "zap", "audio", "áudio", "grupo"],
    resposta:
      "• Mensagem: abra a conversa, escreva e toque na seta.\n" +
      "• Áudio: segure o microfone, fale e solte.\n" +
      "• Ligação: toque no telefone no alto da conversa.\n" +
      "• Segurança: ative a “Confirmação em duas etapas” em Configurações > Conta."
  },
  {
    pergunta: "Wi-Fi e dados móveis",
    palavrasChave: ["wifi", "wi-fi", "internet", "dados"],
    resposta:
      "• Wi-Fi: internet do local, não gasta seu pacote.\n" +
      "• Dados móveis: internet do seu chip, gasta o pacote.\n\n" +
      "Evite acessar o banco em Wi-Fi público."
  },
  {
    pergunta: "Como saber se um site é falso?",
    palavrasChave: ["site", "falso", "loja falsa", "endereco", "cadeado"],
    resposta:
      "• Leia o endereço com calma: gov.br é verdadeiro; gov-br-oficial.com é falso.\n" +
      "• Preço muito abaixo do normal é sinal de alerta.\n" +
      "• Pesquise o nome da loja junto com “reclamações”.\n" +
      "• O cadeado ajuda, mas sites falsos também têm. Não basta.\n" +
      "• Para o banco, digite o endereço você mesmo ou use o app oficial."
  },
  {
    pergunta: "Baixar aplicativos com segurança",
    palavrasChave: ["aplicativo", "app", "baixar", "instalar", "play store"],
    resposta:
      "• Baixe só na loja oficial do celular (Play Store ou App Store).\n" +
      "• Confira o nome da empresa e as avaliações.\n" +
      "• Desconfie de app que pede permissões demais, como acesso a SMS e contatos.\n" +
      "• Nunca instale app enviado por link ou arquivo no WhatsApp."
  },
  {
    pergunta: "Como fazer videochamada",
    palavrasChave: ["videochamada", "video", "meet", "zoom", "camera"],
    resposta:
      "No WhatsApp:\n" +
      "1. Abra a conversa com a pessoa.\n" +
      "2. Toque no ícone de câmera de vídeo no alto da tela.\n" +
      "3. Aguarde ela atender.\n\n" +
      "Se não vir ou ouvir nada, confira se o app tem permissão para câmera e microfone nas configurações do celular."
  },
  {
    pergunta: "Golpe do falso parente",
    palavrasChave: ["novo numero", "parente", "filho", "filha", "trocou de numero"],
    resposta:
      "Golpe comum: alguém diz “Oi, mãe, mudei de número” e depois pede um Pix urgente.\n\n" +
      "• Não faça Pix.\n" +
      "• Ligue para o número antigo da pessoa.\n" +
      "• Faça uma pergunta que só ela saberia responder.\n" +
      "• Bloqueie e denuncie o contato."
  },
  {
    pergunta: "Comprar online com segurança",
    palavrasChave: ["compra", "comprar", "cartao", "loja"],
    resposta:
      "• Prefira lojas conhecidas ou com boa reputação.\n" +
      "• Se possível, use cartão virtual ou pague no cartão de crédito.\n" +
      "• Guarde o comprovante e o print do anúncio.\n" +
      "• Desconfie de quem pede pagamento fora do site da loja."
  },
  {
    pergunta: "Confirmação em duas etapas",
    palavrasChave: ["duas etapas", "verificacao", "2fa", "codigo"],
    resposta:
      "É uma segunda trava além da senha: um código que chega no seu celular.\n" +
      "Mesmo que roubem sua senha, a pessoa não entra sem esse código.\n\n" +
      "Ative em: Configurações > Conta > Confirmação em duas etapas.\n" +
      "E nunca passe esse código para ninguém."
  },
  {
    pergunta: "Como reconhecer fake news",
    palavrasChave: ["fake", "noticia", "boato", "verdade", "corrente"],
    resposta:
      "• Desconfie de mensagens que mandam “repassar para todos”.\n" +
      "• Procure a mesma notícia em sites de jornais conhecidos.\n" +
      "• Veja a data: notícia antiga costuma voltar como se fosse nova.\n" +
      "• Se te deixa com muita raiva ou medo, pare e confira antes de compartilhar."
  }
];

function mostrarMensagem(tipo, texto) {
  const mensagem = document.createElement("div");
  mensagem.className = "mensagem " + tipo;
  mensagem.textContent = texto;
  areaConversa.appendChild(mensagem);

  areaConversa.scrollTop = areaConversa.scrollHeight;
}

function semAcento(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function responder(textoDigitado) {
  const texto = semAcento(textoDigitado);
  let melhorAssunto = null;
  let maiorPontuacao = 0;

  for (const assunto of assuntos) {
    let pontos = 0;
    for (const palavra of assunto.palavrasChave) {
      if (texto.includes(semAcento(palavra))) {
        pontos++;
      }
    }
    if (pontos > maiorPontuacao) {
      maiorPontuacao = pontos;
      melhorAssunto = assunto;
    }
  }

  if (melhorAssunto) {
    return melhorAssunto.resposta;
  }
  return "Ainda não sei responder isso. Tente perguntar sobre: Pix, golpes, senha, gov.br, WhatsApp, Wi-Fi, site falso, aplicativos, videochamada, compras online, duas etapas ou fake news.";
}

function perguntar(textoDigitado) {
  if (textoDigitado.trim() === "") {
    return;
  }

  mostrarMensagem("mensagem-usuario", textoDigitado);

  const resposta = responder(textoDigitado);
  ultimaResposta = resposta;
  mostrarMensagem("mensagem-assistente", resposta);
  falar(resposta, false);
}

function criarBotaoDePergunta(assunto) {
  const botao = document.createElement("button");
  botao.textContent = assunto.pergunta;
  botao.onclick = function () {
    perguntar(assunto.pergunta);
  };
  areaPerguntasRapidas.appendChild(botao);
}

for (let i = 0; i < 6; i++) {
  criarBotaoDePergunta(assuntos[i]);
}

formularioPergunta.onsubmit = function (evento) {
  evento.preventDefault();
  perguntar(campoPergunta.value);
  campoPergunta.value = "";
};

mostrarMensagem("mensagem-assistente", "Toque numa pergunta acima ou escreva a sua.");

const codigoDeExemplo =
  '<html>\n<body>\n' +
  '  <img src="foto.jpg">\n' +
  '  <a href="/x"></a>\n' +
  '  <input type="text" placeholder="Seu nome">\n' +
  '  <button><img src="lupa.png"></button>\n' +
  '  <h3>Bem-vindo</h3>\n' +
  '  <div onclick="enviar()">Enviar</div>\n' +
  '  <iframe src="mapa.html"></iframe>\n' +
  '</body>\n</html>';

botaoExemplo.onclick = function () {
  campoHtml.value = codigoDeExemplo;
};

function temNome(elemento) {
  if (elemento.textContent.trim() !== "") {
    return true;
  }
  if (elemento.getAttribute("aria-label")) {
    return true;
  }

  const imagens = elemento.querySelectorAll("img");
  for (const imagem of imagens) {
    const alt = imagem.getAttribute("alt");
    if (alt) {
      return true;
    }
  }

  return false;
}

function conferirCodigo(codigo) {
  const documento = new DOMParser().parseFromString(codigo, "text/html");
  const problemas = [];

  if (!documento.documentElement.getAttribute("lang")) {
    problemas.push({
      titulo: "Página sem idioma",
      correcao: 'Leitores de tela precisam saber a língua. Use <html lang="pt-BR">.'
    });
  }

  if (documento.title.trim() === "") {
    problemas.push({
      titulo: "Página sem título",
      correcao: "Adicione <title> dentro do <head>."
    });
  }

  if (!documento.querySelector("h1")) {
    problemas.push({
      titulo: "Sem título principal (h1)",
      correcao: "Adicione um <h1> dizendo o assunto da página."
    });
  }

  const imagens = documento.querySelectorAll("img");
  for (const imagem of imagens) {
    if (!imagem.hasAttribute("alt")) {
      problemas.push({
        titulo: "Imagem sem texto alternativo",
        correcao: 'Quem não enxerga a imagem não sabe o que ela mostra. Adicione alt="descrição curta" (ou alt="" se for decoração).'
      });
    }
  }

  const links = documento.querySelectorAll("a");
  for (const link of links) {
    const textoDoLink = link.textContent.trim().toLowerCase();

    if (!temNome(link)) {
      problemas.push({
        titulo: "Link sem texto",
        correcao: "O leitor de tela só diz “link”. Escreva um texto claro dentro dele ou use aria-label."
      });
    } else if (textoDoLink === "clique aqui" || textoDoLink === "aqui" || textoDoLink === "saiba mais") {
      problemas.push({
        titulo: "Texto de link vago",
        correcao: "Troque “" + link.textContent.trim() + "” por algo como “Baixar o edital em PDF”."
      });
    }
  }

  const botoes = documento.querySelectorAll("button");
  for (const botao of botoes) {
    if (!temNome(botao)) {
      problemas.push({
        titulo: "Botão sem nome",
        correcao: 'Botão só com ícone não diz o que faz. Use texto ou aria-label="Pesquisar".'
      });
    }
  }

  const campos = documento.querySelectorAll("input");
  for (const campo of campos) {
    const tipo = (campo.getAttribute("type") || "").toLowerCase();

    if (tipo === "hidden" || tipo === "submit" || tipo === "button") {
      continue;
    }

    let temRotulo = false;
    if (campo.id && documento.querySelector('label[for="' + campo.id + '"]')) {
      temRotulo = true;
    }
    if (campo.closest("label")) {
      temRotulo = true;
    }
    if (campo.getAttribute("aria-label")) {
      temRotulo = true;
    }

    if (!temRotulo) {
      problemas.push({
        titulo: "Campo sem rótulo",
        correcao: 'Placeholder some ao digitar. Use <label for="id"> ligado ao campo.'
      });
    }
  }

  const titulos = documento.querySelectorAll("h1, h2, h3, h4, h5, h6");
  let nivelAnterior = 0;
  for (const titulo of titulos) {
    const nivel = Number(titulo.tagName[1]);

    if (nivelAnterior !== 0 && nivel > nivelAnterior + 1) {
      problemas.push({
        titulo: "Título pulou de nível",
        correcao: "Foi de h" + nivelAnterior + " para h" + nivel + ". Siga a ordem h1, h2, h3."
      });
    }
    nivelAnterior = nivel;
  }

  const quadros = documento.querySelectorAll("iframe");
  for (const quadro of quadros) {
    if (!quadro.getAttribute("title")) {
      problemas.push({
        titulo: "iframe sem título",
        correcao: 'Adicione title="descrição do conteúdo" para o leitor de tela explicar o que é.'
      });
    }
  }

  const comTabindex = documento.querySelectorAll("[tabindex]");
  for (const elemento of comTabindex) {
    if (Number(elemento.getAttribute("tabindex")) > 0) {
      problemas.push({
        titulo: "tabindex maior que zero",
        correcao: 'Isso bagunça a ordem do Tab. Use tabindex="0" ou deixe a ordem natural.'
      });
    }
  }

  const viewport = documento.querySelector('meta[name="viewport"]');
  if (viewport) {
    const conteudo = (viewport.getAttribute("content") || "").replace(/\s/g, "").toLowerCase();
    if (conteudo.includes("user-scalable=no") || /maximum-scale=1(\.0)?(,|$)/.test(conteudo)) {
      problemas.push({
        titulo: "Zoom bloqueado",
        correcao: "Quem precisa ampliar a tela fica sem conseguir. Remova user-scalable=no e maximum-scale=1."
      });
    }
  }

  const falsosBotoes = documento.querySelectorAll("div[onclick], span[onclick]");
  for (const falso of falsosBotoes) {
    problemas.push({
      titulo: "Elemento clicável que não é botão",
      correcao: "div e span com onclick não funcionam com o teclado. Use <button>."
    });
  }

  const tabelas = documento.querySelectorAll("table");
  for (const tabela of tabelas) {
    if (!tabela.querySelector("th")) {
      problemas.push({
        titulo: "Tabela sem cabeçalho",
        correcao: "Use <th> nas células de título para o leitor de tela relacionar os dados."
      });
    }
  }

  const midias = documento.querySelectorAll("video[autoplay], audio[autoplay]");
  for (const midia of midias) {
    problemas.push({
      titulo: "Mídia que toca sozinha",
      correcao: "Som ou vídeo automático atrapalha leitores de tela e quem tem TDAH. Deixe a pessoa apertar play."
    });
  }

  return problemas;
}

botaoAnalisar.onclick = function () {
  const codigo = campoHtml.value;
  areaResultado.textContent = "";

  if (codigo.trim() === "") {
    areaResultado.textContent = "Cole um código HTML primeiro.";
    return;
  }

  const problemas = conferirCodigo(codigo);

  let nota = 100 - problemas.length * 8;
  if (nota < 0) {
    nota = 0;
  }

  const textoNota = document.createElement("div");
  textoNota.className = "nota-final";
  textoNota.textContent = nota + "/100";
  areaResultado.appendChild(textoNota);

  const textoResumo = document.createElement("div");
  if (problemas.length === 0) {
    textoResumo.textContent = "Nenhum problema nas regras básicas. Ótimo começo!";
  } else {
    textoResumo.textContent = problemas.length + " problema(s) encontrado(s).";
  }
  areaResultado.appendChild(textoResumo);

  for (const problema of problemas) {
    const caixa = document.createElement("div");
    caixa.className = "problema";

    const titulo = document.createElement("b");
    titulo.textContent = problema.titulo;

    const correcao = document.createElement("div");
    correcao.textContent = "Como corrigir: " + problema.correcao;

    caixa.appendChild(titulo);
    caixa.appendChild(correcao);
    areaResultado.appendChild(caixa);
  }

  falar("Nota " + nota + " de 100. " + textoResumo.textContent, false);
};


const sinaisDeGolpe = [
  { nome: "Pressa ou ameaça", peso: 2, regra: /urgente|imediat|agora mesmo|ultimas horas|expira|bloquead|suspens|cancelad|hoje/, dica: "Golpistas criam pressa para você não ter tempo de pensar." },
  { nome: "Pede senha, código ou dados", peso: 3, regra: /senha|codigo|cvv|token|dados bancarios|numero do cartao|confirme seus dados/, dica: "Banco e governo nunca pedem senha ou código por mensagem." },
  { nome: "Link suspeito", peso: 2, regra: /https?:\/\/|www\.|bit\.ly|tinyurl|\.xyz|\.top|clique/, dica: "Não clique. Digite o endereço oficial você mesmo." },
  { nome: "Prêmio ou dinheiro fácil", peso: 2, regra: /voce ganhou|premio|sorteio|heranca|reembolso|restituicao|dinheiro esquecido/, dica: "Ninguém ganha prêmio de sorteio em que não entrou." },
  { nome: "Pede pagamento ou taxa", peso: 2, regra: /taxa|deposit|pix|boleto|transfer/, dica: "Pedir pagamento para “liberar” algo é um golpe clássico." },
  { nome: "Falso parente ou número novo", peso: 3, regra: /novo numero|mudei de numero|troquei de numero|perdi meu celular|sou seu filho|sou sua filha/, dica: "Ligue para o número antigo da pessoa antes de qualquer Pix." },
  { nome: "Pede segredo", peso: 2, regra: /nao conte|nao fale|sigilo|segredo/, dica: "Pedir segredo impede que alguém te avise que é golpe." },
  { nome: "Diz ser banco ou órgão público", peso: 1, regra: /banco|receita federal|inss|policia|justica|correios|anatel|detran/, dica: "Confirme ligando para o número oficial, não o da mensagem." }
];

botaoExemploGolpe.onclick = function () {
  campoMensagem.value = "URGENTE! Seu banco bloqueou sua conta hoje. Para liberar, clique em http://bit.ly/banco123 e confirme sua senha e o código que chegou por SMS.";
};

botaoDetectar.onclick = function () {
  areaResultadoGolpe.textContent = "";
  const texto = semAcento(campoMensagem.value);

  if (texto.trim() === "") {
    areaResultadoGolpe.textContent = "Cole uma mensagem primeiro.";
    return;
  }

  let pontos = 0;
  const achados = [];
  for (const sinal of sinaisDeGolpe) {
    if (sinal.regra.test(texto)) {
      pontos += sinal.peso;
      achados.push(sinal);
    }
  }

  let nivel = "Nenhum sinal claro";
  let explicacao = "Mesmo assim, na dúvida, confirme por outro canal.";
  if (pontos >= 6) {
    nivel = "Risco ALTO";
    explicacao = "Muito provavelmente é golpe.";
  } else if (pontos >= 3) {
    nivel = "Risco MÉDIO";
    explicacao = "Desconfie e confirme antes de fazer qualquer coisa.";
  } else if (pontos >= 1) {
    nivel = "Risco BAIXO";
    explicacao = "Há pouco sinal, mas fique atento.";
  }

  const textoNivel = document.createElement("div");
  textoNivel.className = "nota-final";
  textoNivel.textContent = nivel;
  const textoExplicacao = document.createElement("div");
  textoExplicacao.textContent = explicacao;
  areaResultadoGolpe.appendChild(textoNivel);
  areaResultadoGolpe.appendChild(textoExplicacao);

  for (const sinal of achados) {
    const caixa = document.createElement("div");
    caixa.className = "problema";
    const nome = document.createElement("b");
    nome.textContent = sinal.nome;
    const dica = document.createElement("div");
    dica.textContent = sinal.dica;
    caixa.appendChild(nome);
    caixa.appendChild(dica);
    areaResultadoGolpe.appendChild(caixa);
  }

  const conselho = document.createElement("p");
  conselho.textContent = "Na dúvida: não clique, não responda e ligue para o banco ou para a pessoa pelo número que você já tinha.";
  areaResultadoGolpe.appendChild(conselho);

  falar(nivel + ". " + explicacao, false);
};

function luminancia(corHex) {
  let total = 0;
  const pesos = [0.2126, 0.7152, 0.0722];
  for (let i = 0; i < 3; i++) {
    let c = parseInt(corHex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    if (c <= 0.03928) {
      c = c / 12.92;
    } else {
      c = Math.pow((c + 0.055) / 1.055, 2.4);
    }
    total += c * pesos[i];
  }
  return total;
}

function atualizarContraste() {
  const corTexto = corTextoEscolhida.value;
  const corFundo = corFundoEscolhida.value;
  previa.style.color = corTexto;
  previa.style.background = corFundo;

  const l1 = luminancia(corTexto);
  const l2 = luminancia(corFundo);
  const taxa = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  areaResultadoContraste.textContent = "";
  const titulo = document.createElement("div");
  titulo.className = "nota-final";
  titulo.textContent = taxa.toFixed(2) + ":1";
  areaResultadoContraste.appendChild(titulo);

  const criterios = [
    { nome: "Texto normal, nível AA", minimo: 4.5 },
    { nome: "Texto normal, nível AAA", minimo: 7 },
    { nome: "Texto grande, nível AA", minimo: 3 },
    { nome: "Texto grande, nível AAA", minimo: 4.5 }
  ];
  for (const criterio of criterios) {
    const linha = document.createElement("div");
    const passou = taxa >= criterio.minimo;
    linha.className = passou ? "problema ok" : "problema";
    linha.textContent = (passou ? "✓ Aprovado: " : "✗ Reprovado: ") + criterio.nome + " (mínimo " + criterio.minimo + ":1)";
    areaResultadoContraste.appendChild(linha);
  }
}

corTextoEscolhida.oninput = atualizarContraste;
corFundoEscolhida.oninput = atualizarContraste;
atualizarContraste();

const filtros = {
  normal: "none",
  protanopia: "url(#filtro-protanopia)",
  deuteranopia: "url(#filtro-deuteranopia)",
  baixavisao: "blur(2px)",
  cinza: "grayscale(1)"
};

seletorSimulacao.onchange = function () {
  document.getElementById("principal").style.filter = filtros[seletorSimulacao.value];
};

function salvarPreferencias() {
  try {
    localStorage.setItem("dpt-preferencias", JSON.stringify({
      fonte: tamanhoDaFonte,
      contraste: document.documentElement.getAttribute("data-contrast") === "on",
      voz: vozLigada
    }));
  } catch (erro) {
  }
}

function carregarPreferencias() {
  try {
    const salvas = JSON.parse(localStorage.getItem("dpt-preferencias") || "{}");
    if (salvas.fonte) {
      mudarFonte(salvas.fonte);
    }
    if (salvas.contraste) {
      document.documentElement.setAttribute("data-contrast", "on");
      botaoContraste.setAttribute("aria-pressed", "true");
    }
    if (salvas.voz) {
      vozLigada = true;
      botaoVoz.setAttribute("aria-pressed", "true");
    }
  } catch (erro) {
  }
}

carregarPreferencias();