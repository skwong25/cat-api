// CatRepository class manages the state of cat objects and exposes methods which should be used to retrieve and create new objects
// Instantiated in main app.js, takes as dao (data access object) as parameter which manages the database connection

class CatRepository {
    constructor(dao) { 
        this.shortid = require('shortid');
        this.validate = require('./validationFunctions'); 
        this.dao = dao; 

        // Note that methods that contain neighbouring method calls require binding to the class
        this.getCatById = this.getCatById.bind(this);
        this.addCat = this.addCat.bind(this);
        this.updateCatById = this.updateCatById.bind(this);
        this.deleteCatById = this.deleteCatById.bind(this);
        this.checkForId = this.checkForId.bind(this);
    }


    // returns summary array of each cat (id & name) or empty array. 
    getAllCats() {

        // local variable allows access to dao - note that binding of class methods does not also bind nested functions
        let dao2 = this.dao; 
        
        const getProm = async function () {
            try {
                let resolvedValue = await dao2.all('SELECT * FROM cats;')      // await returns returns resolved value of Promise
                let summaryObj = resolvedValue;                  
                console.log('repo: cats received');        
                return summaryObj;
            } catch (err) {
                console.log(err); 
            }                                     
        }
        return getProm(); 
    }

    // member function: checks for id, returns truthy or falsey
    checkForId(id) { 

        let dao2 = this.dao; 

        const getProm = async function () {    
            console.log(`repo: checking if cat ${id} exists`);
            try {
                // returns resolved value of {id: xxxx} or undefined 
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
            return isCat; 
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
    updateCatById(id, object) { 

        let dao2 = this.dao; 
        let checkForId = this.checkForId;  
        let getCatById = this.getCatById; 

        let getProm = async function () {
            try {
                let isCat = await checkForId(id);  
                if (!isCat) {
                    return null;
                } else {
                    let sql = 'UPDATE cats SET name = ?, ageInYears = ?, favouriteToy = ?, description = ? WHERE id = ?' 
                    await dao2.run(sql,[object.name, object.ageInYears, object.favouriteToy, object.description, id])
                    // fetches record to check its correctly updated
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

module.exports.repository = CatRepository
// export a class by attaching it as a property of the module.exports object 


// Note that if a module is imported multiple times, but with the same specifier (i.e. path), 
// the JavaScript specification guarantees that you’ll receive the same module instance. 
// Above, we should expect that although the class object is imported in app.js AND catsRouter, it will be the same instance. 
// However, if it is instantiated in two separate places it will be two separate class instances. 