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

class BreedRepository {
    constructor(dao) {
        this.dao = dao; 

        this.checkForId = this.checkForId.bind(this);
        this.getBreedById = this.getBreedById.bind(this);
    }
    // Note that methods used in/containing neighbouring method calls require binding to the class

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

    // member function used in updateBreedById and deleteBreedById - returns true or false 
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
                    // iterates through object to create a string of keys and values in format: 'column = value column2 = value2'
                    let arr = []; 
                    console.log('object:' + JSON.stringify(object));
                    for (let key in object) {
                        arr.push(` ${key} = '${object[key]}'`);   
                    }
                    console.log('arr: ' + arr); 
                    let sql = `UPDATE breeds SET ${arr.join()} WHERE breedId = ?;`
                    await dao2.run(sql,[id]);
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
                // while statement returns the highest missing id value in the current series of ids
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

                // check that new record added correctly and returns new record
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

