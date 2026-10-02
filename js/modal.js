import { createElement } from './helpers.js';

export function createModal(title, content) {
    const titleModal = createElement('h2', { className: 'modal__title' }, title);
    const btnClose = createElement('button', { className: 'modal__closeBtn' }, 'Закрыть');
    const containerModal = createElement('div', { className: 'modal__container' },
        titleModal,
        content,
        btnClose
    );

    const dialog = createElement('dialog', {}, containerModal);
    document.body.appendChild(dialog);

    btnClose.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) { dialog.close() };
    });

    dialog.addEventListener('close', () => dialog.remove());

    dialog.showModal();
    return dialog;
}