// BreedRepository class manages the state of breed objects and exposes methods which should be used to retrieve and create new objects
// Instantiated in main app.js, takes as dao (data access object) as parameter which manages the database connection

class BreedRepository {
    constructor(dao) {
        this.dao = dao; 

        // Note that methods used in/containing neighbouring method calls require binding to the class
        this.checkForId = this.checkForId.bind(this);
        this.getBreedById = this.getBreedById.bind(this);
    }

    // returns a summary list of breed objects 
    getAllBreeds() {
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

    // returns true or false (member function called in updateBreedById and deleteBreedById)
    checkForId(id) {
        const dao2 = this.dao;
        const getProm = async function () {
            try {
                const isId = await dao2.get('SELECT breedId FROM breeds WHERE breedId = ?;', [id]);
                // returns either id or undefined 
                return isId? true : false 
            } catch (err) {
                console.log(err);
            }
        }
        return getProm();
    }

    getBreedById(id) {
        // note that we re-declare function variables for each method to allow access within local scope  
        const dao2 = this.dao;
        const checkForId = this.checkForId; 

        const getProm = async function () {
            try {
                if (!checkForId(id)) {
                    return null;
                } else {
                    const getBreed = await dao2.get('SELECT * FROM breeds WHERE breedId = ?;', [id]);
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
                    let sql = `UPDATE breeds SET name = ?, description = ? WHERE breedId = ?;`
                    await dao2.run(sql,[object.name, object.description, id]);
                    let checkNewRecord = getBreedById(id);  
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
        const getBreedById = this.getBreedById; 

        const getProm = async function () {
            try {
                // generates new id value. 
                let idArray = await dao2.allId('SELECT * FROM breeds;'); 
                // 'while' statement returns highest missing id value in the current series of ids
                // its noted that SQLite's implicit rowid column is auto-incrementing which could replace below code 
                console.log('idArray: '+  idArray);
                let count = 1; 
                while (count === idArray[count-1]) {
                    count++;
                }
                let newId = count; 
                console.log('new id: ' + newId);

                // insert new record row 
                await dao2.run(
                    `INSERT INTO breeds (breedId, name,\
                    description) VALUES (?,?,?);`, 
                    [newId, object.name, object.description]);

                return getBreedById(newId); 
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
                let isId = await checkForId(id);
                console.log('repo: has it been found? ' + isId);
                if (!isId) {
                    return null;
                } else {
                    let result = await dao2.run('DELETE FROM breeds WHERE breedId = ?;', [id]);
                    console.log('repo: has it deleted? ' + result);
                    return result; 
                }; 
            } catch (err) {
                console.log(err); 
            };
        }
        return getProm();
    }
}

module.exports.repository = BreedRepository;
// export a class by attaching it as a property of the module.exports object 

