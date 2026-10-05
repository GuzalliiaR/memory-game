import { createElement } from './helpers.js';

export function openModal(title, content) {
    // Наполнение модального окна
    const titleModal = createElement('h2', { className: 'modal__title' }, title);
    const btnClose = createElement('button', { className: 'modal__Btn', 'type': 'button' }, 'Закрыть');
    const containerModal = createElement('div', { className: 'modal__container' },
        titleModal,
        content,
        btnClose
    );

    const dialog = createElement(
        'dialog',
        { 'aria-label': title.replace(/[^\p{L}\p{N}\s\p{P}]/gu, '').trim() },
        containerModal
    );
    document.body.appendChild(dialog);


    // Закрытие кликом по кнопке или затемненному фону
    btnClose.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) { dialog.close() };
    });

    // Удаление закрытого dialog из разметки
    dialog.addEventListener('close', () => {
        // Таймер для проигрывания анимации закрытия
        setTimeout(() => dialog.remove(), 400);
    });

    dialog.showModal();
    return dialog;
}