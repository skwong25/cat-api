
// class 'CatRepository' serves as a template for creating new cat objects with props & methods

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

    getCatByIndex (index) {
        console.log(`retrieving cat at id: ${index}`);
        return this.cats[index]; // returns {} (note that this.cats.index did not work)
        }

    set addCat (object) {
        let arrayToUpdate = this.getAllCats;
        arrayToUpdate.push(object); 
        this.cats = arrayToUpdate; 
    }

    // read setters, but what we really want to do is...[this.cats].push(object)
    // a setter reassigns the value of a property
    // either what we can do is to take a copy of that array, push in the object, and reassign

    set updateCat(catUpdates) { // expect catUpdates to be an Object eg: { sex: "M", coat: "shorthair"}

    } 
}
    // can setters help us with deleteCatById(), post and put? 
    // setters can help us reassign values to existing properties

    // for DEL & POST requests that want to permanently change the database,  
    // they need to affect the class - not the class instance, not sure how this works? 
    // can it affect the file itself? 

module.exports = new CatRepository();

