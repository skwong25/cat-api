// The Data Access Object class manages the SQLite database connections and exposes methods used to retrieve and create new records 

// Note that sqlite3 methods are asynchronous and should be used with Promises.
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

    // returns a single detail object or undefined (if none found)
    get(sql, param) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, param, function (err, row) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    reject(err);
                } else {        
                    // Note if no records for the requested id, row = 'undefined' 
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
                    arr = rows.map((row) => {return {'id':row.id, 'breedId':row.breedId, 'name': row.name}});
                }
            resolve(arr);
            })
        })
    }

    // returns an array of ids
    allId(sql) {
        return new Promise((resolve, reject) => {  
            let arr = []; 
            this.db.all(sql, function (err, rows) {
                if (err) {
                    reject(err)
                } else {
                    arr = rows.map((row) => {return row.breedId});
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