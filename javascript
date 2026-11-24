const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxMOT2ostpamrPudcFp4hES1ylnzp7e2URVfvnHPwiHUh58Qrn0xAYqlJPrNPJ6TjxU/exec';

// Atualiza o ano no rodapé
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Preenche automaticamente o select ao clicar nos cards ("Voluntário", "Subsíndico", "Ideia")
document.querySelectorAll('[data-choice]').forEach((link) => {
  link.addEventListener('click', () => {
    const choice = link.getAttribute('data-choice');
    const selectTipo = document.getElementById('tipo');
    if (!selectTipo) return;

    if (choice === 'voluntario') selectTipo.value = 'Voluntário(a)';
    if (choice === 'candidato') selectTipo.value = 'Interesse em candidatura a subsíndico(a)';
    if (choice === 'ideia') selectTipo.value = 'Sugestão ou ideia';
  });
});

// Envio do formulário para o Google Sheets
const form = document.getElementById('participation-form');
const feedback = document.getElementById('form-feedback');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Valida se pelo menos uma área foi marcada
    const areasMarcadas = Array.from(form.querySelectorAll('input[name="areas"]:checked'))
      .map((cb) => cb.value);

    if (areasMarcadas.length === 0) {
      feedback.textContent = 'Por favor, selecione ao menos uma área de interesse.';
      feedback.style.color = '#c0392b';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const textoOriginalBtn = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    feedback.textContent = '';

    const payload = {
      nome: form.nome.value.trim(),
      torre: form.torre.value.trim(),
      apartamento: form.apartamento.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      tipo: form.tipo.value,
      areas: areasMarcadas.join(', '),
      disponibilidade: form.disponibilidade.value,
      mensagem: form.mensagem.value.trim()
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      feedback.textContent = 'Participação enviada com sucesso! Obrigado por contribuir com o Jardim do Ypê.';
      feedback.style.color = '#1e7e34';
      form.reset();
    } catch (error) {
      feedback.textContent = 'Erro ao enviar os dados. Verifique sua conexão e tente novamente.';
      feedback.style.color = '#c0392b';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = textoOriginalBtn;
    }
  });
}
