import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const signupForm = document.getElementById("signup-form");
const signupBtn = document.getElementById("signup-btn");
const formBox = document.getElementById("form-box");
const successBox = document.getElementById("success-box");
const toast = document.getElementById("toast");

function mostrarAviso(mensagem, tipo = "info") {
  toast.textContent = mensagem;
  toast.className = `toast ${tipo}`;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 5000);
}

function traduzirErro(codigo) {
  switch (codigo) {
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/weak-password":
      return "Senha muito fraca. Use pelo menos 6 caracteres.";
    case "auth/operation-not-allowed":
      return "Cadastro por e-mail/senha não está habilitado no Firebase.";
    case "auth/network-request-failed":
      return "Falha de conexão. Verifique sua internet.";
    default:
      return "Não foi possível concluir o cadastro. Tente novamente.";
  }
}

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("signup-nome").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const senha = document.getElementById("signup-password").value;
  const senha2 = document.getElementById("signup-password2").value;

  if (senha !== senha2) {
    mostrarAviso("As senhas não coincidem.", "error");
    return;
  }

  signupBtn.disabled = true;
  signupBtn.textContent = "Cadastrando...";

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    if (nome) {
      await updateProfile(cred.user, { displayName: nome });
    }
    formBox.style.display = "none";
    successBox.style.display = "block";
  } catch (error) {
    console.error("Erro no cadastro:", error);
    mostrarAviso(traduzirErro(error.code), "error");
    signupBtn.disabled = false;
    signupBtn.textContent = "Cadastrar";
  }
});
