
# Technical Spec for Implementing SQLite Database #

# Overview

Context: Cat API is an Express.js application run on Node.js runtime. 

Problem: The Cat API currently does not have access to a cat database that persists. 
The information is generated when the API server is started. 

Suggested solution: Implement a SQLite database which allows information to be persisted. 

# Glossary

- parameterization - parameterized queries is a way of preventing SQL injection. This can be done using named placeholders. 
- SQL - structured query language 
- SQLite - a file-based database engine that uses SQL syntax
- sqlite3 - node module enables connection to SQLite databases stored in memory or in a file 

sqlite3 methods:
- db.all - allows us to access all the rows in the dataset - this might offer the best flexibility for now
- db.each - executes code for each row in a dataset
- db.get - executes code for the FIRST row - use when we know only one row will return. 
- db.run - used to create / alter tables and to insert / update table data. 

# Product and Technical Requirements

Product requirements: 
- 1. We should have a pre-populated SQLite database on the file system. 
- 2. Upon start-up of the Cat API Express server, it should establish a connection to the SQL database.
- 3. The Cat API should be able to read from the SQLite database for GET all & GET by id requests and return objects. 
- 4. The Cat API should be able to write to the SQLite database for POST & PUT requests and return new/updated objects. 
- 5. The Cat API should be able to delete from the SQLite database for DEL requests. 
- 6. When the application is closed manually (via ctrl-c) the connection & server should shutdown gracefully. 

Technical requirements: 
        
1.
Create and populate 'cat' & 'pedigree breed' tables via sqlite in Terminal. 'CREATE TABLE' and so forth....
Remove list of cats and breed objects from catsRepo.js & breedsRepo.js respectively.  
Review if the repositories still need to be classes in this case? 
Note that 'id' key in tables is to have PRIMARY KEY constraint (needs to be unique)  
         
2. 
Install sqlite3 node module into the root directory of cat api. This should now appear as a dependancy in package.json. 
Import/require sqlite3 into repository files for use.

We will create a DAO (Data Access Object) which contains a class AppDAO that...
1. starts up database connection upon class instantiation:  

```javascript
                class AppDAO {
                    constructor(dbFilePath) {
                    this.db = new sqlite3.Database(dbFilePath)  
                    }
                }
```
2. sets down methods to interface with the database: db.get(), db.each(), db.run() etc
This will be the interface between the Repository and the SQLite Database.
The DAO class will be instantiated within the main app.js file, when the server is started up via 'npm start'.

```javascript
            const dao = new AppDAO('./database.sqlite3')
```
Repository class constructors will take AppDAO class instance upon instantiation:   

```javascript
            const catRepo = new CatRepository(dao)
```  
Repository class methods need to be rewritten to include function calls of the AppDAO class to access and query the database connection.

Each HTTP request (GET, POST, PUT, DEL) requires a different database query command. 

Each request has its own 'database connector' function. This is simplest as request types pass different parameters as arguments.
Any parameter passed as argument for use within a SQL command should use parameterization, to prevent against [SQL injection](https://www.w3schools.com/sql/sql_injection.asp). 
For eg the HTTP methods GET, DEL & PUT by Id will pass an 'id' argument. For [parameterised queries](https://www.veracode.com/blog/secure-development/how-prevent-sql-injection-nodejs), this should be passed using placeholder: (?)  

[Example](https://stackoverflow.com/questions/40418693/sqlite-how-to-escape-values-to-prevent-sql-injection) using sqlite's prepared statements.

Note also that certain parameters have already been through checks in Router files (isIdvalid() and checkObject())
Later can be reviewed and DRY-ed from then on. 
        
        
3 - 5. 
Each request type requires a different sqlite3 method & SQL query: 
        
GET ALL - should return a summary object
    db.each SELECT * FROM table 
    (db.each iterates through result set allowing us to process & return an array of summary objects )
    (Alternatively we could have a detail table and a summary table, but would be more complex to update two tables in a POST/PUT request) 
            
GET BY ID - returns a single row 
    db.get SELECT * FROM table WHERE id = ? (id passed as argument)
    (db.get deals with a single row result set)
    callback > returns the object 

DEL BY ID - deletes row, returns no content
    db.run DELETE FROM table WHERE id = ? 

POST - adds row of data, returns updated object 
    Use db.serialise() wrapper to run: (ensures synchronous execution)
    db.run INSERT INTO table (key, key, key) VALUES (?,?,?); 
    db.get SELECT * FROM table WHERE id = ?;  
                    
PUT BY ID - updates row of data, returns updated object
    Use db.serialise() wrapper to run: (ensures synchronous execution)
    db.run UPDATE table SET keyToBeUpdated = value WHERE id = ?
    db.get SELECT * FROM table WHERE id = ?;              
    We can update lots of values as per following syntax: 
                    
```sql
    UPDATE table
        SET column_1 = new_value_1,
        column_2 = new_value_2
    WHERE
        search_condition 
    ORDER column_or_expression
    LIMIT row_count OFFSET offset;
        
```
However we also need a [check](https://stackoverflow.com/questions/6677517/update-if-different-changed), to ensure values which are the same (or non-existant) in the new object are not updated. 

```sql
    UPDATE table1 
        SET col1 = 'hello' 
        WHERE id = ? AND col1 <> 'hello'
```
This heavyweight solution would need to filter through ALL the columns. Non-equality predicates are not able to use index seeks. 
Better solution using EXIST & EXCEPT clauses. We want to compare the values in the destination row to the values in the matching source row to determine if an update is needed, to avoid net zero changes. 

```sql
update cats
   set name = ?,
       ageInYears = ?,
       favouriteToy = ?,
       description = ?
where id IS ?
  and exists 
    (
    select catUpdates.name
           catUpdates.ageInYears
           catUpdates.description
    except
    select cats.name,
           cats.ageInYears,
           cats.description           ,
      from catUpdates
     where cats.id = catUpdates.id
    )
```
// 1. get record row and compare. 
const body = {
        "name": "JimJam",
        "ageInYears": 5,
        "favouriteToy": "amazing technicolour dreamcoat"
    } 
// we can 'iterate' through the keys
// how can we make an UPDATE command that only updates the object keys we give it? 
// in this case, we have to offer it two results set rows

6. 
The SIGTERM event is emitted when the Node application is manually exited via Ctrl-C:
We will add a listener on the process core module, to close the server and connection, then exit. 

```javascript
        process.on('SIGTERM', ()=>{
            db.close();
            server.close();
            process.exit();
        })
```

# Future Goals

Would like host on github or similar, to enable access via browser. However, likely to be read-only. 


# Test Plan

We should not have to refactor tests:
Unit tests concern validationFunctions module which will be unchanged, as these function check incoming request objects. 
Integration tests test end output, which should remain unchanged. 

However we should no longer have to use a mock idGenerator, so should adjust this to test closer to reality.  

