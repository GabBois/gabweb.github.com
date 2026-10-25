(() => {
  'use strict';

  const modal = document.querySelector('#rd-modal');
  if (!modal) return;

  const closeButton = modal.querySelector('.rd-modal__close');
  const documentContent = modal.querySelector('[data-rd-modal-document]');
  const numberField = modal.querySelector('[data-rd-modal-number]');
  const statusField = modal.querySelector('[data-rd-modal-status]');
  const idField = modal.querySelector('[data-rd-modal-id]');

  let lastTrigger = null;

  function openModal(card, trigger) {
    const template = card.querySelector('template[data-rd-document]');
    if (!template) {
      console.warn('Aucun template data-rd-document dans cette carte.');
      return;
    }

    lastTrigger = trigger;
    const number = card.querySelector('.rd-number');
    const status = card.querySelector('.rd-status');
    const title = template.content.querySelector('h2');

    numberField.textContent = number?.textContent.trim() || '';
    statusField.textContent = status?.textContent.trim() || '';
    idField.textContent = card.dataset.cardId || '';

    documentContent.replaceChildren(template.content.cloneNode(true));

    if (title) {
      title.id = 'rd-modal-title';
      modal.setAttribute('aria-labelledby', title.id);
    }

    modal.hidden = false;
    document.body.classList.add('rd-modal-open');
    closeButton.focus();
  }

  function closeModal() {
    if (modal.hidden) return;

    modal.hidden = true;
    document.body.classList.remove('rd-modal-open');
    documentContent.replaceChildren();
    lastTrigger?.focus();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-rd-detail]');

    if (trigger) {
      openModal(trigger.closest('.rd-card'), trigger);
      return;
    }

    if (event.target.closest('[data-rd-modal-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = modal.querySelectorAll(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();