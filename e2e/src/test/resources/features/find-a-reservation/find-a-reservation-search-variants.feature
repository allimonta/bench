@find-a-reservation
Feature: Find a reservation — search variants

  Background:
    Given the user is on the Partwerk shop page
    And a reservation of 3000 "Optic Sensor Array" pieces exists for "Acme Robotics" requested by "Ana Torres"
    And a reservation of 1000 "Servo Arm Assembly" pieces exists for "Nordic Drives" requested by "Lars Berg"
    When the user opens the reservation search
    Then the title "Find a reservation" is displayed
    And the reservation list title reads "All reservations (2)"
    And the first listed reservation is from "Nordic Drives"
    When Does a reservation match the search?

  @TC-FINDARESER-009 @P1 @regression @tg-cmwuqs8zt003f01sit39rbas9
  Scenario: TC-FINDARESER-009 Search by part of the company name in lower case — that reservation is listed
    When the user enters the reservation search "acme"
    And the user clicks the reservation search "Search" button
    Then the reservation list title says "1" of "2" reservations match "acme"
    And the reservation list shows only the "Acme Robotics" reservation

  @TC-FINDARESER-010 @P2 @regression @tg-cmwuqs9ac008u01tumi1prxrb
  Scenario: TC-FINDARESER-010 Search with a misspelled company name — no reservation matches
    When the user enters the reservation search "Acme Robotix"
    And the user clicks the reservation search "Search" button
    Then the reservation search reports no match for "Acme Robotix"
    And the reservation list shows no reservation

  @TC-FINDARESER-011 @P2 @regression @tg-cmwuqs9jr003g01sih53ua0xy
  Scenario: TC-FINDARESER-011 Search by number of pieces written with a dot — only the reservation with that quantity is listed
    When the user enters the reservation search "1.000"
    And the user clicks the reservation search "Search" button
    Then the reservation list title says "1" of "2" reservations match "1.000"
    And the reservation list shows only the "Nordic Drives" reservation
    And the listed "Nordic Drives" reservation shows "1,000" pieces

  @TC-FINDARESER-012 @P2 @regression @tg-cmwuqs9sw008v01tu6ks17m77
  Scenario: TC-FINDARESER-012 Search by number of pieces followed by a word — no reservation matches
    When the user enters the reservation search "1000 pieces"
    And the user clicks the reservation search "Search" button
    Then the reservation search reports no match for "1000 pieces"
    And the reservation list shows no reservation

  @TC-FINDARESER-013 @P2 @regression @tg-cmwuqsa22003h01siqyvtahek
  Scenario: TC-FINDARESER-013 Search by the start of the reservation code — every reservation is listed newest first
    When the user enters the reservation search "pwr-"
    And the user clicks the reservation search "Search" button
    Then the reservation list title says "2" of "2" reservations match "pwr-"
    And the first listed reservation is from "Nordic Drives"

  @TC-FINDARESER-014 @P2 @regression @tg-cmwuqsab2008w01tukqulo7fx
  Scenario: TC-FINDARESER-014 Search by the amount of a reservation — no reservation matches
    When the user enters the reservation search "$3,720,135.00"
    And the user clicks the reservation search "Search" button
    Then the reservation search reports no match for "$3,720,135.00"
    And the reservation list shows no reservation
