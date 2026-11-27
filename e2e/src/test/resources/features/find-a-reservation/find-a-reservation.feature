@find-a-reservation
Feature: Find a reservation

  Background:
    Given the user is on the Partwerk shop page
    And a reservation of 3000 "Optic Sensor Array" pieces exists for "Acme Robotics" requested by "Ana Torres"
    And a reservation of 1000 "Servo Arm Assembly" pieces exists for "Nordic Drives" requested by "Lars Berg"
    When the user opens the reservation search
    Then the title "Find a reservation" is displayed
    And the reservation list title reads "All reservations (2)"
    And the first listed reservation is from "Nordic Drives"
    When Does a reservation match the search?

  @TC-FINDARESER-001 @P1 @smoke @regression @tg-cmwupbyad005001tuxla8evsh
  Scenario: TC-FINDARESER-001 Search by company — only that reservation is listed
    When the user enters the reservation search "Acme Robotics"
    And the user clicks the reservation search "Search" button
    Then the reservation list title says "1" of "2" reservations match "Acme Robotics"
    And the reservation list shows only the "Acme Robotics" reservation
    And the listed "Acme Robotics" reservation shows "3,000" pieces
    And the listed "Acme Robotics" reservation shows the amount "$3,720,135.00"

  @TC-FINDARESER-002 @P1 @smoke @regression @tg-cmwupbyju002g01si5ezuessg
  Scenario: TC-FINDARESER-002 Search for an unknown company — no reservation matches
    When the user enters the reservation search "Zeta Motors"
    And the user clicks the reservation search "Search" button
    Then the reservation search reports no match for "Zeta Motors"
    And the reservation list shows no reservation
    And the reservation list title says "0" of "2" reservations match "Zeta Motors"

  @TC-FINDARESER-003 @P2 @regression @tg-cmwupbytu005101tu50yakw3s
  Scenario: TC-FINDARESER-003 Search by tracking code — only that reservation is listed
    When the user enters the code of the "Nordic Drives" reservation in the reservation search
    And the user clicks the reservation search "Search" button
    Then the reservation list shows only the "Nordic Drives" reservation
    And the listed "Nordic Drives" reservation shows the requester "Lars Berg"

  @TC-FINDARESER-004 @P2 @regression @tg-cmwupbz3g002h01siywu4m0uf
  Scenario: TC-FINDARESER-004 Search for an unknown tracking code — no reservation matches
    When the user enters the reservation search "PWR-NOTFOUND"
    And the user clicks the reservation search "Search" button
    Then the reservation search reports no match for "PWR-NOTFOUND"
    And the reservation list shows no reservation

  @TC-FINDARESER-005 @P2 @regression @tg-cmwupbzcj005201tukh5tvwo9
  Scenario: TC-FINDARESER-005 Search by number of pieces — only the reservation with that quantity is listed
    When the user enters the reservation search "3,000"
    And the user clicks the reservation search "Search" button
    Then the reservation list title says "1" of "2" reservations match "3,000"
    And the reservation list shows only the "Acme Robotics" reservation

  @TC-FINDARESER-006 @P2 @regression @tg-cmwupbzlc002i01sikubcm9p5
  Scenario: TC-FINDARESER-006 Search for a number of pieces no reservation has — no reservation matches
    When the user enters the reservation search "30,000"
    And the user clicks the reservation search "Search" button
    Then the reservation search reports no match for "30,000"
    And the reservation list shows no reservation

  @TC-FINDARESER-007 @P2 @regression @tg-cmwupbzuq005301tuxhkkc9u6
  Scenario: TC-FINDARESER-007 Show all after a search — every reservation is listed again
    When the user enters the reservation search "Nordic Drives"
    And the user clicks the reservation search "Search" button
    Then the reservation list title says "1" of "2" reservations match "Nordic Drives"
    When the user clicks the reservation search "Clear search" button
    Then the reservation list title reads "All reservations (2)"
    And the reservation search field is empty

  @TC-FINDARESER-008 @P2 @regression @tg-cmwupc03p002j01sivqdc465u
  Scenario: TC-FINDARESER-008 Search by requester name — no reservation matches
    When the user enters the reservation search "Ana Torres"
    And the user clicks the reservation search "Search" button
    Then the reservation search reports no match for "Ana Torres"
    And the reservation list shows no reservation
