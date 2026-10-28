// ===== Digital para Todos =====
// Botões de acessibilidade, tradutor de tecniquês e avaliador de acessibilidade.

(function () {
  "use strict";

  var corpo = document.body;
  var raiz = document.documentElement;

  /* ---------- Utilidades ---------- */

  function salvar(chave, valor) {
    try { localStorage.setItem(chave, valor); } catch (e) {}
  }
  function ler(chave) {
    try { return localStorage.getItem(chave); } catch (e) { return null; }
  }

  // Tira acentos e deixa minúsculo, para comparar textos
  function normalizar(texto) {
    return String(texto)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* ---------- Tamanho da letra ---------- */

  var TAMANHO_MIN = 14;
  var TAMANHO_MAX = 28;
  var TAMANHO_PADRAO = 18;
  var tamanhoAtual = TAMANHO_PADRAO;

  function aplicarTamanho() {
    raiz.style.setProperty("--tamanho-base", tamanhoAtual + "px");
    salvar("dpt-tamanho", String(tamanhoAtual));
  }

  document.getElementById("btn-fonte-mais").addEventListener("click", function () {
    if (tamanhoAtual < TAMANHO_MAX) { tamanhoAtual += 2; aplicarTamanho(); }
  });

  document.getElementById("btn-fonte-menos").addEventListener("click", function () {
    if (tamanhoAtual > TAMANHO_MIN) { tamanhoAtual -= 2; aplicarTamanho(); }
  });

  /* ---------- Alto contraste ---------- */

  var btnContraste = document.getElementById("btn-contraste");

  function aplicarContraste(ligado) {
    corpo.classList.toggle("alto-contraste", ligado);
    btnContraste.setAttribute("aria-pressed", String(ligado));
    salvar("dpt-contraste", ligado ? "1" : "0");
  }

  btnContraste.addEventListener("click", function () {
    aplicarContraste(!corpo.classList.contains("alto-contraste"));
  });

  /* ---------- Voz ---------- */

  var btnVoz = document.getElementById("btn-voz");
  var btnOuvir = document.getElementById("btn-ouvir");
  var vozLigada = false;
  var temVoz = "speechSynthesis" in window;

  function falar(texto) {
    if (!temVoz || !texto) return;
    window.speechSynthesis.cancel();
    var fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    window.speechSynthesis.speak(fala);
  }

  function aplicarVoz(ligada) {
    vozLigada = ligada;
    btnVoz.setAttribute("aria-pressed", String(ligada));
    if (ligada) {
      falar("Leitura em voz alta ligada. As respostas serão lidas automaticamente.");
    } else if (temVoz) {
      window.speechSynthesis.cancel();
    }
  }

  if (!temVoz) {
    btnVoz.disabled = true;
    btnVoz.title = "Seu navegador não suporta leitura em voz alta.";
    btnOuvir.disabled = true;
    btnOuvir.title = "Seu navegador não suporta leitura em voz alta.";
  }

  btnVoz.addEventListener("click", function () {
    aplicarVoz(!vozLigada);
  });

  // Com a voz ligada, clicar em um texto faz o navegador ler aquele trecho
  document.getElementById("principal").addEventListener("click", function (e) {
    if (!vozLigada) return;
    if (e.target.closest("button, input, textarea, a, label")) return;
    var bloco = e.target.closest("h1, h2, h3, p, .estatistica, .lei, .msg, .problema");
    if (bloco) falar(bloco.innerText);
  });

  /* ---------- Botões que rolam até uma seção ---------- */

  var botoesIr = document.querySelectorAll("[data-ir-para]");
  for (var i = 0; i < botoesIr.length; i++) {
    botoesIr[i].addEventListener("click", function (e) {
      var id = e.currentTarget.getAttribute("data-ir-para");
      var destino = document.getElementById(id);
      if (!destino) return;
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
      destino.setAttribute("tabindex", "-1");
      destino.focus({ preventScroll: true });
    });
  }

  /* ==========================================================
     TRADUTOR DE TECNIQUÊS
     Respostas pré-escritas, escolhidas por palavras-chave.
     ========================================================== */

  var RESPOSTAS = [
    {
      pergunta: "Como faço um Pix?",
      palavras: ["pix", "transferir", "transferencia", "pagar", "chave"],
      resposta: [
        "Pix é uma forma de mandar dinheiro na hora pelo celular. Veja o passo a passo:",
        "1) Abra o aplicativo do seu banco.",
        "2) Toque em \"Pix\".",
        "3) Escolha \"Pagar\" ou \"Transferir\".",
        "4) Digite a chave da pessoa (CPF, celular ou e-mail) ou aponte a câmera para o QR Code.",
        "5) Confira o nome que aparece na tela.",
        "6) Digite o valor e confirme com a sua senha.",
        "Atenção: o Pix cai na hora e é difícil desfazer. Sempre confira o nome antes de confirmar."
      ]
    },
    {
      pergunta: "Como sei se é golpe?",
      palavras: ["golpe", "golpista", "fraude", "falso", "suspeito", "enganar", "mensagem", "whatsapp"],
      resposta: [
        "Desconfie sempre que alguém pedir pressa, dinheiro ou dados pessoais. Sinais de golpe:",
        "• A mensagem diz que é urgente ou que você vai perder algo se não agir agora.",
        "• Pedem senha, códigos que chegam por SMS ou dados do cartão.",
        "• Alguém com o número novo diz ser um parente e pede dinheiro.",
        "• O prêmio ou a oferta é bom demais para ser verdade.",
        "O que fazer: pare, não clique em nada e ligue para a pessoa ou para o banco usando o número que você já conhece. Bancos não pedem senha por mensagem ou telefone."
      ]
    },
    {
      pergunta: "Como criar uma senha segura?",
      palavras: ["senha", "senhas", "segura", "forte", "proteger", "conta"],
      resposta: [
        "Uma boa senha é longa e fácil de lembrar só para você.",
        "• Use uma frase, por exemplo: três palavras sem ligação entre si.",
        "• Misture letras, números e símbolos se puder.",
        "• Não use data de nascimento, nome de filho ou \"123456\".",
        "• Use uma senha diferente para cada conta importante, como banco e e-mail.",
        "• Nunca conte sua senha nem os códigos que chegam por SMS, nem para quem diz ser do banco."
      ]
    },
    {
      pergunta: "Recebi um link estranho. E agora?",
      palavras: ["link", "email", "e-mail", "clicar", "clique", "sms", "anexo"],
      resposta: [
        "Não clique. Links estranhos podem roubar seus dados.",
        "1) Não abra o link nem o anexo.",
        "2) Veja quem mandou: o endereço é de alguém que você conhece?",
        "3) Se parecer ser do seu banco ou de uma loja, abra o aplicativo oficial por conta própria, sem usar o link.",
        "4) Apague a mensagem. Se for no WhatsApp, você pode denunciar e bloquear o contato.",
        "Se já clicou e colocou dados, troque a senha e avise o seu banco logo."
      ]
    },
    {
      pergunta: "Como fazer uma videochamada?",
      palavras: ["video", "videochamada", "chamada", "ligar", "ligacao", "meet", "zoom", "camera"],
      resposta: [
        "Videochamada é uma ligação em que vocês se veem. Pelo WhatsApp:",
        "1) Abra a conversa com a pessoa.",
        "2) Toque no ícone de câmera de vídeo, no alto da tela.",
        "3) Espere a pessoa atender.",
        "4) Se o celular pedir, permita o uso da câmera e do microfone.",
        "Dica: fique num lugar com boa luz e com o Wi-Fi ligado, para gastar menos internet do celular."
      ]
    },
    {
      pergunta: "Como baixar um aplicativo?",
      palavras: ["baixar", "instalar", "aplicativo", "app", "loja", "download"],
      resposta: [
        "Aplicativo é um programa do celular. Para instalar:",
        "1) Abra a loja do seu celular: \"Play Store\" no Android ou \"App Store\" no iPhone.",
        "2) Toque na lupa e escreva o nome do aplicativo.",
        "3) Confira se o nome do criador é o oficial.",
        "4) Toque em \"Instalar\" ou \"Obter\".",
        "Cuidado: baixe só pela loja oficial, nunca por links que chegam em mensagens."
      ]
    },
    {
      pergunta: "O que é nuvem?",
      palavras: ["nuvem", "backup", "armazenar", "guardar", "fotos", "icloud", "drive"],
      resposta: [
        "A nuvem é um espaço na internet onde você guarda fotos, documentos e arquivos.",
        "Não é uma nuvem de verdade: são computadores de uma empresa que guardam as suas coisas.",
        "Vantagem: se você perder ou quebrar o celular, suas fotos continuam guardadas e você acessa de outro aparelho com a sua senha.",
        "Por isso, proteja bem a senha da conta onde guarda esses arquivos."
      ]
    }
  ];

  var MENSAGEM_NAO_SEI = [
    "Ainda não sei responder essa pergunta.",
    "Experimente uma das perguntas prontas acima ou use outras palavras, como \"pix\", \"golpe\" ou \"senha\".",
    "Se for algo importante, peça ajuda a alguém de confiança ou ao seu banco, pelo número oficial."
  ];

  var conversa = document.getElementById("conversa");
  var areaPerguntas = document.getElementById("perguntas-rapidas");
  var formPergunta = document.getElementById("form-pergunta");
  var campoPergunta = document.getElementById("campo-pergunta");
  var ultimaResposta = "";

  function adicionarMensagem(linhas, tipo) {
    var msg = document.createElement("div");
    msg.className = "msg " + (tipo === "usuario" ? "msg-usuario" : "msg-bot");
    for (var i = 0; i < linhas.length; i++) {
      var p = document.createElement("p");
      p.textContent = linhas[i];
      msg.appendChild(p);
    }
    conversa.appendChild(msg);
    conversa.scrollTop = conversa.scrollHeight;
  }

  function responder(textoPergunta) {
    var pergunta = textoPergunta.trim();
    if (!pergunta) return;

    adicionarMensagem([pergunta], "usuario");

    var alvo = normalizar(pergunta);
    var melhor = null;
    var melhorPontos = 0;

    for (var i = 0; i < RESPOSTAS.length; i++) {
      var pontos = 0;
      for (var j = 0; j < RESPOSTAS[i].palavras.length; j++) {
        if (alvo.indexOf(normalizar(RESPOSTAS[i].palavras[j])) !== -1) pontos++;
      }
      if (pontos > melhorPontos) { melhorPontos = pontos; melhor = RESPOSTAS[i]; }
    }

    var linhas = melhor ? melhor.resposta : MENSAGEM_NAO_SEI;
    adicionarMensagem(linhas, "bot");
    ultimaResposta = linhas.join(" ");
    if (vozLigada) falar(ultimaResposta);
  }

  // Cria os botões de perguntas prontas
  RESPOSTAS.forEach(function (item) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "pergunta-pronta";
    b.textContent = item.pergunta;
    b.addEventListener("click", function () { responder(item.pergunta); });
    areaPerguntas.appendChild(b);
  });

  formPergunta.addEventListener("submit", function (e) {
    e.preventDefault();
    responder(campoPergunta.value);
    campoPergunta.value = "";
    campoPergunta.focus();
  });

  btnOuvir.addEventListener("click", function () {
    if (!ultimaResposta) {
      falar("Faça uma pergunta primeiro, para eu ter o que ler.");
      return;
    }
    falar(ultimaResposta);
  });

  /* ==========================================================
     AVALIADOR DE ACESSIBILIDADE
     Lê o HTML colado com o DOMParser (não executa nenhum código)
     e confere algumas regras básicas da WCAG 2.2.
     ========================================================== */

  var campoHtml = document.getElementById("campo-html");
  var btnAnalisar = document.getElementById("btn-analisar");
  var btnExemplo = document.getElementById("btn-exemplo");
  var resultado = document.getElementById("resultado");

  var EXEMPLO =
    '<h1>Minha loja</h1>\n' +
    '<h3>Ofertas</h3>\n' +
    '<img src="banner.png">\n' +
    '<div onclick="enviar()">Enviar</div>\n' +
    '<input type="text" placeholder="Seu e-mail">\n' +
    '<a href="/promo">Clique aqui</a>\n' +
    '<button><img src="lupa.png"></button>';

  var PESO = { alta: 15, media: 8, baixa: 3 };
  var ROTULO_GRAVIDADE = { alta: "ALTA", media: "MÉDIA", baixa: "BAIXA" };

  // Descobre o "nome" que um leitor de tela falaria para o elemento
  function nomeAcessivel(el, doc) {
    var aria = (el.getAttribute("aria-label") || "").trim();
    if (aria) return aria;

    var ref = el.getAttribute("aria-labelledby");
    if (ref) {
      var partes = ref.split(/\s+/).map(function (id) {
        var alvo = doc.getElementById(id);
        return alvo ? alvo.textContent.trim() : "";
      }).join(" ").trim();
      if (partes) return partes;
    }

    var texto = (el.textContent || "").trim();
    if (texto) return texto;

    var imgs = el.querySelectorAll("img[alt]");
    for (var i = 0; i < imgs.length; i++) {
      var alt = (imgs[i].getAttribute("alt") || "").trim();
      if (alt) return alt;
    }

    return (el.getAttribute("title") || "").trim();
  }

  function temRotulo(campo, doc) {
    if ((campo.getAttribute("aria-label") || "").trim()) return true;
    if ((campo.getAttribute("aria-labelledby") || "").trim()) return true;
    var id = campo.getAttribute("id");
    if (id && doc.querySelector('label[for="' + id.replace(/"/g, '\\"') + '"]')) return true;
    if (campo.closest("label")) return true;
    return false;
  }

  function resumoTrecho(el) {
    var t = el.outerHTML.replace(/\s+/g, " ").trim();
    return t.length > 140 ? t.slice(0, 140) + "…" : t;
  }

  function analisar(codigo) {
    var doc = new DOMParser().parseFromString(codigo, "text/html");
    var problemas = [];

    function add(gravidade, titulo, explicacao, correcao, el) {
      problemas.push({
        gravidade: gravidade,
        titulo: titulo,
        explicacao: explicacao,
        correcao: correcao,
        trecho: el ? resumoTrecho(el) : ""
      });
    }

    // Idioma da página (só faz sentido se o código tiver a tag <html>)
    if (/<html[\s>]/i.test(codigo)) {
      var h = doc.documentElement;
      if (!(h.getAttribute("lang") || "").trim()) {
        add("media", "Página sem idioma definido (WCAG 3.1.1)",
          "Sem o idioma, o leitor de tela pode ler o texto com a pronúncia errada.",
          'Adicione o idioma na tag html, por exemplo: <html lang="pt-BR">.', null);
      }
    }

    // Imagens sem texto alternativo
    doc.querySelectorAll("img").forEach(function (img) {
      if (!img.hasAttribute("alt")) {
        add("alta", "Imagem sem texto alternativo (WCAG 1.1.1)",
          "Quem não enxerga a imagem não sabe o que ela mostra.",
          'Adicione alt="descrição curta da imagem". Se for só decoração, use alt="" (vazio).', img);
      }
    });

    // Botões e links sem nome
    doc.querySelectorAll('button, a[href], [role="button"]').forEach(function (el) {
      if (!nomeAcessivel(el, doc)) {
        add("alta", "Botão ou link sem nome (WCAG 4.1.2)",
          "O leitor de tela fala apenas \"botão\" ou \"link\", sem dizer para que serve.",
          'Coloque um texto visível ou adicione aria-label="o que ele faz".', el);
      }
    });

    // Campos sem rótulo
    doc.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), select, textarea'
    ).forEach(function (campo) {
      if (!temRotulo(campo, doc)) {
        add("alta", "Campo sem rótulo (WCAG 1.3.1 e 3.3.2)",
          "O placeholder some quando a pessoa digita e nem sempre é lido. Sem rótulo, o campo fica sem explicação.",
          'Use <label for="id-do-campo">Texto</label> ligado ao campo, ou aria-label.', campo);
      }
    });

    // Elementos clicáveis que não são botões
    doc.querySelectorAll("div[onclick], span[onclick]").forEach(function (el) {
      var temPapel = el.hasAttribute("role");
      var temFoco = el.hasAttribute("tabindex");
      if (!temPapel || !temFoco) {
        add("alta", "Elemento clicável que não funciona no teclado (WCAG 2.1.1)",
          "Quem usa só o teclado não consegue chegar nem ativar esse elemento.",
          "Troque por <button>. Ele já vem com teclado e leitor de tela funcionando.", el);
      }
    });

    // Links com texto genérico
    doc.querySelectorAll("a[href]").forEach(function (a) {
      var t = normalizar(a.textContent).trim().replace(/[.!…]+$/, "");
      if (t === "clique aqui" || t === "saiba mais" || t === "leia mais" || t === "aqui" || t === "veja mais") {
        add("baixa", "Link com texto pouco claro (WCAG 2.4.4)",
          "Quem navega por uma lista de links ouve só \"" + t + "\" e não sabe para onde vai.",
          'Diga o destino no texto, por exemplo: "Veja as ofertas da semana".', a);
      }
    });

    // Ordem dos títulos
    var anterior = 0;
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(function (t) {
      var nivel = parseInt(t.tagName.charAt(1), 10);
      if (anterior && nivel > anterior + 1) {
        add("media", "Título pula de nível (WCAG 1.3.1)",
          "Saltar de h" + anterior + " para h" + nivel + " confunde quem navega pela estrutura da página.",
          "Use os títulos em ordem: h1, depois h2, depois h3, sem pular.", t);
      }
      anterior = nivel;
    });

    // tabindex positivo
    doc.querySelectorAll("[tabindex]").forEach(function (el) {
      if (parseInt(el.getAttribute("tabindex"), 10) > 0) {
        add("media", "Ordem de foco alterada (WCAG 2.4.3)",
          "Valores de tabindex maiores que zero bagunçam a ordem natural do teclado.",
          'Remova o tabindex ou use tabindex="0".', el);
      }
    });

    // iframe sem título
    doc.querySelectorAll("iframe").forEach(function (f) {
      if (!(f.getAttribute("title") || "").trim()) {
        add("media", "Quadro incorporado sem título (WCAG 4.1.2)",
          "O leitor de tela não consegue dizer o que há dentro do quadro.",
          'Adicione title="descrição do conteúdo".', f);
      }
    });

    // vídeo ou áudio que toca sozinho
    doc.querySelectorAll("video[autoplay], audio[autoplay]").forEach(function (m) {
      add("media", "Mídia que toca sozinha (WCAG 1.4.2)",
        "Som automático atrapalha quem usa leitor de tela e quem se distrai com facilidade.",
        "Remova o autoplay ou ofereça um botão para pausar.", m);
    });

    return problemas;
  }

  function descricaoNota(nota) {
    if (nota >= 90) return "Muito bom";
    if (nota >= 70) return "Bom, mas com ajustes";
    if (nota >= 40) return "Precisa melhorar";
    return "Muitas barreiras";
  }

  function mostrarResultado(problemas) {
    resultado.textContent = "";

    var penalidade = 0;
    problemas.forEach(function (p) { penalidade += PESO[p.gravidade]; });
    var nota = Math.max(0, 100 - penalidade);

    var caixaNota = document.createElement("div");
    caixaNota.className = "nota-geral";
    var num = document.createElement("span");
    num.className = "nota-numero";
    num.textContent = String(nota);
    var txt = document.createElement("div");
    txt.className = "nota-texto";
    var forte = document.createElement("b");
    forte.textContent = descricaoNota(nota) + " (nota de 0 a 100)";
    var detalhe = document.createElement("span");
    detalhe.textContent = problemas.length === 0
      ? "Nenhum problema nas regras básicas conferidas."
      : problemas.length + (problemas.length === 1 ? " problema encontrado." : " problemas encontrados.");
    txt.appendChild(forte);
    txt.appendChild(detalhe);
    caixaNota.appendChild(num);
    caixaNota.appendChild(txt);
    resultado.appendChild(caixaNota);

    if (problemas.length === 0) {
      var aviso = document.createElement("p");
      aviso.className = "observacao";
      aviso.textContent = "Isso não garante que tudo esteja acessível. Teste também usando só o teclado e um leitor de tela.";
      resultado.appendChild(aviso);
      return;
    }

    // Mostra primeiro os mais graves
    var ordem = { alta: 0, media: 1, baixa: 2 };
    problemas.sort(function (a, b) { return ordem[a.gravidade] - ordem[b.gravidade]; });

    problemas.forEach(function (p) {
      var cartao = document.createElement("article");
      cartao.className = "problema gravidade-" + p.gravidade;

      var titulo = document.createElement("div");
      var etiqueta = document.createElement("span");
      etiqueta.className = "etiqueta";
      etiqueta.textContent = ROTULO_GRAVIDADE[p.gravidade];
      var tituloTexto = document.createElement("b");
      tituloTexto.textContent = p.titulo;
      titulo.appendChild(etiqueta);
      titulo.appendChild(tituloTexto);
      cartao.appendChild(titulo);

      var exp = document.createElement("p");
      exp.textContent = p.explicacao;
      cartao.appendChild(exp);

      var cor = document.createElement("p");
      var corForte = document.createElement("b");
      corForte.textContent = "Como corrigir: ";
      cor.appendChild(corForte);
      cor.appendChild(document.createTextNode(p.correcao));
      cartao.appendChild(cor);

      if (p.trecho) {
        var codigo = document.createElement("code");
        codigo.className = "trecho";
        codigo.textContent = p.trecho; // textContent evita que o código colado seja interpretado
        cartao.appendChild(codigo);
      }

      resultado.appendChild(cartao);
    });
  }

  btnAnalisar.addEventListener("click", function () {
    var codigo = campoHtml.value.trim();
    if (!codigo) {
      resultado.textContent = "";
      var p = document.createElement("p");
      p.textContent = "Cole um trecho de HTML na caixa acima para eu avaliar.";
      resultado.appendChild(p);
      campoHtml.focus();
      return;
    }
    mostrarResultado(analisar(codigo));
  });

  btnExemplo.addEventListener("click", function () {
    campoHtml.value = EXEMPLO;
    mostrarResultado(analisar(EXEMPLO));
  });

  /* ---------- Restaurar preferências de quem já visitou ---------- */

  var tamanhoSalvo = parseInt(ler("dpt-tamanho"), 10);
  if (tamanhoSalvo >= TAMANHO_MIN && tamanhoSalvo <= TAMANHO_MAX) {
    tamanhoAtual = tamanhoSalvo;
    aplicarTamanho();
  }
  if (ler("dpt-contraste") === "1") {
    aplicarContraste(true);
  }
})();
