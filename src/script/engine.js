const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playersSide: {
        player: "player-cards",
        playerBox: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel")
    }
}

const pathImg = "../src/assets/icons/"
const pathAudio = "../src/assets/audios/"
const bgm = document.getElementById("bgm")

const cardData = [
    {
        id: 0,
        name: "Blue Eyes Write Dragon",
        type: "Paper",
        img: `${pathImg}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImg}magician.png`,
        winOf: [1],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImg}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImg}card-back.png`);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playersSide.player) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        })

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })
    }


    return cardImage
}

async function setCardsField(cardId) {
    await removeAllCardsImgs();

    let computerCardId = await getRandomCardId();

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await ShowHiddenCardFieldImg(true);

    await hiddenDetails();

    await drawCardsField(cardId, computerCardId);

    await updateScore();

    await drawButton(duelResults);
}

async function hiddenDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Selecione";
    state.cardSprites.type.innerText = "Uma Carta";
}

async function drawCardsField(cardId, computerCardId ) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function ShowHiddenCardFieldImg(value) {
    if(value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else {
        state.fieldCards.player.style.display = "none"
        state.fieldCards.computer.style.display = "none"
    }

}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase()
    state.actions.button.style.display = "block"
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw"
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "Win";
        state.score.playerScore++;
    } else if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Lose";        
        state.score.computerScore++;
    }

    await playAudio(duelResults)


    return duelResults

}

async function removeAllCardsImgs() {
    let { playerBox, computerBox } = state.playersSide;
    let imgElements = playerBox.querySelectorAll("img")
    
    imgElements.forEach((img) => img.remove());

    imgElements = computerBox.querySelectorAll("img");

    imgElements.forEach((img) => img.remove());

}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = ""

    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    init();
}

async function playAudio(status) {
    const audio = new Audio(`${pathAudio}${status}.wav`)
    try {
        audio.play();
    } catch (error) {
        // criar o tratamento do erro do para o audio draw
    }   
}

function init() {
    ShowHiddenCardFieldImg(false)

    drawCards(5, state.playersSide.player)
    drawCards(5, state.playersSide.computer)

    bgm.play()
}

init();