
# feature/addNewRecord.feature

# feature description follows the 'user story style'
Feature: Add new record to the database  

    As a user of the API
    I want to be able to make POST requests
    So that I can create new records in the database

Scenario: The application creates a new database record 
    Given I run the node application
    And I count the number of records in the database
    When I make a POST request with a cat object
    And I count the number of records in the database 
    Then the number of records in the database has increased 

Scenario: The application assigns an ID to a new database record
    Given I run the node application
    When I make a POST request with a cat object
    Then the cat object is returned with an id attached


