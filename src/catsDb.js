
// class 'CatRepository' serves as a template for creating new cat objects with props & methods

const { splice } = require("./breedsDb");

class CatRepository {
    constructor() {
        this.cats = [ // array of objects - if object, change to >> this.cats:{ 1:{}, 2:{}, 3:{}}
            {
                id: 1,
                name: "Catty",
                sex: "F",
                coat: "medium hair",
                description: "buff or tan, skinny, talkative, often found in tall grasses or deep in the bush",
                breedId: 1
            },
            {
                id: 2,
                name: "Frank",
                sex: "M",
                coat: "medium hair",
                description: "orange, heavy-set, non-responsive except to neck scratches",
                breedId: 1
            },
            {
                id: 3,
                name: "Pancake",
                sex: "M",
                coat: "shorthair",
                description: "brown, heavy-set, spent life behind bars",
                breedId: 1
            },
            {
                id: 4,
                name: "Madame Floof",
                sex: "F",
                coat: "long hair",
                description: "white dark patches on legs, kerbside, fluffy dustbuster tail",
                breedId: 2
            },
        ]
    }
    get getAllCats() {
        return this.cats // returns [{},{},{}]
        }

    set addCat (object) {
        let arrayToUpdate = this.getAllCats;
        arrayToUpdate.push(object); 
        this.cats = arrayToUpdate; 
    }

    set updateCats(updatedArray) { 
        this.cats = updatedArray; 
    }

    getCatByIndex (index) {
        console.log(`retrieving cat at id: ${index}`);
        return this.cats[index];    // returns {} 
        }

    deleteCatByIndex (index) {
        let catsCopy = this.getAllCats;
        catsCopy.splice(index, 1);
        this.updateCats = catsCopy; 
    }
}

module.exports = new CatRepository();

