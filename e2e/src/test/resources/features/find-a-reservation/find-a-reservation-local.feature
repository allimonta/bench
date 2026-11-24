@find-a-reservation @local
Feature: Find a reservation — local tests
  Tests written by hand in the framework only (not in TestGraph).

  @LOCAL-FIND-001
  Scenario: LOCAL-FIND-001 Find button is shown next to the Reserve button
    Given the user is on the Partwerk shop page
    Then a "Find" button is displayed next to the "Reserve" button

  @LOCAL-FIND-002
  Scenario: LOCAL-FIND-002 Escape closes the reservation search
    Given the user is on the Partwerk shop page
    When the user opens the reservation search
    And the user presses Escape in the reservation search
    Then the reservation search is closed
    And the keyboard focus is on the header "Find" button

  @LOCAL-FIND-003
  Scenario: LOCAL-FIND-003 Search by pieces written with a thousands separator
    Given the user is on the Partwerk shop page
    And a reservation of 3000 "Optic Sensor Array" pieces exists for "Acme Robotics" requested by "Ana Torres"
    And a reservation of 1000 "Servo Arm Assembly" pieces exists for "Nordic Drives" requested by "Lars Berg"
    When the user opens the reservation search
    And the user enters the reservation search "3,000"
    And the user clicks the reservation search "Search" button
    Then the reservation list shows only the "Acme Robotics" reservation
    And the listed "Acme Robotics" reservation shows "3,000" pieces
