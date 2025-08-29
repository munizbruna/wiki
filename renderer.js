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

const API_URL = 'https://wiki1dtm-backend.onrender.com';
//const API_URL = 'http://localhost:3000';

// Pega os elementos do DOM
const pageTitle = document.getElementById('tag-name');
const submissionsContainer = document.getElementById('submissions-container');
const urlParams = new URLSearchParams(window.location.search);
const tagName = urlParams.get('tag');

 //Sanitize a string to prevent basic HTML injection.
function sanitize(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

 //Adiciona a funcionalidade de clique a todos os botões de cópia.

function setupCopyButtons() {
    const allCopyButtons = document.querySelectorAll('.copy-button');
    
    allCopyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Encontra o bloco de código relativo a este botão
            const codeBlock = event.target.nextElementSibling.querySelector('code');
            
            if (codeBlock) {
                navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                    button.textContent = 'Copiado!';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.textContent = 'Copiar';
                        button.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Falha ao copiar:', err);
                    // Fallback para o método antigo se a Clipboard API falhar
                    // (Opcional, mas bom para compatibilidade)
                });
            }
        });
    });
}


// Função principal para buscar e renderizar os dados da API
async function fetchAndRenderSubmissions() {
    if (!tagName) {
        pageTitle.textContent = 'Tag não encontrada';
        submissionsContainer.innerHTML = '<p>Por favor, especifique uma tag na URL (ex: ?tag=header).</p>';
        return;
    }

    pageTitle.textContent = `<${sanitize(tagName)}>`;
    document.title = `Detalhes da Tag: <${sanitize(tagName)}>`;

    try {
        const response = await fetch(`${API_URL}/api/tags/${tagName}`);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const submissions = await response.json();

        submissionsContainer.innerHTML = ''; // Limpa o container

        if (submissions.length === 0) {
            submissionsContainer.innerHTML = '<p>Ainda não há contribuições para esta tag. Seja o primeiro a enviar!</p>';
            return;
        }

        submissions.forEach((submission, index) => {
            const submissionElement = document.createElement('div');
            submissionElement.className = 'submission-card';
            const safeCodeExample = escapeHtml(submission.code_example); 

            submissionElement.innerHTML = `
                <div class="submission-content">
                    <h3>O que é?</h3>
                    <p>${sanitize(submission.description)}</p>

                    <h3>Usos Comuns</h3>
                    <p>${sanitize(submission.common_uses)}</p>

                    <h3>Exemplo de Código</h3>
                    <div class="code-editor-container">
                        <button class="copy-button">Copiar</button>
                        <pre><code class="language-html">${safeCodeExample}</code></pre>
                    </div>

                    <div class="submission-meta">
                        <p><strong>Enviado por:</strong></p>
                        <ul class="">
                            <li>${sanitize(submission.author_name)}</li>
                            <li>${sanitize(submission.author_name2)}</li>
                        </ul>

                        <p><strong>Fontes:</strong> <a href="${sanitize(submission.sources)}" target="_blank" rel="noopener noreferrer">${sanitize(submission.sources)}</a></p>
                    </div>
                </div>
            `;
            submissionsContainer.appendChild(submissionElement);
        });

        // DEPOIS de adicionar todos os cards ao DOM:
        // 1. Adiciona a funcionalidade aos botões de cópia
        setupCopyButtons();
        
        // 2. Manda o Prism.js colorir todos os blocos de código na página
        Prism.highlightAll();

    } catch (error) {
        console.error('Erro ao buscar as contribuições:', error);
        submissionsContainer.innerHTML = '<p class="error-message">Não foi possível carregar as informações. Verifique se o servidor backend está rodando.</p>';
    }
}

// Executa a função quando o conteúdo da página é carregado
document.addEventListener('DOMContentLoaded', () => {
    setRandomHeaderColor(); // << ADICIONE ESTA LINHA
    fetchAndRenderSubmissions(); 
});


function escapeHtml(unsafeString) {
    if (!unsafeString) return '';
    return unsafeString
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}