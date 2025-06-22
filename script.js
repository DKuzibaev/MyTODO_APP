const cartRow = document.querySelector('.row');
const modal = document.querySelector('.modal');
const modalBackdrop = document.querySelector('.modal-backdrop');
const progressValue = document.querySelector('.progress-value');
const button = document.querySelector('.btn');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');

function setupCardEventListeners(card) {
  card.addEventListener('click', () => {
    const titleText = card.querySelector('h3').textContent;
    const descText = card.dataset.description || 'Описание отсутствует';

    modal.querySelector('h2').textContent = titleText;
    modal.querySelector('p').textContent = descText;

    const doneCheckbox = document.getElementById('done');
    doneCheckbox.checked = card.classList.contains('done');

    modal.classList.add('open');

    doneCheckbox.onchange = () => {
      if (doneCheckbox.checked) {
        card.classList.add('done');
        card.classList.remove('not-done');
      } else {
        card.classList.remove('done');
        card.classList.add('not-done');
      }
      updateProgress();
    };
  });
}

function updateProgress() {
  const allCards = document.querySelectorAll('.row .card');
  const doneCards = document.querySelectorAll('.row .card.done');

  if (allCards.length === 0) {
    progressValue.style.width = '0%';
    progressValue.style.backgroundColor = 'var(--red)';
    return;
  }

  const percent = (doneCards.length / allCards.length) * 100;
  progressValue.style.width = percent + '%';

  if (doneCards.length === 0) {
    progressValue.style.backgroundColor = 'var(--red)';
  } else {
    progressValue.style.backgroundColor = 'var(--green)';
  }
}

button.addEventListener('click', (e) => {
  e.preventDefault();

  const cartTitle = titleInput.value.trim();
  const cartDescription = descriptionInput.value.trim();

  if (!cartTitle) {
    alert('Введите заголовок!');
    return;
  }

  const card = document.createElement('div');
  card.className = 'card not-done';
  card.dataset.description = cartDescription || 'Описание отсутствует';
  card.innerHTML = `<h3>${cartTitle}</h3>`;

  cartRow.appendChild(card);
  setupCardEventListeners(card);

  titleInput.value = '';
  descriptionInput.value = '';

  updateProgress();
});

// Закрываем модалку при клике на backdrop
modalBackdrop.addEventListener('click', () => {
  modal.classList.remove('open');
});

// Закрываем модалку при нажатии Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    modal.classList.remove('open');
  }
});

updateProgress();
