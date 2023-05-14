namespace SpriteKind {
    export const _ANIMAL_INTERNAL_SPRITE_KIND = SpriteKind.create()
}
// Call "set mini game win state" when the player wins the game! This code is just here as an example, feel free to delete it!
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    GameJam.setSuccess(true)
})

    let ANIMALS: AnimalInternal[]
    let animalMap: { [key: string]: AnimalInternal } = {}

    let animalsOnStage: AnimalInternal[] = []
    let correctAnswer :string[]= []
    
    class AnimalInternal {

        public sprite: Sprite
        public spriteImage: Image
        public name: string
        public feet: number
        public wings: boolean
        public warmBlood: boolean

        public constructor(spriteImage: Image, name: string, feet: number, wings: boolean, warmBlood: boolean) {
            this.spriteImage = spriteImage;
            this.name = name;
            this.feet = feet;
            this.wings = wings;
            this.warmBlood = warmBlood;
        }

        public _init() {
            this.sprite = sprites.create(this.spriteImage, SpriteKind._ANIMAL_INTERNAL_SPRITE_KIND)
            if (this.name == 'Fish') {
                this.sprite.x = 112
                this.sprite.y = 92
            } else {
                tiles.placeOnRandomTile(this.sprite, sprites.castle.tileGrass1)
            }
        }

    }

    function randomFilterKeywords(): AnimalInternal {
        let keyword = new AnimalInternal(null, null, randint(0, 2) * 2, Math.percentChance(50), Math.percentChance(50))
        
        let keptField = randint(0, 2)
        if (keptField == 0) {
            keyword.wings = null
            keyword.warmBlood = null
        } else if (keptField == 1) {
            keyword.feet = null
            keyword.warmBlood = null
        } else {
            keyword.feet = null
            keyword.wings = null
        }
    

        return keyword
    }

    function describeKeyword(keyword: AnimalInternal): string {
        let result = ""
        if (keyword.feet != null) {
            result += keyword.feet + " FEET(S)"
        }
        if (keyword.wings != null) {
            result += (keyword.wings ? "HAS WINGS" : "NO WINGS")
        }

        if (keyword.warmBlood != null) {
            result += (keyword.warmBlood ? "WARM" : "COLD") + " BLOOD"
        }
        return result
    }


     function init() {
        tiles.setTilemap(assets.tilemap`default`)
        ANIMALS = [
            new AnimalInternal(assets.image`cat`, "Cat", 4, false, true),
            new AnimalInternal(assets.image`dog`, "Dog", 4, false, true),
            new AnimalInternal(assets.image`pigeon`, "Pigeon", 2, true, true),
            new AnimalInternal(assets.image`snake`, "Snake", 0, false, false),
            new AnimalInternal(assets.image`snail`, "Snail", 0, false, false),
            new AnimalInternal(assets.image`fish`, "Fish", 0, false, false),
            new AnimalInternal(assets.image`monkey`, "Monkey", 2, false, true),
            new AnimalInternal(assets.image`duck`, "Duck", 2, true, true),
        ]
        let numberOfAnimals = randint(6, 8)
        for (let i = 0; i < numberOfAnimals; i++) {
            let presentAnimal = ANIMALS.removeAt(randint(0, ANIMALS.length - 1))
            presentAnimal._init()
            animalMap[presentAnimal.name] = presentAnimal
            animalsOnStage.push(presentAnimal)
        }

        sprites.onOverlap(SpriteKind._ANIMAL_INTERNAL_SPRITE_KIND, SpriteKind._ANIMAL_INTERNAL_SPRITE_KIND, (sprite: Sprite, otherSprite: Sprite) => {
            otherSprite.x = randint(10, 150)
            otherSprite.y = randint(10, 110)
        })
        let keyword2 = randomFilterKeywords()
        
        
        for (let animal of animalsOnStage) {
            if (keyword2.feet != null && animal.feet != keyword2.feet) {
                continue
            }
            if (keyword2.wings != null && animal.wings != keyword2.wings) {
                continue
            }
            if (keyword2.warmBlood != null && animal.warmBlood != keyword2.warmBlood) {
                continue
            }
            correctAnswer.push(animal.name)
        }

        return describeKeyword(keyword2)
    }

     function checkAnswer(answer:string) {

        for (let a of correctAnswer) {
            if (a == answer) {
                return true
            }
        }

        return false

    }

GameJam.start(init())

function updateCursorPosition() {
    let animalSprite = animalsOnStage[currentIndex].sprite
    cursor.setPosition(animalSprite.x, animalSprite.y - 16)
}


let cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
let currentIndex = 0
let canMove = true

updateCursorPosition()
controller.left.onEvent(ControllerButtonEvent.Pressed, ()=>{
    if (!canMove) {
        return
    }
    currentIndex = (currentIndex + animalsOnStage.length ) - 1;
    
    currentIndex = currentIndex % animalsOnStage.length;
    updateCursorPosition()
})
controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
    if (!canMove) {
        return
    }
    currentIndex++;
    currentIndex = currentIndex % animalsOnStage.length;
    updateCursorPosition()
})

let answer :string []= []
controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
    canMove = false
    if (checkAnswer(animalsOnStage[currentIndex].name)) {
        GameJam.setSuccess(true)
    } else {
        GameJam.setSuccess(false)
    }
})
// while (GameJam.millisRemaining() == NaN) {
//     pause(10)
// }
// // pauseUntil(()=>GameJam.millisRemaining() != NaN)
// while (GameJam.millisRemaining() > 20) {
//     pause(10)
// }
// if (checkAnswer(animalsOnStage[currentIndex].name)) {
//     GameJam.setSuccess(true)
// }

