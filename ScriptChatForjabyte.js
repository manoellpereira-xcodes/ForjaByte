// ===== NexByte | Forja-Byte =====
const API_URL = "https://api.openai.com/v1/chat/completions";

const CONFIG = {
  model: "gpt-5.4-nano",
  temperature: 1.5,
  maxTokens: 75
};

const SYSTEM_PROMPT =
  "Você é um chatbot da empresa Forja-Byte, seu nome é NexByte. Sua função é auxiliar com dúvidas referentes a " +
  "computadores, peças, periféricos e setups de informática voltados para games e escritório (office). " +
  "Responda sempre em no máximo 75 tokens. Se a resposta precisar ser maior, faça um resumo objetivo. " +
  "Para perguntas que não sejam do contexto de saudação ou fora do contexto de informática você deverá responder " +
  "“Estou configurado com a função de auxiliar no contexto de informática. Esta pergunta foge do meu contexto”.";

const BOAS_VINDAS =
  "Olá! Eu sou o NexByte. Pergunte sobre PCs, peças e periféricos para games e escritório, " +
  "ou escolha uma pergunta rápida ao lado.";

const apiKeyInput = document.getElementById("apiKey");
const messageInput = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");
const messagesBox = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const keyStatus = document.getElementById("keyStatus");
const chatStatus = document.getElementById("chatStatus");
const clearBtn = document.getElementById("clearBtn");

// Histórico mantido só em memória (a chave nunca é salva no navegador)
const history = [];

function avatarBot() {
  const av = document.createElement("span");
  av.className = "fb-av";
  av.setAttribute("aria-hidden", "true");
  if (window.FB_MASCOTE) av.innerHTML = window.FB_MASCOTE.svg({});
  return av;
}

function addMessage(text, type) {
  const el = document.createElement("div");
  el.className = "fb-msg fb-msg--" + type;

  if (type !== "user") el.appendChild(avatarBot());

  const bub = document.createElement("div");
  bub.className = "fb-bub";
  if (text) bub.textContent = text;
  el.appendChild(bub);

  messagesBox.appendChild(el);
  messagesBox.scrollTop = messagesBox.scrollHeight;
  return el;
}

function addLoading() {
  const el = addMessage("", "bot");
  const bub = el.querySelector(".fb-bub");
  bub.innerHTML = '<span class="fb-dots" role="status" aria-label="NexByte está digitando"><i></i><i></i><i></i></span>';
  return el;
}

function buildBody(useLegacyParams) {
  const body = {
    model: CONFIG.model,
    temperature: CONFIG.temperature,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history]
  };
  // Modelos novos usam max_completion_tokens; os antigos usam max_tokens
  if (useLegacyParams) body.max_tokens = CONFIG.maxTokens;
  else body.max_completion_tokens = CONFIG.maxTokens;
  return body;
}

async function callApi(apiKey, body) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey
    },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function requestReply(apiKey) {
  let result = await callApi(apiKey, buildBody(false));

  // Se o modelo rejeitar max_completion_tokens, tenta com max_tokens
  if (!result.ok && /max_completion_tokens/i.test(result.data?.error?.message || "")) {
    result = await callApi(apiKey, buildBody(true));
  }

  if (!result.ok) {
    const msg = result.data?.error?.message || "Erro " + result.status;
    throw new Error(msg);
  }

  const reply = result.data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error("A API respondeu sem texto. Se o modelo usa raciocínio, o limite de 75 tokens pode ter sido consumido antes da resposta.");
  }
  return reply;
}

async function sendMessage(texto) {
  const apiKey = apiKeyInput.value.trim();
  const text = (typeof texto === "string" ? texto : messageInput.value).trim();

  if (!text) return;

  if (!apiKey) {
    messageInput.value = text; // não perde o que foi digitado
    addMessage("Informe sua chave de API no campo “Chave de API” antes de enviar.", "error");
    apiKeyInput.focus();
    return;
  }

  addMessage(text, "user");
  history.push({ role: "user", content: text });
  messageInput.value = "";
  sendBtn.disabled = true;

  const loading = addLoading();

  try {
    const reply = await requestReply(apiKey);
    loading.remove();
    addMessage(reply, "bot");
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    loading.remove();
    history.pop(); // remove a mensagem que falhou do histórico
    addMessage("Não consegui responder: " + err.message, "error");
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

function reiniciar() {
  history.length = 0;
  messagesBox.innerHTML = "";
  addMessage(BOAS_VINDAS, "bot");
}

function atualizarChave() {
  const tem = apiKeyInput.value.trim().length > 0;
  chatStatus.dataset.on = String(tem);
  chatStatus.textContent = tem ? "Pronto" : "Sem chave";
  keyStatus.dataset.ok = String(tem);
  keyStatus.textContent = tem
    ? "Chave informada. Ela fica só na memória desta página."
    : "Cole sua chave da OpenAI para começar.";
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

document.querySelectorAll("[data-q]").forEach((btn) => {
  btn.addEventListener("click", () => sendMessage(btn.dataset.q));
});

clearBtn.addEventListener("click", () => {
  reiniciar();
  messageInput.focus();
});

apiKeyInput.addEventListener("input", atualizarChave);

// Mostrar / ocultar a chave de API
const showKey = document.getElementById("showKey");
if (showKey) {
  showKey.addEventListener("change", () => {
    apiKeyInput.type = showKey.checked ? "text" : "password";
  });
}

atualizarChave();
reiniciar();