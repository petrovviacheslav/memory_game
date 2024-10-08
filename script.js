const emoji = ['😀', '🤖', '😑', '🎩', '🌈', '🐭', '🍹', '🥇', '🎲', '⚰️', '❤️', '⚠️', '🃏', '🏁']
//max = 28

let numberOfCards;
let firstCard = null, secondCard = null;
let lockBoard = false;
let counter = 0;

function startGame() {
    counter = 0;
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);

    if (isOutOfRange(width, 4, 11)) {
        alert("Ширина должна быть от 4 до 11");
        return;
    }

    if (isOutOfRange(height, 3, 6)) {
        alert("Высота должна быть от 3 до 6");
        return;
    }

    setupBoard(width, height);
}

function setupBoard(width, height) {
    const board = document.getElementById('board');
    board.innerHTML = ''
    board.style.gridTemplateColumns = `repeat(${width}, 100px)`;
    board.style.gridTemplateRows = `repeat(${height}, 100px)`;
    board.style.width = `${100 * width + 10 * (width - 1)}px`;

    numberOfCards = width * height;
    const selectedEmojis = shuffleArray(emoji).slice(0, numberOfCards / 2);
    const doubleEmojis = [...selectedEmojis, ...selectedEmojis]

    if (numberOfCards % 2 === 1) doubleEmojis.push('')

    const gameEmojis = shuffleArray(doubleEmojis);

    gameEmojis.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const emojiElement = document.createElement('span');
        emojiElement.textContent = emoji;
        card.appendChild(emojiElement);

        card.addEventListener('click', () => flipCard(card, emojiElement));
        board.appendChild(card);
    })
}

function flipCard(card, emojiElement) {
    if (lockBoard === true || card === firstCard || card.classList.contains('matched')) {
        return;
    }
    card.classList.add("flipped");

    if (firstCard === null) firstCard = card;
    else {
        secondCard = card;
        checkForMatch();
    }
}

function checkForMatch() {
    counter++;
    if (counter === 1) document.getElementById('counter').style.visibility = "visible";
    document.getElementById('counter').innerHTML = `Attempt counter = ${counter}`;

    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        const adjustedTotal = numberOfCards - numberOfCards % 2;
        if (document.querySelectorAll('.card.matched').length === adjustedTotal) {
            setTimeout(() => {
                alert(`Congratulations! You are win! You have spent ${counter} attempts`);
                document.getElementById('counter').style.visibility = "hidden";
            }, 500)
        }
        reset();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            reset();
        }, 1500)
    }
}

function reset() {
    lockBoard = false;
    [firstCard, secondCard] = [null, null]
}


function isOutOfRange(val, min, max) {
    return val < min || val > max;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.getElementById('start-button').addEventListener('click', startGame);