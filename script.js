document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-pesquisa');
    const messageDiv = document.getElementById('form-message');
    const API_URL = 'https://wiki1dtm-backend.onrender.com';

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const formData = new FormData(form);
            const data = {
                author: formData.get('nome'),
                tag: formData.get('tag'),
                description: formData.get('descricao'),
                uses: formData.get('usos'),
                code: formData.get('codigo'),
                sources: formData.get('fontes')
            };

            // Exibe mensagem de "enviando"
            messageDiv.textContent = 'Enviando sua contribuição...';
            messageDiv.className = 'message';
            messageDiv.style.display = 'block';

            try {
                const response = await fetch(`${API_URL}/api/submissions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    messageDiv.textContent = 'Contribuição enviada com sucesso! Obrigado.';
                    messageDiv.className = 'message success';
                    form.reset(); // Limpa o formulário
                } else {
                    throw new Error(result.error || 'Ocorreu um erro ao enviar.');
                }

            } catch (error) {
                messageDiv.textContent = `Erro: ${error.message}`;
                messageDiv.className = 'message error';
                console.error('Erro no envio do formulário:', error);
            }
        });
    }
});
