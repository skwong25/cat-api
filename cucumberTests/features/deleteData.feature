
# feature/deleteData.feature

# feature description follows the 'user story style'

Feature: Delete a record from the database  

    As a user of the API
    I want to be able to make DELrequests
    So that I can delete records from the database

@delete
Scenario: The application deletes a database record 
    Given I run the node application
    And I count the number of records in the database 
    When I make a DEL request 
    And I count the number of records in the database 
    Then the number of records in the database has decreased 

@wip
Scenario: When a record is deleted, that data can no longer be accessed
   Given I run the node application
   And I make a DEL request
   When I make a GET request for the same record   
   Then a 404 error is returned

# either we need to clear JSONresponse variable before GET request within the step 
# since we would have already extracted the lastId

# using a hook OR within the step code 

