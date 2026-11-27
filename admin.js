import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loginScreen = document.getElementById("login-screen");
const adminScreen = document.getElementById("admin-screen");
const loginForm = document.getElementById("login-form");
const cmsForm = document.getElementById("cms-form");
const logoutBtn = document.getElementById("logout-btn");
const saveBtn = document.getElementById("save-btn");
const toast = document.getElementById("toast");

// Configurações do Cloudinary
const CLOUD_NAME = "helenabasseto";
const UPLOAD_PRESET = "site_drkersten";

let dadosAtuais = {};
const arquivosSelecionados = {};

// Campos onde a quebra de linha vira <br> no site
const CAMPOS_COM_BR = ["home_banner_titulo", "contato_endereco"];

// Evita que o Enter envie o formulário fora de textareas
cmsForm.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
  }
});

function mostrarAviso(mensagem, tipo = "info") {
  toast.textContent = mensagem;
  toast.className = `toast ${tipo}`;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 4000);
}

// Monitora estado de autenticação
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginScreen.style.display = "none";
    adminScreen.style.display = "block";
    await carregarDadosNoPainel();
  } else {
    loginScreen.style.display = "flex";
    adminScreen.style.display = "none";
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    mostrarAviso("Login realizado com sucesso!", "success");
  } catch (error) {
    console.error("Erro no login:", error);
    mostrarAviso("E-mail ou senha inválidos.", "error");
  }
});

// Logout
logoutBtn.addEventListener("click", () => signOut(auth));

// Pré-visualização imediata das imagens escolhidas
document.querySelectorAll("input[type='file'][data-img-key]").forEach((input) => {
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const key = input.getAttribute("data-img-key");
    if (file) {
      arquivosSelecionados[key] = file;
      const preview = document.getElementById(`prev_${key}`);
      if (preview) {
        preview.src = URL.createObjectURL(file);
      }
    }
  });
});

// Carrega valores salvos no Firestore
async function carregarDadosNoPainel() {
  try {
    const docRef = doc(db, "site_conteudo", "geral");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      dadosAtuais = docSnap.data();

      Object.keys(dadosAtuais).forEach((chave) => {
        const campo = cmsForm.querySelector(`[name="${chave}"]`);
        if (campo) {
          let valor = dadosAtuais[chave];
          if (CAMPOS_COM_BR.includes(chave) && typeof valor === "string") {
            valor = valor.replace(/<br\s*\/?>/gi, "\n");
          }
          campo.value = valor;
        }
        if (chave.startsWith("img_") && dadosAtuais[chave]) {
          const preview = document.getElementById(`prev_${chave}`);
          if (preview) preview.src = dadosAtuais[chave];
        }
      });
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    mostrarAviso("Erro ao carregar dados do banco.", "error");
  }
}

// Salvar textos e imagens
cmsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  saveBtn.disabled = true;
  saveBtn.textContent = "Salvando...";
  mostrarAviso("A enviar alterações...", "info");

  try {
    const novosDados = { ...dadosAtuais };

    // 1. Coleta textos do formulário
    const formData = new FormData(cmsForm);
    formData.forEach((valor, chave) => {
      if (CAMPOS_COM_BR.includes(chave)) {
        valor = valor.replace(/\r?\n/g, "<br>");
      }
      novosDados[chave] = valor;
    });

    // 2. Faz upload das imagens alteradas para o Cloudinary
    for (const [chave, arquivo] of Object.entries(arquivosSelecionados)) {
      const data = new FormData();
      data.append("file", arquivo);
      data.append("upload_preset", UPLOAD_PRESET);

      const resposta = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data
      });

      const resultado = await resposta.json();
      
      if (resposta.ok && resultado.secure_url) {
        novosDados[chave] = resultado.secure_url;
        delete arquivosSelecionados[chave];
      } else {
        console.error("Erro do Cloudinary:", resultado);
        throw new Error(resultado.error?.message || "Falha desconhecida no upload da imagem.");
      }
    }

    // 3. Salva tudo no Firestore
    await setDoc(doc(db, "site_conteudo", "geral"), novosDados, { merge: true });
    dadosAtuais = novosDados;

    mostrarAviso("Site atualizado com sucesso!", "success");
  } catch (error) {
    console.error("Erro detalhado ao salvar:", error);
    mostrarAviso(`Erro ao salvar: ${error.message}`, "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Salvar Alterações";
  }
});
