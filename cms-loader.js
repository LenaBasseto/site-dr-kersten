// =========================================================================
// CARREGADOR DINÂMICO DE CONTEÚDO (TEXTOS E IMAGENS)
// =========================================================================
import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function carregarConteudoDinamico() {
  try {
    const docRef = doc(db, "site_conteudo", "geral");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dados = docSnap.data();

      // Atualiza todos os textos que possuem data-cms-text
      document.querySelectorAll("[data-cms-text]").forEach((el) => {
        const chave = el.getAttribute("data-cms-text");
        if (dados[chave] !== undefined && dados[chave] !== "") {
          if (el.hasAttribute("data-cms-html")) {
            el.innerHTML = dados[chave];
          } else {
            el.textContent = dados[chave];
          }
        }
      });

      // Atualiza todas as imagens que possuem data-cms-img
      document.querySelectorAll("[data-cms-img]").forEach((img) => {
        const chave = img.getAttribute("data-cms-img");
        if (dados[chave] !== undefined && dados[chave] !== "") {
          img.src = dados[chave];
        }
      });

      // Atualiza links de contato (telefone, whatsapp, email) se configurados
      document.querySelectorAll("[data-cms-href]").forEach((link) => {
        const chave = link.getAttribute("data-cms-href");
        if (dados[chave] !== undefined && dados[chave] !== "") {
          link.href = dados[chave];
        }
      });
    }
  } catch (error) {
    console.warn("CMS: Usando conteúdo padrão estático (Firebase não configurado ou offline).", error);
  }
}

document.addEventListener("DOMContentLoaded", carregarConteudoDinamico);
