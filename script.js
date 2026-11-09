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
};

let vozLigada = false;
let ultimaResposta = "";

botaoVoz.onclick = function () {
  vozLigada = !vozLigada;
  botaoVoz.setAttribute("aria-pressed", vozLigada);

  if (vozLigada === false) {
    speechSynthesis.cancel();
  }
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
  }
];

function mostrarMensagem(tipo, texto) {
  const mensagem = document.createElement("div");
  mensagem.className = "mensagem " + tipo;
  mensagem.textContent = texto;
  areaConversa.appendChild(mensagem);

  areaConversa.scrollTop = areaConversa.scrollHeight;
}

function responder(textoDigitado) {
  const texto = textoDigitado.toLowerCase();

  for (const assunto of assuntos) {
    for (const palavra of assunto.palavrasChave) {
      if (texto.includes(palavra)) {
        return assunto.resposta;
      }
    }
  }

  return "Ainda não sei responder isso. Tente perguntar sobre Pix, golpes, senha, gov.br, WhatsApp ou Wi-Fi.";
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

for (const assunto of assuntos) {
  criarBotaoDePergunta(assunto);
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

  let nota = 100 - problemas.length * 12;
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