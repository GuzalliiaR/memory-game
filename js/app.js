import { createElement } from './helpers.js';
import { GameController } from './game.js';
import { getLeaderboardLS } from './storage.js';
import { openModal } from './modal.js';


// Сборка элементов управления (header)
const headerTitle = createElement(
    'h1',
    { className: 'header_title' },
    "Memory Game"
);
const newGameBtn = createElement(
    'button',
    { type: 'button', className: 'header_btn', onClick: () => handleNewGame() },
    'Новая игра'
);
const leaderboardBtn = createElement(
    'button',
    { type: 'button', className: 'header_btn', onClick: () => openLeaderboard() },
    'Таблица лидеров'
);
const header = createElement(
    'header',
    { className: 'header' },
    headerTitle,
    createElement('div', { className: 'header__actions' }, newGameBtn, leaderboardBtn)
);


// Счетчики
const movesCounter = createElement('span', { className: 'counter__value' });
const pairsCounter = createElement('span', { className: 'counter__value' });
const counter = createElement('section', { className: 'counter' }, movesCounter, pairsCounter);


// Игровое поле
const gameBoard = createElement('main', { className: 'game-board grid-container'});


// Перенос интерфейса в body
document.body.appendChild(header);
document.body.appendChild(counter);
document.body.appendChild(gameBoard);


// Инициализация игрового контроллера
const game = new GameController({
    gameBoard,
    movesCounter,
    pairsCounter
})


// Автоматический запуск игры после загрузки и перезагрузки страницы
game.startNewGame();


// Функция ручного запуска новой игры
function handleNewGame() {
    game.startNewGame();
};

//Функция открытия модального окна лидеров Топ10
function openLeaderboard() {
    console.log('таблица лидеров')
}
