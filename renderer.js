// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÃO ---
    // COLE AQUI A URL DA SUA PLANILHA PUBLICADA COMO CSV
    const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vShxFJJxqLHWxQrx4jWDJccY7QokQ9tdZ1hqGxdMesRyJRXvEIs91iOAlMDV4eR_ePA5uVZHcG_nnY9/pub?output=csv';
    // --------------------

    const contributionsContainer = document.getElementById('contributions-container');
    const tagTitleHeader = document.getElementById('tag-title-header');
    const pageTitle = document.querySelector('title');

    // Função principal que carrega e exibe os dados
    async function loadTagData() {
        // 1. Descobrir qual tag exibir a partir da URL (ex: tag.html?tag=figure)
        const urlParams = new URLSearchParams(window.location.search);
        const tagName = urlParams.get('tag');

        if (!tagName) {
            displayError("Nenhuma tag especificada na URL.");
            return;
        }

        const formattedTagName = `<${tagName}>`;
        tagTitleHeader.textContent = formattedTagName;
        pageTitle.textContent = `Tag ${formattedTagName} - Guia de Tags HTML5`;

        try {
            // 2. Buscar os dados da planilha
            const response = await fetch(GOOGLE_SHEET_URL);
            if (!response.ok) {
                throw new Error('Falha ao buscar dados da planilha.');
            }
            const csvText = await response.text();
            
            // 3. Converter o texto CSV em um formato utilizável (array de objetos)
            const data = parseCSV(csvText);

            // 4. Filtrar os dados para encontrar apenas as contribuições para a tag atual
            // IMPORTANTE: 'Tag' deve ser o nome exato do cabeçalho na sua planilha!
            const tagContributions = data.filter(row => row.Tag && row.Tag.trim() === formattedTagName);

            if (tagContributions.length === 0) {
                displayError(`Nenhuma contribuição encontrada para a tag ${formattedTagName}. Seja o primeiro a enviar!`);
                return;
            }

            // 5. Renderizar (desenhar) as contribuições na tela
            renderContributions(tagContributions);

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            displayError("Não foi possível carregar os dados. Verifique o console para mais detalhes.");
        }
    }

    // Função para converter texto CSV em um array de objetos
    function parseCSV(text) {
        const lines = text.split(/\r?\n/);
        const headers = lines[0].split(',');
        const result = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue;
            const obj = {};
            const currentline = lines[i].split(',');
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j].trim()] = currentline[j] ? currentline[j].trim().replace(/"/g, '') : '';
            }
            result.push(obj);
        }
        return result;
    }

    // Função para exibir as contribuições na página
    function renderContributions(contributions) {
        contributionsContainer.innerHTML = ''; // Limpa a mensagem de "carregando"
        contributions.forEach(item => {
            const article = document.createElement('article');
            article.className = 'tag-content';
            
            // IMPORTANTE: Os nomes aqui ('O que é?', 'Quando usar?', etc.) devem corresponder
            // exatamente aos cabeçalhos da sua planilha!
            article.innerHTML = `
                <section>
                    <h2>O que é?</h2>
                    <p>${item['O que é? (Descrição...)'] || 'Não informado'}</p>
                </section>
                <section>
                    <h2>Quando usar?</h2>
                    <p>${item['Quando usar? (Exemplo de uso prático)'] || 'Não informado'}</p>
                </section>
                <section>
                    <h2>Exemplo de Código</h2>
                    <pre><code>${escapeHtml(item['Exemplo de Código'] || '')}</code></pre>
                </section>
                <section>
                    <h2>Fontes da Pesquisa</h2>
                    <ul>
                        <li><a href="${item['Fontes da Pesquisa (links)'] || '#'}" target="_blank" rel="noopener noreferrer">${item['Fontes da Pesquisa (links)'] || 'Não informado'}</a></li>
                    </ul>
                </section>
                <section>
                    <h2>Contribuição de:</h2>
                    <p class="contributor-name">${item['Seu Nome Completo'] || 'Anônimo'}</p>
                </section>
            `;
            contributionsContainer.appendChild(article);
        });
    }

    // Função para exibir mensagens de erro
    function displayError(message) {
        contributionsContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }
    
    // Função para evitar que o HTML dentro do código seja renderizado
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Inicia todo o processo
    loadTagData();
});
