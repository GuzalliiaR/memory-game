import { createElement, clearElement } from './helpers.js';
import { saveResultInLS } from './storage.js';

// 8 уникальных изображений-эмодзи
const cards_unique = [
    { key: 'star', label: 'звезда', symbol: '⭐' },
    { key: 'cake', label: 'торт', symbol: '🍰' },
    { key: 'chicken', label: 'цыпленок', symbol: '🐥' },
    { key: 'avocado', label: 'авокадо', symbol: '🥑' },
    { key: 'cherry', label: 'вишня', symbol: '🍒' },
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
    constructor({ gameBoard, movesCounter, pairsCounter, onVictory }) {
        this.boardContainer = gameBoard;
        this.movesCounter = movesCounter;
        this.pairsCounter = pairsCounter;
        this.onVictory = onVictory;

        this.cards = [];
        this.moves = 0;
        this.foundPairs = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.boardBlocked = false;
        this.timeoutWatchPair = null;
    }

    startNewGame() {
        // Если несовпавшая пара еще открыта, ее таймер принудительно обнуляется
        clearTimeout(this.timeoutWatchPair);
        this.timeoutWatchPair = null;

        this.moves = 0;
        this.foundPairs = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.boardBlocked = false;

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

    handleCardClick(card) {
        if (card.isFlipped || card.isMatched || this.boardBlocked) {
            return;
        }

        // Переворот карточки
        card.domElement.classList.add('is-flipped');
        card.isFlipped = true;

        // Запись первой или второй карточки в ходе
        if (!this.firstCard) {
            this.firstCard = card;
            console.log(this.firstCard);
            return;
        } else {
            this.secondCard = card;
            this.moves += 1;
            console.log(this.secondCard);
        }

        // Сравнение карточек
        if (this.firstCard.key === this.secondCard.key) {
            this.matchSuccess();
        } else {
            this.matchFailure();
        }

        // Обновление счетчиков
        this.movesCounter.textContent = `Ходы: ${this.moves}`;
        this.pairsCounter.textContent = `Пары: ${this.foundPairs} из ${cards_unique.length}`;

        // Очистка текущих ссылок
        this.firstCard = null;
        this.secondCard = null;
    }

    // Сценарий совпадения карточек
    matchSuccess() {
        this.firstCard.isMatched = true;
        this.secondCard.isMatched = true;

        // стилевое выделение совпавшей пары
        this.firstCard.domElement.classList.add('matched');
        this.secondCard.domElement.classList.add('matched');

        this.foundPairs += 1;

        // Сценарий победы
        if (this.foundPairs === (this.cards.length / 2)) {
            // сохранение результата в LS
            saveResultInLS(this.moves);

            // вызов функции модального окна победы
            this.onVictory(this.moves);
        }
    }

    // Сценарий не совпадения карточек
    matchFailure() {
        // блокируем карточки (игровое поле не кликается) пока игрок смотрит на не совпавшие карточки
        this.boardBlocked = true;
        
        // сохранение ссылок в замыкание, чтобы не потерять на очистке this.firstCard и this.secondCard
        const firstCard = this.firstCard;
        const secondCard = this.secondCard;

        this.timeoutWatchPair = setTimeout(() => {
            
            firstCard.domElement.classList.remove('is-flipped');
            firstCard.isFlipped = false;

            secondCard.domElement.classList.remove('is-flipped');
            secondCard.isFlipped = false;

            this.boardBlocked = false;
        }, 1100);
    }
}