document.addEventListener("DOMContentLoaded", () => {
  const copyButton = document.querySelector(".copy-button");
  const codeBlock = document.getElementById("myCodeBlock");

  const form = document.getElementById("form-pesquisa");
  const messageDiv = document.getElementById("form-message");
  const API_URL = "https://wiki1dtm-backend.onrender.com";
  //const API_URL = "http://localhost:3000";

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário

      const formData = new FormData(form);
      const data = {
        author: formData.get("nome1"),
        author2: formData.get("nome2"),

        tag: formData.get("tag"),
        description: formData.get("descricao"),
        uses: formData.get("usos"),
        code: formData.get("codigo"),
        sources: formData.get("fontes"),
      };

      // Exibe mensagem de "enviando"
      messageDiv.textContent = "Enviando sua contribuição...";
      messageDiv.className = "message";
      messageDiv.style.display = "block";

      try {
        const response = await fetch(`${API_URL}/api/submissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          messageDiv.textContent =
            "Contribuição enviada com sucesso! Obrigado.";
          messageDiv.className = "message success";
          form.reset(); // Limpa o formulário
        } else {
          throw new Error(result.error || "Ocorreu um erro ao enviar.");
        }
      } catch (error) {
        messageDiv.textContent = `Erro: ${error.message}`;
        messageDiv.className = "message error";
        console.error("Erro no envio do formulário:", error);
      }
    });
  }
  if (copyButton && codeBlock) {
    copyButton.addEventListener("click", () => {
      // Cria um elemento temporário de textarea para copiar o texto
      const textarea = document.createElement("textarea");
      textarea.value = codeBlock.textContent; // Pega o texto bruto do bloco de código
      textarea.style.position = "fixed"; // Para que não afete o layout
      textarea.style.left = "-9999px"; // Fora da tela
      document.body.appendChild(textarea);
      textarea.select(); // Seleciona o texto no textarea

      try {
        // Executa o comando de cópia
        document.execCommand("copy");
        // Altera o texto do botão e adiciona uma classe para feedback visual
        copyButton.textContent = "Copiado!";
        copyButton.classList.add("copied");

        // Volta o texto original e remove a classe depois de um tempo
        setTimeout(() => {
          copyButton.textContent = "Copiar";
          copyButton.classList.remove("copied");
        }, 2000); // 2 segundos
      } catch (err) {
        console.error("Erro ao copiar o texto:", err);
        alert("Falha ao copiar o texto. Por favor, copie manualmente.");
      } finally {
        // Remove o textarea temporário
        document.body.removeChild(textarea);
      }
    });
  }
});
