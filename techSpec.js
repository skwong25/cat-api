/*
2. Introduction

a. Overview, Problem Description, Summary, or Abstract

    Context: Cat API is an Express.js application run on Node.js runtime. 

    Problem: The Cat API currently does not have access to a cat database that persists. 
    The information is generated when the API server is started. 
    For this reason, for example, the ids are different every time around which made writing test cases trickier. 

    Suggested solution: Implement a SQLite database which allows information to be persisted. 

b. Glossary  or Terminology

    SQL - structured query language 
    SQLite - a file-based database engine that uses SQL syntax
    sqlite3 - node module enables connection to SQLite databases in memory or disk file 

    sqlite3 methods:
        db.all - allows us to access all the rows in the dataset - this might offer the best flexibility for now
        db.each - executes code for each row in a dataset
        db.get - executes code for the FIRST row - use when we know only one row will return. 

d. Goals or Product and Technical Requirements

    Product requirements: 
        1. We should have a pre-populated SQLite database on the file system. 
        2. Upon start-up of the Cat API Express server, it should establish a connection to the SQL database - or should it?  
           Let's review:
           The connection is required wherever we make a query via sqlite3 methods: all() get() and each()
           The connection should be closed when we finish making the query and processing the result set. 
           Therefore the connection does NOT need to be connected immediately upon server start-up.
        3. The Cat API should be able to read from the SQLite database for GET all & GET by id requests and return objects. 
        4. The Cat API should be able to write to the SQLite database for POST & PUT requests and return new/updated objects. 
        4. The Cat API should be able to delete from the SQLite database for DEL requests. 
        

    Technical requirements: 
        
        1.
        Create and populate 'cat' & 'pedigree breed' tables via sqlite in Terminal. 'CREATE TABLE' and so forth....
        Remove list of cats and breed objects from catsRepo.js & breedsRepo.js respectively.   
        Review if the repositories still need to be classes in this case? 
        Note that id to have PRIMARY KEY constraint (needs to be unique)  
         
        2. 
        Install sqlite3 node module into the root directory of cat api.
        Import/require into repository files for use - Eg catsRepo.js is where all direct interaction with database happens. 
        Repository methods will call a third party function that starts a database connection, queries the database and closes connection. 
        These function should take three arguments: database path ('./catDb' or './breedDb') request type (GET / PUT / POST / DEL ), SQL query as a string. 
        This function can be an seperated imported file/module for separation of concerns, and reusability by Breed repository 
        
        +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        Each HTTP request (GET, POST, PUT, DEL) requires a different database query command. 
        How should we deal with this?
        -----------------------------

        Either we have one central 'database connector' function with multiple cases, HTTP request type is passed in as argument, Eg:

        const databaseConnection = ( <database path>, <request type>,  <sql command>) => { 
            if (<request type> === GET) {...} etc  
        } 

        OR each request has its own 'database connector' function. This is simplest as request types pass different parameters as arguments.
        Later can be reviewed and DRY-ed from then on. 
        
        +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        All 'database connector' functions begin by opening connection to db, and end with closing the connection: 

        let db = new sqlite3.Database(<database path >)  
        ...
        db.close()
        
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

    Host on github or similar, to enable access via browser. 

3. Solutions

b. Suggested or Proposed Solution / Design 

    External components that the solution will interact with and that it will alter
    Dependencies of the current solution
    Pros and cons of the proposed  solution 
    Data Model / Schema Changes
        Schema definitions
        New data models
        Modified data models
        Data validation methods
    Business Logic
        API changes
        Pseudocode
        Flowcharts
        Error states
        Failure scenarios
        Conditions that lead to errors and failures
        Limitations
    Presentation Layer
        User requirements
        UX changes
        UI changes
        Wireframes with descriptions
        Links to UI/UX designer’s work
        Mobile concerns
        Web concerns
        UI states
        Error handling
    Other questions to answer
        How will the solution scale?
        What are the limitations of the solution?
        How will it recover in the event of a failure?
        How will it cope with future requirements?

c. Test Plan

    We should not have to refactor tests:
    Unit tests concern validationFunctions module which will be unchanged, as these function check incoming request objects. 
    Integration tests test end output, which should remain unchanged. 

    However we should no longer have to use a mock idGenerator, so should adjust this to test closer to reality.  

d. Monitoring and Alerting Plan 

    We will create a new branch off of Cat API master. 

g. Alternate Solutions / Designs

4. Further Considerations

5. Success Evaluation

6. Work

a. Work estimates and timelines

    List of specific, measurable, and time-bound tasks
    Resources needed to finish each task
    Time estimates for how long each task needs to be completed


7. Deliberation

a. Discussion

    Elements of the solution that members of the team do not agree on and need to be debated further to reach a consensus.

b. Open Questions

    Questions about things you do not know the answers to or are unsure that you pose to the team and stakeholders for their input. These may include aspects of the problem you don’t know how to resolve yet. 

8. End Matter

a. Related Work

    Any work external to the proposed solution that is similar to it in some way and is worked on by different teams. It’s important to know this to enable knowledge sharing between such teams when faced with related problems. 

b. References

    Links to documents and resources that you used when coming up with your design and wish to credit. 

c. Acknowledgments

    Credit people who have contributed to the design that you wish to recognize.

