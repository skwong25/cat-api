// class 'CatRepository' serves as a template for creating new cat objects with props & methods

class CatRepository {
    constructor() {
        this.cats = [ // array of objects - if object, change to >> this.cats:{ 1:{}, 2:{}, 3:{}}
            {
                id: 1,
                name: "Catty",
                ageInYears: 1,
                favouriteToy: "grass",
                description: "buff or tan, skinny, talkative, often found in tall grasses or deep in the bush",
                breedId: 1
            },
            {
                id: 2,
                name: "Frank",
                ageInYears: 5,
                favouriteToy: "flies",
                description: "orange, heavy-set, non-responsive except to neck scratches",
                breedId: 1
            },
            {
                id: 3,
                name: "Pancake",
                ageInYears: 4,
                favouriteToy: "pavement",
                description: "brown, heavy-set, spent life behind bars",
                breedId: 1
            },
            {
                id: 4,
                name: "Madame Floof",
                ageInYears: 1,
                favouriteToy: "ball",
                description: "white dark patches on legs, kerbside, fluffy dustbuster tail",
                breedId: 2
            },
        ];
    }

    get getCats() {
        return this.cats // returns [{},{},{}]
    }
    
    set setCats(catsCopy) {
        this.cats = catsCopy; 
    }

    getAllCats () { // we need a summary object of each cat. 
        const catCopy = this.getCats;  
        console.log("Copied cat array from database"); 
        const summaryArray = catCopy.map((object) => {
            return {
                id: object['id'],   
                name: object['name']
            }
        })
        console.log(`Final summary array = ${summaryArray}`);
        return summaryArray;
    }

    addCat (newCat) {
        newCat.id = 5;                       // assigns a new id number      
        let catsCopy = this.getCats;     // gets array of existing cats 
        catsCopy.push(newCat);             // adds cat to existing array
        this.setCats = catsCopy;          // reassigns the new cat array to stored variable  
        return newCat                    
    } 
    
    getIndexById (id) { 
        const catArray = this.getCats;          // catArray = [ {} , {}, {} ]
        const catIndex = catArray.findIndex(cat => {      // findIndex() iterator 
            console.log(`cat id: ${cat.id} + id: ${id}`)
            return cat.id == id;                         // interchangeable with cat['id']   
        }); 
        console.log(`Cat Index: ${catIndex}`);
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
            let catsCopy = this.getCats;
            for (let key in catUpdates) {
                if (catUpdates[key] !== catsCopy[foundIndex][key]) {    // ensures that if a value is the same, it won't be updated 
                    catsCopy[foundIndex][key] = catUpdates[key];
                    console.log(`updated: ${key} = ${catsCopy[foundIndex][key]}`);
                }
            }
            this.setCats = catsCopy; 
            return catsCopy[foundIndex];
        };
    }

    deleteCatById (id) {
        const foundIndex = this.getIndexById(id);
        if (foundIndex !== null) {
            let catsCopy = this.getCats;
            catsCopy.splice(foundIndex, 1);
            this.setCats = catsCopy; 
            return true;
        } else {
            return false;
        };
    }
}

module.exports = new CatRepository();


