function setRandomHeaderColor() {
    const colorVariableNames = [
      "--header-cor-1",
      "--header-cor-2",
      "--header-cor-3",
      "--header-cor-4",
      "--header-cor-5",
    ];

    // Escolhe um nome de variável aleatoriamente
    const randomIndex = Math.floor(Math.random() * colorVariableNames.length);
    const randomColorName = colorVariableNames[randomIndex];

    // Define a variável --header-bg-dinamico para usar a cor da variável sorteada
    // ex: --header-bg-dinamico = var(--header-cor-3)
    document.documentElement.style.setProperty(
      "--header-bg-dinamico",
      `var(${randomColorName})`
    );
  }

document.addEventListener("DOMContentLoaded", () => {
  setRandomHeaderColor(); // << ADICIONE ESTA LINHA
  const copyButton = document.querySelector(".copy-button");
  const codeBlock = document.getElementById("myCodeBlock");

  const form = document.getElementById("form-pesquisa");
  const messageDiv = document.getElementById("form-message");
  //const API_URL = "https://wiki1dtm-backend.onrender.com";
  const API_URL = "http://localhost:3000";

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Impede o envio padrão do formulário

      const formData = new FormData(form);

      const tagValue = formData.get("tag").trim();
      const tagRegex = /^<[a-zA-Z0-9]+>$/;
      if (!tagRegex.test(tagValue)) {
        messageDiv.textContent =
          'Erro: Formato da tag inválido. Por favor, use o formato "<header>", sem espaços ou caracteres especiais.';
        messageDiv.className = "message error";
        messageDiv.style.display = "block";
        return; // Interrompe o envio se a validação falhar
      }

      const sourcesValue = formData.get("source1").trim();
      // Função para verificar se uma string é uma URL válida
      const isValidUrl = (urlString) => {
        // Se o campo estiver vazio, consideramos válido (não é obrigatório)
        if (!urlString) return true;
        try {
          new URL(urlString);
          return true; // A URL é válida se nenhum erro for lançado
        } catch (e) {
          return false; // A URL é inválida se um erro for capturado
        }
      };

      if (!isValidUrl(sourcesValue)) {
        messageDiv.textContent =
          'Erro: O link da fonte parece ser inválido. Por favor, insira uma URL completa (ex: https://www.exemplo.com).';
        messageDiv.className = "message error";
        messageDiv.style.display = "block";
        return; // Interrompe o envio se a validação falhar
      }

      const data = {
        author1: formData.get("author1"),
        author2: formData.get("author2"),

        tag: formData.get("tag"),
        description: formData.get("descricao"),
        uses: formData.get("usos"),
        code: formData.get("codigo"),
        source1: formData.get("source1"),
        source2: formData.get("source2"),

      };

      // Exibe mensagem de "enviando"
      console.log("Enviando dados:", data);
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
