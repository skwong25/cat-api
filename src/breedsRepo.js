// class 'BreedRepository' serves as a template for creating new breed objects with props & methods
// the repository class constructor accepts a class instance of the AppDAO object, to allow dao methods. 

/*
// data now persisted in SQLite db: 
this.breeds = [
        {
        breedId: 1,
        name: "tabby",
        description: "Tabbies have a distinctive 'M' shaped marking on their forehead, stripes by their eyes and across their cheeks, along their back, and around their legs and tail"
        },
        {
        breedId: 2,
        name: "turkish angora",
        description: "Turkish Angoras are one of the ancient, natural breeds of cat, having originated in central Turkey dated as far back as the 17th century, in the Ankara region."
        }
    ]
*/

// instantiates dao class to be passed as param into Repo classes 
// upon instantiation, this starts up a SQLite database connection
const path = require('path')
const dbPath = path.resolve(__dirname, '../sqlite/tables.db')
const AppDAO = require('./dao'); 
const dao = new AppDAO(dbPath); 
// Difference between catRepo & breedRepo class instances:
// catRepo is instantiated in app.js, so dao is imported and instantiated there to be passed in as a parameter
// whereas breedRepo is instantiated here, so dao needs to be imported & instantiated here. 
// Ideally for consistency, breedRepo would be instantiated in the same place as catRepo so we only import & instantiate dao in ONE PLACE. 

class BreedRepository {
    constructor(dao) {
        this.dao = dao; 
    }

    // returns a summary list of breed objects 
    getAllBreeds() {
        console.log('repo dao:' + this.dao); 
        const dao2 = this.dao;
        const getProm = async function () {
            try {
                const allBreeds = await dao2.all('SELECT * FROM breeds;');
                return allBreeds; 
            } catch (err) {
                console.log(err); 
            }
        }
        return getProm();
    }

    // used in updateBreedById and deleteBreedById - returns true or false 
    checkForId(id) {

        const dao2 = this.dao;

        const getProm = async function () {
            try {
                const isId = await dao2.get('SELECT id FROM breeds WHERE breedId = ?;', [id]);
                // returns either id or undefined 
                return isId? true : false 
            } catch (err) {
                console.log(err);
            }
        }
        return getProm();
    }

    getBreedById(id) {

        const dao2 = this.dao;
        const checkForId = this.checkForId; 

        const getProm = async function () {
            try {
                if (!checkForId(id)) {
                    return null;
                } else {
                    const getBreed = await dao2.get('SELECT * FROM breeds WHERE id = ?;', id);
                    return getBreed; 
                };
            } catch (err) {
                console.log(err);
            }
        }
        return getProm();
    }

    updateBreedById(id, object) {
        
        const dao2 = this.dao;
        const checkForId = this.checkForId; 
        const getBreedById = this.getBreedById; 

        const getProm = async function () {
            try {                
                if (!checkForId(id)) {
                    return null;
                } else {
                    // iterates through object to create a string of keys and values in format: 'column = value column2 = value2'
                    let arr;
                    for (let key in object) {
                        arr.push(`${key} = '${object.key}' `);   
                    }
                    await dao2.run('UPDATE breeds SET ? WHERE id = ?;', arr, id);
                    let checkNewRecord = getBreedById(id);  // TODO: check that we don't need to await return value of this method 
                    return checkNewRecord; 
                };
            } catch (err) {
                console.log(err); 
            }
        }
        return getProm();      
    }

    addBreed(object) { 

        const dao2 = this.dao;
        const checkForId = this.checkForId; 

        const getProm = async function () {
            try {
                // gets new id value. 
                // Note that dao2.get() returns [{},{},{]}] - need to test if iterator works on this ok 
                let idArray = await dao2.get('SELECT id FROM breeds;'); 
                // .reduce() returns the highest missing id value in the current series of ids
                const newId = idArray.reduce((accumulator, id) => {
                    if (id == accumulator) {
                        accumulator++ 
                    } else {
                        return accumulator;
                    }
                },0);
                console.log('new id: ' + newId);

                // insert new record row 
                await dao2.run(
                    `INSERT INTO breeds (breedId, name,\
                    description) VALUES (?,?,?);`, 
                    [newId, object.name, object.description]);

                // check that new record added correctly 
                return checkForId(newId); 
            } catch (err) {
                console.log(err);
            };
        }
        return getProm();   
    }

    deleteBreedById(id) {

        const dao2 = this.dao;
        const checkForId = this.checkForId; 

        const getProm = async function () {
            try {
                let isId = checkForId(id);
                if (!isId) {
                    return null;
                } else {
                    await dao2.run('DELETE * FROM breeds WHERE id = ?;', id);
                    return true; 
                }; 
            } catch (err) {
                console.log(err); 
            };
        }
        return getProm();
    }
}

module.exports = new BreedRepository(dao);

