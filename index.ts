import prompt from 'prompt';
import dictionary from './dictionary.json'
import colours from "@colors/colors/safe";


let wordSchema = {
    properties: {
        word: {
            description: 'Please enter the word you put into Wordle',
            pattern: /^[a-zA-Z]{5}$/,
            message: 'Must be 5 letters long',
            required: true
        },
    }
};

const resultSchema = {
    properties: {
        1: {
            description: 'What was the response to the first character?',
            pattern: /^[byg]{1}$/i,
            message: 'Whoospie, has to be a "B", "Y", or a "G"',
            required: true
        },
        2: {
            description: 'And now the second character?',
            pattern: /^[byg]{1}$/i,
            message: 'Whoospie, has to be a "B", "Y", or a "G"',
            required: true
        },
        3: {
            description: 'Third character please',
            pattern: /^[byg]{1}$/i,
            message: 'Whoospie, has to be a "B", "Y", or a "G"',
            required: true
        },
        4: {
            description: '...Fourth?',
            pattern: /^[byg]{1}$/i,
            message: 'Whoospie, has to be a "B", "Y", or a "G"',
            required: true
        },
        5: {
            description: 'Last but certainly not least, the fith',
            pattern: /^[byg]{1}$/i,
            message: 'Whoospie, has to be a "B", "Y", or a "G"',
            required: true
        }
    }
}

let goodLetterQuery: string[] = [];
let almostGoodLetters: {letter: string, index: number}[] = [];
let noNoLetters: string[] = [];

async function solver() {
    console.log(colours.inverse('Oh hi. Welcome to the Wilson Wordle Solver!'));
    prompt.start();

    for (let i = 1; i < 5; i++) {
        wordSchema.properties.word.description = `Please enter the ${i}${getSuffix(i)} word that you entered into Wordle`;
        const {word} = await prompt.get(wordSchema);
        const wordAsArray = word.toString().split('');
        console.log(colours.bold('Thanks, now tell me what you got back\nPlease enter the initial for the colour the square turned.\n (B)lack, (G)reen, or (Y)ellow'));

        const result = await prompt.get(resultSchema);
        const resultAsArray = Object.values(result)
        console.log(`${response()}`)

        resultAsArray.forEach((result, index) => {

            const letter = wordAsArray[index];
            if (result.toString().toUpperCase() == 'B') {
                noNoLetters.push(letter);
            }
            if (result.toString().toUpperCase() == 'G') {
                goodLetterQuery[index] = letter;
            }
            if (result.toString().toUpperCase() == 'Y') {
                almostGoodLetters.push({letter, index});
            }
        })

        let possibleWords = dictionary.filter(word => {

            const greenCheck = goodLetterQuery.every((letter, index) => word.charAt(index) == letter);
            if (!greenCheck) {
                return false
            }

            const blackCheck = !noNoLetters?.some(letter => word.includes(letter));
            if (!blackCheck) {
                return false
            }

            const yellowIncludesCheck = almostGoodLetters?.every((({letter}) => word.includes(letter)));
            if (!yellowIncludesCheck) {
                return false
            }

            const yellowPlacementCheck = !almostGoodLetters?.some(({letter, index}) => word.charAt(index) === letter);
            if (!yellowPlacementCheck) {
                return false
            }
            return true
        })

        if (possibleWords.length > 1) {
            console.log(`You've got a few to choose from:`)
            console.log(possibleWords.toString())
        } else if (possibleWords.length == 1) {
            console.log(colours.bold(colours.rainbow(`Ooooooooh, only one possible answer!`)))
            console.log(colours.bold(possibleWords[0]));
            break;
        } else {
            console.log(colours.bold(colours.red(`Sorry bud, think somethings gone wrong. I can't find any matching words in my list`)));
        }
    }
    console.log(colours.inverse(`Hopefully you got it, see you tomorrow!`))
}

function response(): string {
    const possibleReponses = [
        'Cheers',
        'Sweet, let me look into that',
        'Ta love',
        'Alllllrighty then',
        'Huh, bold choice!',
        'Oooooooh',
        'Thanks, let me just run that through the super duper computer',
        'Errr, okay',
        'Hmmmmmm, let me think',
        'Easy, peasy, lemon, squeezy!',
        '🤔',
    ]
    return possibleReponses[Math.floor(Math.random() * 10)]
}

function getSuffix(num: number): string {
    let suffix;
    switch (num) {
        case 1:
            suffix = 'st'
            break;
        case 2:
            suffix = 'nd'
            break;
        case 3:
            suffix = 'rd'
            break;
        default:
            suffix = 'th'
            break;
    }
    return suffix
}

solver();

