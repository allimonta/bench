@clear-reservation-search
Feature: Clear reservation search

  Background:
    Given the user is on the Partwerk shop page
    And a reservation of 3000 "Optic Sensor Array" pieces exists for "Acme Robotics" requested by "Ana Torres"
    And a reservation of 1000 "Servo Arm Assembly" pieces exists for "Nordic Drives" requested by "Lars Berg"
    When the user opens the reservation search
    Then the reservation list title reads "All reservations (2)"
    And the reservation search "Clear search" button is not shown
    When Does the search field hold a search term?

  @TC-CLEARRESE-001 @P1 @smoke @regression @tg-cmwv3o0at00gn01tusz00ilva
  Scenario: TC-CLEARRESE-001 Search for a company — the Clear search button is shown
    When the user enters the reservation search "Acme Robotics"
    And the user clicks the reservation search "Search" button
    Then the reservation list title says "1" of "2" reservations match "Acme Robotics"
    And the reservation search "Clear search" button is shown
    When the user clicks the reservation search "Clear search" button
    Then the reservation list title reads "All reservations (2)"
    And the reservation search "Clear search" button is not shown

  @TC-CLEARRESE-002 @P2 @regression @tg-cmwv3o0kk01di01sih6klateg
  Scenario: TC-CLEARRESE-002 Search with only spaces — the Clear search button stays hidden
    When the user enters the reservation search "   "
    And the user clicks the reservation search "Search" button
    Then the reservation list title reads "All reservations (2)"
    And the reservation search "Clear search" button is not shown
