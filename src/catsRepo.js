// class 'CatRepository' serves as a template for creating new cat objects with props & methods
// the repository class constructor accepts a class instance of the AppDAO object.

class CatRepository {
    constructor(dao) { 
        this.shortid = require('shortid');
        this.validate = require('./validationFunctions'); 
        this.dao = dao; 

        this.getCatById = this.getCatById.bind(this);
        this.addCat = this.addCat.bind(this);
        this.updateCatById = this.updateCatById.bind(this);
        this.deleteCatById = this.deleteCatById.bind(this);
        this.checkForId = this.checkForId.bind(this);
    }

    // Note that methods that contain neighbouring method calls require binding to the class
    // getter & setters no longer required - cat data no longer stored as object properties 

    // returns summary array of each cat (id & name) or empty array. 
    getAllCats() {

        // local variable allows access to dao - binding of class method does not also bind nested function! 
        let dao2 = this.dao; 
        
        const getProm = async function () {
            try {
                let resolvedValue = await dao2.all('SELECT * FROM cats;')      // await returns returns resolved value of Promise
                let summaryObj = resolvedValue;                  
                console.log('repo: cats passed through ok');        
                return summaryObj;
            } catch (err) {
                console.log(err); 
            }                                     
        }
        return getProm(); 
    }

    // Note we no longer need to getIndexById to check for a cat id match, because dao.get() can directly retrieve the result set  

    // member function: checks for id, returns truthy or falsey
    checkForId(id) { 

        let dao2 = this.dao; 

        const getProm = async function () {    
            console.log(`repo: checking if cat ${id} exists`);
            try {
                // await returns resolved value of {id: xxxx} or undefined 
                let isId = await dao2.get(  
                    'SELECT id FROM cats \ WHERE id = ?;', [id])
                console.log('repo id check: ' + JSON.stringify(isId));
                return isId ? true : false;
            } catch (err) {
                console.log(err); 
            } 
        }
        return getProm();  
    } 

    // returns cat object or null 
    getCatById(id) {

        let dao2 = this.dao; 
        let checkForId = this.checkForId; 

        const getProm = async function () {
            try { 
            if (!checkForId(id)) { 
                return null;
            } else {
                let isCat = await dao2.get(  
                    'SELECT * FROM cats \ WHERE id = ?;', [id])
            console.log('repo: cat? ' + JSON.stringify(isCat));
            return JSON.stringify(isCat); 
            }
            } catch (err) {
                console.log(err); 
            } 
        }
        return getProm(); 
    }

    // assigns id + updates database with new cat record 
    addCat(newCat) {  

        let dao2 = this.dao; 
        let getCatById = this.getCatById; 
        const newId = this.shortid.generate(); 

        let getProm = async function () {
            try {
                await dao2.run(
                    'INSERT INTO cats (id, name , ageInYears, favouriteToy, description) \
                    VALUES (?,?,?,?,?)',
                    [newId, newCat.name , newCat.ageInYears, newCat.favouriteToy, newCat.description]
                ); 
                return getCatById(newId); 
            } catch (err) {
                console.log(err); 
            } 
        } 
        return getProm();                
    }     

    // returns updated cat object or null 
    updateCatById(id, catUpdateObj) { 

        let dao2 = this.dao; 
        let checkForId = this.checkForId;  
        let getCatById = this.getCatById; 

        let getProm = async function () {
            try {
                let isCat = await checkForId(id);  
                if (!isCat) {
                    return null;
                } else {
                    let arr = [];
                    // creates string of keys & values to be updated
                    console.log(`catUpdateObj: ${JSON.stringify(catUpdateObj)}`); // Eg: {"name":"Gatty","ageInYears":2}
                    for(let key in catUpdateObj) {
                            arr.push(`${key} = '${catUpdateObj[key]}' `); 
                    } 
                    console.log(arr) // should be [name = Gatty ,ageInYears = 2] 
                    let sql = 'UPDATE cats SET ' + arr.join() + 'WHERE id = ?' 
                    console.log(`repo sql: ${sql}`);

                    // UPDATE cats SET key = 'value' 
                    // updates (/replaces) record - this might be a problem if the id isn't also included. 
                    await dao2.run(sql,[id])
                    // fetches record to check its correctly updated
                    console.log("now we have updated..."); 
                    return getCatById(id);
                };
            } catch (err) {
                console.log(err); 
            }
        }
        return getProm(); 
    }

    // returns true or null 
    deleteCatById(id) {

        let dao2 = this.dao; 
        let checkForId = this.checkForId; 

        const getProm = async function () {
            try {
                let outcome = await checkForId(id)
                if ( outcome === false) {
                    console.log('repo: cat not found')
                    return null;
                } else {
                    let isCat = await dao2.run(
                        'DELETE FROM cats \ WHERE id = ?', [id])
                    console.log(`repo: cat ${id} deleted`);
                    return true; 
                };
            } catch (err) {
                console.log(err); 
            }
        }
        return getProm(); 
    }
} 

// we can write a function that just checks if an id exists by 'SELECT id' rather than retrieving the entire record. 

module.exports.repository = CatRepository
// export a class by attaching it as a property of the module.exports object 


// Note that if a module is imported multiple times, but with the same specifier (i.e. path), 
// the JavaScript specification guarantees that you’ll receive the same module instance. 
// Above, we should expect that although the class object is imported in app.js AND catsRouter, it will be the same instance. 
// However, if it is instantiated in two separate places it will be two separate class instances. 