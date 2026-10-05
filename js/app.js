import { createElement } from './helpers.js';
import { GameController } from './game.js';
import { getLeaderboardLS } from './storage.js';
import { openModal } from './modal.js';


// ---- Сборка элементов управления (header) -----------------------------------------
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


// ---- Счетчики -----------------------------------------------------------------------
const movesCounter = createElement('span', { className: 'counter__value' });
const pairsCounter = createElement('span', { className: 'counter__value' });
const counter = createElement('section', { className: 'counter' }, movesCounter, pairsCounter);


// ---- Игровое поле -------------------------------------------------------------------
const gameBoard = createElement('main', { className: 'game-board grid-container'});


// ---- Перенос интерфейса в body ------------------------------------------------------
document.body.appendChild(header);
document.body.appendChild(counter);
document.body.appendChild(gameBoard);


//---- Инициализация игрового контроллера ----------------------------------------------
const game = new GameController({
    gameBoard,
    movesCounter,
    pairsCounter,
    // onVictory: (move) => openVictoryModal(move)
    onVictory: openVictoryModal
});


// ---- Автоматический запуск игры после загрузки и перезагрузки страницы ---------------
game.startNewGame();


// ---- Обработчики интерфейса ---------------------------------------------

// Функция ручного запуска новой игры
function handleNewGame() {
    game.startNewGame();
};

// Функция открытия окна "Победа!"
function openVictoryModal(move) {
    const message = createElement(
        'p',
        { className: 'modal__text' },
        `Количество сделанных ходов: ${move}`
    );
    const newGameBtn = createElement(
        'button',
        { className: 'modal__Btn', onClick: () => startNewGame() },
        'Новая игра'
    );
    const contentVictoryModal = createElement(
        'div',
        { className: 'modal__content' },
        message,
        newGameBtn
    );

    const victoryModal = openModal("🏆 Победа! 🎉", contentVictoryModal);
    
    function startNewGame() {
        game.startNewGame();
        victoryModal.close();
    };
}

// Функция открытия модального окна лидеров Топ10
function openLeaderboard() {
    const contentLeaderboard = buildLeaderboardContent();
    openModal("🏅 Таблица лидеров 🏅", contentLeaderboard);
}

function buildLeaderboardContent() {
    const leaderboard = getLeaderboardLS();

    if (leaderboard.length === 0) {
        return createElement('p', { className: 'modal__text' }, "Резульатов пока нет");
    }

    const th_name = ["Место", "Число ходов", "Дата"];
    const th = th_name.map(text => {
        return createElement('th', { className: 'modal__table-headText' }, text);
    });

    const tr_inTbody = leaderboard.map((row, i) => {
        return createElement(
            'tr',
            {},
            createElement('td', { className: 'modal__table-text' }, i + 1),
            createElement('td', { className: 'modal__table-text' }, row.moves),
            createElement('td', { className: 'modal__table-text' }, row.date)
        )
    });

    const table = createElement(
        'table',
        { className: 'modal__table' },
        createElement('thead', { className: 'modal__table-head' }, createElement('tr', {}, ...th)),
        createElement('tbody', { className: 'modal__table-body' }, ...tr_inTbody)
    );

    return createElement('div', { className: 'modal__content' }, table);
}
