
# feature/deleteData.feature

# feature description follows the 'user story style'

Feature: Delete a record from the database  

    As a cat fanatic
    I want to be able to delete records from the database
    So that the records can no longer be accessed

Background: The Express node application is up and running  
    Given I run the node application

Scenario: The application deletes a database record 
    Given I count the number of records in the database 
    When I make a DEL request 
    And I count the number of records in the database 
    Then the number of records in the database decreases 

Scenario: When a record is deleted, that data can no longer be accessed
   Given I make a DEL request
   When I make a GET request for the same record   
   Then a 404 error returns


