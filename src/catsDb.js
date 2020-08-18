
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
        ];
    }

    get getAllCats() {
        return this.cats // returns [{},{},{}]
        }
    
    set setCats (catsCopy) {
        this.cats = catsCopy; 
    }

    addCat (newCat) {
        newCat.id = 5; // need to update this - how?      
        let catsCopy = this.getAllCats;
        catsCopy.push(newCat); 
        this.setCats = catsCopy; 
    } // error-handler for what possible errors? would try...catch statements be useful? 
    
    getIndexById (id) { 
        const catArray = this.getAllCats;          // catArray = [ {} , {}, {} ]
        const catIndex = catArray.findIndex(cat => {      // findIndex() iterator 
            console.log(`cat id: ${cat.id} + id: ${id}`)
            return cat.id == id;                         // interchangeable with cat['id']   
        }); 
        console.log(catIndex);
        if (catIndex >= 0) {
            return catIndex; 
        } else {
            return null; 
        };
    }

    getCatById (id) {
        console.log(`retrieving cat id: ${id}`);
        const foundIndex = this.getIndexById(id);
        if (foundIndex !== null) {
        console.log('cat id found in database');
        return this.cats[foundIndex]; 
        } else {
        return null; 
        }
    }

    updateCatById (id, catUpdates) {
        const foundIndex = this.getIndexById(id);  // {name: "", sex: "", coat: ""}
        if (foundIndex === null) {
            return null;
        } else {
            let catsCopy = this.getAllCats;
            for (let key in catUpdates) {
                catsCopy[foundIndex][key] = catUpdates[key];
                console.log(`updated ${key} from ${catsCopy[foundIndex][key]}`);
            }
            this.setCats = catsCopy; 
            return catsCopy[foundIndex];
        };
    }

    deleteCatById (id) {
        const foundIndex = this.getIndexById(id);
        if (foundIndex !== null) {
            this.cats.splice(foundIndex, 1);
            return true;
        } else {
            return false;
        };
    }
}

module.exports = new CatRepository();


