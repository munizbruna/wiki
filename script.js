// Aguarda o conteúdo da página ser totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o formulário pela sua ID
    const form = document.getElementById('form-pesquisa');

    // Verifica se o formulário existe na página atual para evitar erros
    if (form) {
        // Define o código secreto da turma. 
        // IMPORTANTE: Este código fica visível no front-end. 
        // É uma barreira simples, não uma segurança robusta.
        const codigoCorreto = 'HTMLPROJETO2025';

        // Adiciona um "ouvinte" para o evento de "submit" (envio) do formulário
        form.addEventListener('submit', (event) => {
            
            // Pega o valor digitado no campo de código
            const codigoDigitado = document.getElementById('codigo').value;

            // Compara o código digitado com o código correto
            if (codigoDigitado !== codigoCorreto) {
                // Se estiver incorreto, mostra um alerta para o usuário
                alert('O Código da Turma está incorreto. Por favor, verifique e tente novamente.');
                
                // Impede que o formulário seja enviado para o Formspree
                event.preventDefault(); 
            }
            // Se o código estiver correto, o script não faz nada e o formulário é enviado normalmente.
        });
    }
});
