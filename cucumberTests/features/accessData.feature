# feature/accessData.feature

# feature description follows the 'user story style'
Feature: Access data from the database  

    As a cat fanatic
    I want to access information stored in the database
    So that I can read details of data on a specific cat

Scenario: Retrieve cat detail information for GET by ID requests
    Given I run the node application
    When I make a GET request with <id> 
    Then I get cat information with correct <name> 

Examples:
    |    id      |     name            |   
    | jAWcE8ooF1 |   "Pancake"         |
    | uKVZvMxhLt |   "Frank"           |
    | gWyGbxF934 |  "Madame Floof"     |




