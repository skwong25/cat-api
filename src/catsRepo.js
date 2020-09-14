// class 'CatRepositoryClass' serves as a template for creating new cat objects with props & methods
// example of dependancy injection:

class CatRepositoryClass {
    constructor(idGenerator) { 
        console.log("idGenerator passed in: " + idGenerator);
        this.generateId = idGenerator; 
        console.log("this.generateId: " + this.generateId);
        this.cats = [
            {   
                id: this.generateId(),  // TypeError: this.generateId is not a function
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

    // returns summary object of each cat. 
    getAllCats() {
        const catCopy = this.getCats;  
        console.log("Copied cat array from database"); 
        const summaryArray = catCopy.map((object) => {
            return {
                id: object['id'],   
                name: object['name']
            }
        });
        console.log(`Array of cat summary objects: ${summaryArray}`);
        return summaryArray;
    }

    // updates database with new cat record 
    // assigns id, adds cat to copy of existing array, reassigns to class object 
    addCat(newCat) {
        newCat.id = this.generateId();            
        let catsCopy = this.getCats;         
        catsCopy.push(newCat);             
        this.setCats = catsCopy;          
        return newCat                    
    } 
    
    // checks database for cat id match, returns index or -1  
    getIndexById(id) { 
        const catArray = this.getCats;       
        return catArray.findIndex(cat => {       
            return cat.id == id;                         
        }); 
    } 

    // returns cat object or null 
    getCatById(id) {
        const foundIndex = this.getIndexById(id);
        if (foundIndex === -1) {
            return null;
        } else {
        return this.cats[foundIndex]; 
        }
    }

    // returns updated cat object or null 
    updateCatById(id, catUpdateObj) {
        const foundIndex = this.getIndexById(id); 
        if (foundIndex === -1) {
            return null;
        } else {
            let catsCopy = this.getCats;
            for (let key in catUpdateObj) {
                if (catUpdateObj[key] !== catsCopy[foundIndex][key]) {    // ensures that if a value is the same, it won't be updated 
                    catsCopy[foundIndex][key] = catUpdateObj[key];
                    console.log(`updated: ${key} = ${catsCopy[foundIndex][key]}`);
                }
            }
            this.setCats = catsCopy; 
            return catsCopy[foundIndex];
        };
    }

    // returns deleted cat object or null 
    deleteCatById(id) {
        const foundIndex = this.getIndexById(id);
        if (foundIndex === -1) {
            return null;
        } else {
            let catsCopy = this.getCats;
            const catRemoved = catsCopy.splice(foundIndex, 1);
            this.setCats = catsCopy; 
            return catRemoved;
        };
    }
} 

module.exports.repository = CatRepositoryClass
// export a class by attaching it as a property of the module.exports object 


// Note that if a module is imported multiple times, but with the same specifier (i.e. path), 
// the JavaScript specification guarantees that you’ll receive the same module instance. 
// Above, we should expect that although the class instance is imported in app.js AND catsRouter, it will be the same instance. 
