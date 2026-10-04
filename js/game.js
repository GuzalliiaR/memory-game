import { createElement, clearElement } from './helpers.js';

// 8 уникальных изображений-эмодзи
const cards_unique = [
    { key: 'star', label: 'звезда', symbol: '⭐' },
    { key: 'cake', label: 'торт', symbol: '🍰' },
    { key: 'chicken', label: 'цыпленок', symbol: '🐥' },
    { key: 'avocado', label: 'авокадо', symbol: '🥑' },
    { key: 'coffee', label: 'кофе', symbol: '☕' },
    { key: 'croissant', label: 'круасан', symbol: '🥐' },
    { key: 'heart', label: 'сердце', symbol: '💙' },
    { key: 'grapes', label: 'виноград', symbol: '🍇' }
];

// Алгоритм тасования Фишера — Йетса. Принимает массив, возвращает новый перемешанный массив.
export function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export class GameController {
    constructor({ gameBoard, movesCounter, pairsCounter }) {
        this.boardContainer = gameBoard;
        this.movesCounter = movesCounter;
        this.pairsCounter = pairsCounter;

        this.cards = [];
        this.moves = 0;
        this.foundPairs = 0;
    }

    startNewGame() {
        this.moves = 0;
        this.foundPairs = 0;
        this.movesCounter.textContent = `Ходы: ${this.moves}`;
        this.pairsCounter.textContent = `Пары: ${this.foundPairs} из ${cards_unique.length}`;

        // генерируем 16 карточек (rawDeck - необработанная колода)
        const rawDeck = [...cards_unique, ...cards_unique].map((card, index) => ({
            id: index,
            ...card
        }));

        // перемешиваем колоду
        const shuffleDeck = shuffle(rawDeck);
        this.cards = shuffleDeck.map(card => ({
            ...card,
            isFlipped: false,
            isMatched: false,
            domElement: null,  // ссылка на DOM-элемент заполняется в renderBoard()
        }));

        // отриcовка игрового поля
        this.renderBoard();
    }

    renderBoard() {
        clearElement(this.boardContainer);

        this.cards.forEach(cardState => {
            // Рубашка карточки (одинаковая для всех карточек, со знаком "?")
            const cardFront = createElement(
                'div',
                { className: "card__face card__face--front" },
                createElement('span', { className: "card-unknown", 'aria-hidden': 'true' }, '?')
            );

            // Лицевая сторона: изображение эмодзи
            const cardBack = createElement(
                'div',
                { className: "card__face card__face--back" },
                createElement('span', { className: "card-icon", 'aria-label': cardState.label }, cardState.symbol)
            );

            // Оболочка карточки для обеспечения оборота карточки
            const cardInner = createElement(
                'div',
                { className: "card__inner" },
                cardFront,
                cardBack
            );

            // Кнопка, содержащая карточку, для доступности
            const cardBtn = createElement(
                'button',
                {
                    type: 'button',
                    className: "card",
                    id: cardState.id,
                    'aria-label': `Карточка ${cardState.id + 1}`,
                    onClick: () => this.handleCardClick(cardState)
                },
                cardInner
            );

            cardState.domElement = cardBtn;
            this.boardContainer.appendChild(cardBtn);
        })
    }

    handleCardClick(cardState) {
        console.log(`Клик по карточке ${cardState.domElement}`)
    }
}