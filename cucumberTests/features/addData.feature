
# feature/addData.feature

# feature description follows the 'user story style'
Feature: Add new record to the database  

    As a cat fanatic
    I want to create new records 
    So that new data persists as a unique record in the database 

Scenario: The application creates a new database record 
    Given I run the node application
    And I count the number of records in the database
    When I make a POST request 
    And I count the number of records in the database 
    Then the number of records in the database increases by 1

Scenario: The application assigns an ID to a new database record
    Given I run the node application
    When I make a POST request
    Then the cat object is returned with an id attached


