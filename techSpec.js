/*
2. Introduction

a. Overview, Problem Description, Summary, or Abstract

    Context: Cat API is an Express.js application run on Node.js runtime. 

    Problem: The Cat API currently does not have access to a cat database that persists. 
    The information is generated when the API server is started. 

    Suggested solution: Implement a SQLite database which allows information to be persisted. 

b. Glossary  or Terminology

    parameterization - parameterized queries is a way of preventing SQL injection. This can be done using named placeholders. 
    SQL - structured query language 
    SQLite - a file-based database engine that uses SQL syntax
    sqlite3 - node module enables connection to SQLite databases stored in memory or in a file 

    sqlite3 methods:
        db.all - allows us to access all the rows in the dataset - this might offer the best flexibility for now
        db.each - executes code for each row in a dataset
        db.get - executes code for the FIRST row - use when we know only one row will return. 
        db.run - used to create / alter tables and to insert / update table data. 

d. Goals or Product and Technical Requirements

    Product requirements: 
        1. We should have a pre-populated SQLite database on the file system. 
        2. Upon start-up of the Cat API Express server, it should establish a connection to the SQL database - or should it?  
        3. The Cat API should be able to read from the SQLite database for GET all & GET by id requests and return objects. 
        4. The Cat API should be able to write to the SQLite database for POST & PUT requests and return new/updated objects. 
        4. The Cat API should be able to delete from the SQLite database for DEL requests. 
        

    Technical requirements: 
        
        1.
        Create and populate 'cat' & 'pedigree breed' tables via sqlite in Terminal. 'CREATE TABLE' and so forth....
        Remove list of cats and breed objects from catsRepo.js & breedsRepo.js respectively.   
        Review if the repositories still need to be classes in this case? 
        Note that 'id' key in tables is to have PRIMARY KEY constraint (needs to be unique)  
         
        2. 
        Install sqlite3 node module into the root directory of cat api. Import/require sqlite3 into repository files for use.

        We will create a DAO (Data Access Object) which contains a class AppDAO that...
            1. starts up database connection upon class instantiation:  
                class AppDAO {
                    constructor(dbFilePath) {
                    this.db = new sqlite3.Database(dbFilePath)  
                    }
                }
            2. sets down methods to interface with the database: db.get(), db.each(), db.run() etc
        This will be the interface between the Repository and the SQLite Database.
        The DAO class will be instantiated within the main app.js file, when the server is started up via 'npm start'.
            const dao = new AppDAO('./database.sqlite3')
        
            Repository class constructors will take AppDAO class instance upon instantiation:
                
            const catRepo = new CatRepository(dao)
        
        Repository class methods need to be rewritten to include function calls of the AppDAO class to access and query the database connection.
        
        +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        Each HTTP request (GET, POST, PUT, DEL) requires a different database query command. 
        How should we deal with this?
        -----------------------------

        Each request has its own 'database connector' function. This is simplest as request types pass different parameters as arguments.
        Any parameter passed as argument for use within a SQL command should use parameterization, to prevent against SQL injection. 
        For eg the HTTP methods GET, DEL & PUT by Id will pass an 'id' argument. For parameterised queries, this should be passed using placeholder: (?)  
        https://www.w3schools.com/sql/sql_injection.asp

        Here is an example using sqlite's prepared statements: 
        Eg: https://www.veracode.com/blog/secure-development/how-prevent-sql-injection-nodejs
        https://stackoverflow.com/questions/40418693/sqlite-how-to-escape-values-to-prevent-sql-injection

        Note also that certain parameters have already been through checks in Router files (isIdvalid() and checkObject())

        Later can be reviewed and DRY-ed from then on. 
        
        +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        
        3 - 5. 
        Each request type requires a different sqlite3 method & SQL query: 
        
            GET ALL - should return a summary object
                    db.each SELECT * FROM table 
                    ( db.each iterates through result set allowing us to process & return an array of summary objects )
                    (Alternatively we could have a detail table and a summary table, but would be more complex to update two tables in a POST/PUT request) 
            
            GET BY ID - returns a single row 
                    db.get SELECT * FROM table WHERE id = ? (id passed as argument)
                    ( db.get deals with a single row result set)
                    callback > returns the object 

            DEL BY ID - returns no content
                    db.run DELETE FROM table WHERE id = ? 
                    
            PUT BY ID - return updated object
                    Use db.serialise() wrapper to run: (ensures synchronous execution)
                        db.run UPDATE table SET keyToBeUpdated = value WHERE id = ?
                        db.get SELECT * FROM table WHERE id = ?;              

                    Note: As likely updating lots of values, not just one, we may have to use a Conditional update:  
                    
                        https://stackoverflow.com/questions/20255138/sql-update-multiple-records-in-one-query 
                        
                        UPDATE config
                        SET config_value = CASE config_name 
                                    WHEN 'name1' THEN 'value' 
                                    WHEN 'name2' THEN 'value2' 
                                    ELSE config_value
                                    END
                        WHERE config_name IN('name1', 'name2');
                        WHERE config_name IN('name1', 'name2');
                    
                    
            POST -  return updated object
                    The addCat() method will need to pass a generated id as parameter to the database connector function.  
                    Use db.serialise() wrapper to run:
                        db.run INSERT INTO table ([arrayOfKeys]) VALUES ([arrayOfValuesToBeUpdated]); 
                        db.get SELECT * FROM table WHERE id = ?;  
        

f. Future Goals

    Would like host on github or similar, to enable access via browser. However, likely to be read-only. 


c. Test Plan

    We should not have to refactor tests:
    Unit tests concern validationFunctions module which will be unchanged, as these function check incoming request objects. 
    Integration tests test end output, which should remain unchanged. 

    However we should no longer have to use a mock idGenerator, so should adjust this to test closer to reality.  
