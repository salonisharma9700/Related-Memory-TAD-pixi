
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view);

let currentLevel = 0;
const levels = [
    { word: "CAT", missingIndex: 0, options: ['A', 'C', 'D'], audio: 'cat.mp3' },
    { word: "DOG", missingIndex: 0, options: ['B', 'D', 'E'], audio: 'dog.mp3' },
    { word: "HAT", missingIndex: 0, options: ['F', 'H', 'I'], audio: 'hat.mp3' }
];

const letterContainer = new PIXI.Container();
app.stage.addChild(letterContainer);

const letterOffsetY = 100;
const letterSpacingY = 50;

function createLetters(options) {
    options.forEach((letter, index) => {
        const text = new PIXI.Text(letter, { fontSize: 24, fill: 0xffffff });
        text.interactive = true;
        text.buttonMode = true;
        text.on('pointerdown', () => {
            fillLetter(letter);
        });
        text.position.set(100, letterOffsetY + index * letterSpacingY);  
        letterContainer.addChild(text);
    });
}

const wordContainer = new PIXI.Container();
app.stage.addChild(wordContainer);

const wordOffsetX = 400;
const wordOffsetY = 200;

function createNextWord() {
    const { word, missingIndex, options } = levels[currentLevel];
    let wordString = '';
    for (let i = 0; i < word.length; i++) {
        if (i === missingIndex) {
            wordString += '_';
        } else {
            wordString += word[i];
        }
    }
    const currentWordText = new PIXI.Text(wordString, { fontSize: 24, fill: 0xffffff });
    currentWordText.position.set(wordOffsetX, wordOffsetY);
    wordContainer.removeChildren();
    wordContainer.addChild(currentWordText);

    letterContainer.removeChildren();
    createLetters(options);
}

createNextWord();


function fillLetter(letter) {
    const { word, missingIndex, audio } = levels[currentLevel];
    if (word[missingIndex] === letter) {
        const wordText = wordContainer.children[0];
        const updatedWordString = word.substring(0, missingIndex) + letter + word.substring(missingIndex + 1);
        
        const updateWordPromise = new Promise((resolve) => {
            wordText.text = updatedWordString;
            resolve();
        });

        const playAudioPromise = new Promise((resolve) => {
            const audioElement = new Audio(audio);
            audioElement.play();
            audioElement.onended = () => {
                resolve();
            };
        });

        Promise.all([updateWordPromise, playAudioPromise]).then(() => {
            
            currentLevel++;
            if (currentLevel === levels.length) {
               
                const congratsAudio = new Audio('congrats.mp3');
                congratsAudio.play();
                congratsAudio.onended = () => {
                    currentLevel = 0;
                    createNextWord();
                };
            } else {
                createNextWord();
            }
        });
    } else {
        const incorrectAudio = new Audio('incorrect.mp3');
        incorrectAudio.play();
    }
}
