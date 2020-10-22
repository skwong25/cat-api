// sqlite3 methods are asynchronous and should be used with Promises.

// Within the Data Access Object, functions should return data objects as requested, and keep processing minimal.
// Any pre or post processing should be done in catsRepository file.

// Promises recap: 
    // return new Promise(executorFunction(resolve, reject)=>{}) returns a Promise with the callback
    // the callback dictates how the Promise is settled
    // the executor function will always have 2 params: resolve, reject
    // resolve(x) changes Promise state from pending to fulfilled, its resolved value will be 'x'
    // reject(err) changes Promise state from pending to rejected, with error reason: 'err'

sqlite3 = require('sqlite3').verbose();

class AppDAO {
    constructor(filepath) {
        // the connection object is stored in a member field 'db' on the AppDAO class.
        this.db = new sqlite3.Database(filepath, (err) => {  
            if (err) {
            return console.error(err.message);
            }
        console.log('Connected to sqlite database');
        });
    }

    // returns a single detail object or undefined(if none found)
    get(sql, param) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, param, function (err, row) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    reject(err);
                } else {        
                    // Eg: if there are no records for the requested id, row will be 'undefined' 
                    row ? console.log(`dao: record found ${JSON.stringify(row)}`) : console.log("dao: no record here")
                    resolve(row); 
                };     
            })
        })
    }

    // returns an array of summary objects of all records 
    all(sql) {
        return new Promise((resolve, reject) => {  
            let arr = []; 
            this.db.all(sql, function (err, rows) {
                if (err) {
                    reject(err)
                } else {
                    arr = rows.map((row) => {return {'id':row.id, 'name': row.name}});
                    // TODO: 
                    // single responsibility principle: arguably should process data only in Repo files? 
                    // can do this in the callback in the dao.get() function call  
                    // callback would be passed as a parameter
                    console.log(`dao: ${JSON.stringify(arr)}`);
                }
            resolve(arr);
            })
        })
    }


    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }
}


// let filepath = '../sqlite/tables.db'
module.exports = AppDAO; 