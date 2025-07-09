document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const timeDisplay = document.getElementById('time');
    const matchesDisplay = document.getElementById('matches');
    const messageDisplay = document.getElementById('message');
    const restartBtn = document.getElementById('restartBtn');
    
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = [...emojis, ...emojis];
    let flippedCards = [];
    let matchedCards = [];
    let timeLeft = 60;
    let timer;
    let gameActive = true;
    
    // Shuffle cards
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }
    
    // Create card elements
    function createCards() {
        gameBoard.innerHTML = '';
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = emoji;
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            gameBoard.appendChild(card);
        });
    }
    
    // Flip card
    function flipCard(card) {
        if (!gameActive || flippedCards.length >= 2 || card.classList.contains('flipped') || matchedCards.includes(card.dataset.index)) {
            return;
        }
        
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
    
    // Check for match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const index1 = card1.dataset.index;
        const index2 = card2.dataset.index;
        
        if (cards[index1] === cards[index2]) {
            // Match found
            matchedCards.push(index1, index2);
            matchesDisplay.textContent = matchedCards.length / 2;
            flippedCards = [];
            
            // Check for win
            if (matchedCards.length === cards.length) {
                gameActive = false;
                clearInterval(timer);
                messageDisplay.textContent = 'You Win! 🎉';
            }
        } else {
            // No match
            gameActive = false;
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                gameActive = true;
            }, 1000);
        }
    }
    
    // Start timer
    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                gameActive = false;
                messageDisplay.textContent = 'Time\'s Up! 😢';
                // Flip all unmatched cards
                document.querySelectorAll('.card:not(.flipped)').forEach(card => {
                    if (!matchedCards.includes(card.dataset.index)) {
                        card.classList.add('flipped');
                    }
                });
            }
        }, 1000);
    }
    
    // Reset game
    function resetGame() {
        flippedCards = [];
        matchedCards = [];
        timeLeft = 60;
        gameActive = true;
        timeDisplay.textContent = timeLeft;
        matchesDisplay.textContent = '0';
        messageDisplay.textContent = '';
        clearInterval(timer);
        shuffleCards();
        createCards();
        startTimer();
    }
    
    // Event listeners
    gameBoard.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
            flipCard(card);
        }
    });
    
    restartBtn.addEventListener('click', resetGame);
    
    // Initialize game
    resetGame();
});