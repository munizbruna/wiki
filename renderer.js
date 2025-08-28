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
        pageTitle.textContent = `${formattedTagName} - Guia de Tags HTML5`;

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
            // ALTERAÇÃO: O nome da coluna foi ajustado para "tag" (minúsculo) para corresponder ao seu CSV.
            const tagContributions = data.filter(row => row.tag && row.tag.trim() === formattedTagName);

            if (tagContributions.length === 0) {
                displayError(`<p>Nenhuma contribuição encontrada para a tag ${tagName}.</p> <p><strong> Seja o primeiro a enviar!</strong></p>`);
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
    // ALTERAÇÃO: Esta função foi melhorada para lidar com colunas vazias no cabeçalho do CSV.
    function parseCSV(text) {
        const lines = text.split(/\r?\n/);
        const headers = lines[0].split(',');

        // Lida com a coluna vazia no seu CSV, que provavelmente deveria ser a descrição.
        const emptyHeaderIndex = headers.indexOf('');
        if (emptyHeaderIndex !== -1) {
            headers[emptyHeaderIndex] = 'O que é?';
        }

        const result = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue;
            const obj = {};
            const currentline = lines[i].split(',');
            for (let j = 0; j < headers.length; j++) {
                const headerKey = headers[j].trim().replace(/"/g, '');
                obj[headerKey] = currentline[j] ? currentline[j].trim().replace(/"/g, '') : '';
            }
            result.push(obj);
        }
        return result;
    }

    // Função para exibir as contribuições na página
    function renderContributions(contributions) {
        contributionsContainer.innerHTML = ''; // Limpa a mensagem de "carregando"
        contributions.forEach(item => {
            console.log(item)
            const article = document.createElement('article');
            article.className = 'tag-content';
            
            // ALTERAÇÃO GERAL: Os nomes das colunas (ex: 'Usos comuns:') foram atualizados
            // para corresponder exatamente aos cabeçalhos do seu arquivo CSV.
            article.innerHTML = `
                
                <section>
                    <h2>Quando usar?</h2>
                    <article>${escapeHtml(item['Usos comuns:'] || 'Não informado')}</article>
                </section>
                <section>
                    <h2>Exemplo de Código</h2>
                    <pre><code>${escapeHtml(item['Exemplos de uso em código:'] || '')}</code></pre>
                </section>
                <section>
                    <h2>Fontes da Pesquisa</h2>
                    <ul>
                        <li><a href="${item['Fontes de pesquisa (links):'] || '#'}" target="_blank" rel="noopener noreferrer">${item['Fontes de pesquisa (links):'] || 'Não informado'}</a></li>
                    </ul>
                </section>
                <section>
                    <h2>Contribuição de:</h2>
                    <ul>
                    <li class="contributor-name">${item['Pesquisa realizada por:'] || 'Anônimo'}</li>
                    <li class="contributor-name">${item['Nome 2'] || 'Anônimo'}</li>
                </section>
                <section>
                    <p>Atualizado em: ${item['Submitted at'] || ' Sem informação'}</p>
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
