// DOM Elements
const elements = {
  cartRow: document.querySelector('.row'),
  modal: document.querySelector('.modal'),
  modalBackdrop: document.querySelector('.modal-backdrop'),
  progressValue: document.querySelector('.progress-value'),
  button: document.querySelector('.btn'),
  titleInput: document.getElementById('title'),
  descriptionInput: document.getElementById('description'),
  doneCheckbox: document.getElementById('done'),
};

// State Management
const state = {
  save() {
    const cards = Array.from(elements.cartRow.querySelectorAll('.card')).map(
      (card) => ({
        title: card.querySelector('h3').textContent,
        description: card.dataset.description,
        isDone: card.classList.contains('done'),
      })
    );
    sessionStorage.setItem('cardsState', JSON.stringify(cards));
  },

  load() {
    const savedState = sessionStorage.getItem('cardsState');
    if (savedState) {
      const cards = JSON.parse(savedState);
      cards.forEach((cardData) => this.createCard(cardData));
      this.updateProgress();
    }
  },

  createCard({ title, description, isDone }) {
    const card = document.createElement('div');
    card.className = isDone ? 'card done' : 'card not-done';
    card.dataset.description = description || 'Описание отсутствует';
    card.innerHTML = `<h3>${title}</h3>`;
    elements.cartRow.appendChild(card);
    this.setupCardEventListeners(card);
  },
};

// Card Functions
const cardManager = {
  setupCardEventListeners(card) {
    card.addEventListener('click', () => {
      const titleText = card.querySelector('h3').textContent;
      const descText = card.dataset.description;

      elements.modal.querySelector('h2').textContent = titleText;
      elements.modal.querySelector('p').textContent = descText;
      elements.doneCheckbox.checked = card.classList.contains('done');
      elements.modal.classList.add('open');

      elements.doneCheckbox.onchange = () => {
        card.classList.toggle('done', elements.doneCheckbox.checked);
        card.classList.toggle('not-done', !elements.doneCheckbox.checked);
        state.updateProgress();
      };
    });
  },
};

// Progress Functions
const progressManager = {
  update() {
    const allCards = elements.cartRow.querySelectorAll('.card');
    const doneCards = elements.cartRow.querySelectorAll('.card.done');
    const percent = allCards.length
      ? (doneCards.length / allCards.length) * 100
      : 0;

    elements.progressValue.style.width = `${percent}%`;
    elements.progressValue.style.backgroundColor = doneCards.length
      ? 'var(--green)'
      : 'var(--red)';

    state.save();
  },
};

// Modal Functions
const modalManager = {
  init() {
    elements.modalBackdrop.addEventListener('click', this.close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.modal.classList.contains('open')) {
        this.close();
      }
    });
  },

  close() {
    elements.modal.classList.remove('open');
  },
};

// Form Handler
const formHandler = {
  init() {
    elements.button.addEventListener('click', this.handleSubmit);
  },

  handleSubmit(e) {
    e.preventDefault();
    const title = elements.titleInput.value.trim();
    const description = elements.descriptionInput.value.trim();

    if (!title) {
      alert('Введите заголовок!');
      return;
    }

    state.createCard({
      title,
      description,
      isDone: false,
    });

    elements.titleInput.value = '';
    elements.descriptionInput.value = '';
    progressManager.update();
  },
};

// Initialize App
Object.assign(state, {
  setupCardEventListeners: cardManager.setupCardEventListeners,
  updateProgress: progressManager.update,
});

modalManager.init();
formHandler.init();
state.load();
