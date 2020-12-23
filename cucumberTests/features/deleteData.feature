
# feature/deleteData.feature

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
    Then the number of records in the database decreases by 1

Scenario: When a record is deleted, that data is inaccessible
   Given I make a DEL request
   When I make a GET request for the same record   
   Then it returns a response with HTTP status code of 404 

# we should really assert on something else 


