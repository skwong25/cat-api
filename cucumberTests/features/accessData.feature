# feature/accessData.feature

# feature description follows the 'user story style'
Feature: Access data from the database  

    As a user of the API
    I want to be able to make a GET request
    So that I can access information stored in the database

Scenario: Retrieve cat detail information for GET by ID requests
    Given I run the node application
    When I make a GET request with <id> 
    Then I get cat information with correct <name> 

Examples:
    |    id      |     name            |   
    | jAWcE8ooF1 |   "Pancake"         |
    | uKVZvMxhLt |   "Frank"           |
    | gWyGbxF934 |  "Madame Floof"     |




