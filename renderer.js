// A URL da sua API backend que está rodando localmente
const API_URL = 'https://wiki1dtm-backend.onrender.com';

// Pega o nome da tag da URL (ex: tag-template.html?tag=header -> "header")
const urlParams = new URLSearchParams(window.location.search);
const tagName = urlParams.get('tag');

const pageTitle = document.getElementById('tag-name');
const submissionsContainer = document.getElementById('submissions-container');

/**
 * Sanitize a string to prevent basic HTML injection.
 * @param {string} str The string to sanitize.
 * @returns {string} The sanitized string.
 */
function sanitize(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Função principal para buscar e renderizar os dados da API
async function fetchAndRenderSubmissions() {
    if (!tagName) {
        pageTitle.textContent = 'Tag não encontrada';
        submissionsContainer.innerHTML = '<p>Por favor, especifique uma tag na URL (ex: ?tag=header).</p>';
        return;
    }

    // Define o título da página
    pageTitle.textContent = `<${tagName}>`;
    document.title = `Detalhes da Tag: <${tagName}>`;

    try {
        // Faz a requisição para a API
        const response = await fetch(`${API_URL}/${tagName}`);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const submissions = await response.json();

        // Limpa o container
        submissionsContainer.innerHTML = '';

        if (submissions.length === 0) {
            submissionsContainer.innerHTML = '<p>Ainda não há contribuições para esta tag. Seja o primeiro a enviar!</p>';
            return;
        }

        // Itera sobre cada contribuição e cria o HTML correspondente
        submissions.forEach(submission => {
            const submissionElement = document.createElement('div');
            submissionElement.className = 'submission-card';

            submissionElement.innerHTML = `
                <div class="submission-content">
                    <h3>O que é?</h3>
                    <p>${sanitize(submission.description)}</p>

                    <h3>Usos Comuns</h3>
                    <p>${sanitize(submission.common_uses)}</p>

                    <h3>Exemplo de Código</h3>
                    <pre><code>${sanitize(submission.code_example)}</code></pre>

                    <div class="submission-meta">
                        <p><strong>Enviado por:</strong> ${sanitize(submission.author_name)}</p>
                        <p><strong>Fontes:</strong> <a href="${sanitize(submission.sources)}" target="_blank" rel="noopener noreferrer">${sanitize(submission.sources)}</a></p>
                    </div>
                </div>
            `;
            submissionsContainer.appendChild(submissionElement);
        });

    } catch (error) {
        console.error('Erro ao buscar as contribuições:', error);
        submissionsContainer.innerHTML = '<p class="error-message">Não foi possível carregar as informações. Verifique se o servidor backend (server.js) está rodando corretamente.</p>';
    }
}

// Executa a função quando o conteúdo da página é carregado
document.addEventListener('DOMContentLoaded', fetchAndRenderSubmissions);
