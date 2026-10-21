/* Modale de détail réutilisable pour les .rd-card. */
(() => {
  'use strict';

  const modal = document.querySelector('#rd-modal');
  if (!modal) return;

  const closeButton = modal.querySelector('.rd-modal__close');
  const image = modal.querySelector('[data-rd-modal-image]');
  const placeholder = modal.querySelector('[data-rd-modal-placeholder]');
  const previousFocus = { element: null };
  let lastFocusedCard = null;

  const fields = {
    kicker: modal.querySelector('[data-rd-modal-kicker]'),
    number: modal.querySelector('[data-rd-modal-number]'),
    status: modal.querySelector('[data-rd-modal-status]'),
    title: modal.querySelector('[data-rd-modal-title]'),
    description: modal.querySelector('[data-rd-modal-description]'),
    tags: modal.querySelector('[data-rd-modal-tags]'),
    notes: modal.querySelector('[data-rd-modal-notes]'),
  };

  function setText(element, value) {
    element.textContent = value || '';
  }

  function openModal(card) {
    lastFocusedCard = card.querySelector('[data-rd-detail]');
    previousFocus.element = document.activeElement;

    const title = card.querySelector('h2');
    const description = card.querySelector('p:not(.rd-modal p)');
    const kicker = card.querySelector('.kicker');
    const number = card.querySelector('.rd-number');
    const status = card.querySelector('.rd-status');
    const visual = card.querySelector('.rd-card__visual');

    setText(fields.kicker, kicker?.textContent.trim());
    setText(fields.number, number?.textContent.trim());
    setText(fields.status, status?.textContent.trim());
    setText(fields.title, title?.textContent.trim());
    setText(fields.description, description?.textContent.trim());
    fields.tags.replaceChildren(...Array.from(card.querySelectorAll('.tag')).map((tag) => {
      const clone = tag.cloneNode(true);
      return clone;
    }));
    setText(fields.notes, `Détail de ${card.dataset.cardId || 'la piste'} · contenu à personnaliser.`);

    const imagePath = card.dataset.modalImage;
    const imageAlt = card.dataset.modalImageAlt || title?.textContent.trim() || 'Visuel du prototype';
    image.alt = imageAlt;
    image.hidden = true;
    placeholder.hidden = false;
    // A visual can be supplied per card through data-modal-image. Failed/missing assets
    // intentionally fall back to the explicit replacement placeholder.
    if (imagePath) {
      image.onload = () => { image.hidden = false; placeholder.hidden = true; };
      image.onerror = () => { image.hidden = true; placeholder.hidden = false; };
      image.src = imagePath;
    }
    if (!imagePath && visual) {
      placeholder.textContent = 'VISUEL CSS / CAPTURE\nÀ REMPLACER';
    }

    modal.hidden = false;
    document.body.classList.add('rd-modal-open');
    closeButton.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('rd-modal-open');
    image.removeAttribute('src');
    (lastFocusedCard || previousFocus.element)?.focus?.();
  }

  document.addEventListener('click', (event) => {
    const detailButton = event.target.closest('[data-rd-detail]');
    if (detailButton) {
      openModal(detailButton.closest('.rd-card'));
      return;
    }
    if (event.target.closest('[data-rd-modal-close]')) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
