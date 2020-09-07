// class 'CatClass' serves as a template for creating new cat objects with props & methods
// example of dependancy injection:


class CatClass {
    constructor(idGenerator) { // to generate a new class: const newCatRepo = new CatRepository() < pass idGenerator in as an argument 
        this.generateId = idGenerator;
        this.cats = [
            {   
                id: this.generateId(),
                name: "Catty",
                ageInYears: 1,
                favouriteToy: "grass",
                description: "buff or tan, skinny, talkative, often found in tall grasses or deep in the bush",
                breedId: 1
            },
            {
                id: this.generateId(),
                name: "Frank",
                ageInYears: 5,
                favouriteToy: "flies",
                description: "orange, heavy-set, non-responsive except to neck scratches",
                breedId: 1
            },
            {
                id: this.generateId(),
                name: "Pancake",
                ageInYears: 4,
                favouriteToy: "pavement",
                description: "brown, heavy-set, spent life behind bars",
                breedId: 1
            },
            {
                id: this.generateId(),
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
        newCat.id = this.generateId();        // assigns unique id      
        let catsCopy = this.getCats;        // gets array of existing cats 
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
            return null; // TODO - check if we can DRY this check for id. We are passing a lot of 'nulls' around. catIndex is either an index or -1. 
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

module.exports.catClass = CatClass
// export a class by attaching it as a property of the module.exports object 


// Note that if a module is imported multiple times, but with the same specifier (i.e. path), 
// the JavaScript specification guarantees that you’ll receive the same module instance. 
// Above, we should expect that although the class instance is imported in app.js AND catsRouter, it will be the same instance. 

// (and is that instance changeable and the changes stored?)
// or should I import it into app.js and then re-export into catsRouter as something else? 
// let's try it! 

