@blank-reservation-search-hint
Feature: Blank reservation search hint

  Background:
    Given the user is on the Partwerk shop page
    And a reservation of 3000 "Optic Sensor Array" pieces exists for "Acme Robotics" requested by "Ana Torres"
    And a reservation of 1000 "Servo Arm Assembly" pieces exists for "Nordic Drives" requested by "Lars Berg"
    When the user opens the reservation search
    Then the reservation list title reads "All reservations (2)"
    And the reservation search shows no message
    When What is in the reservation search field?

  @TC-BLANKRESER-001 @P1 @smoke @regression @tg-cmwwb3l0e000101nsuwbx023f
  Scenario: TC-BLANKRESER-001 Search for a company — no search hint is shown
    When the user enters the reservation search "Acme Robotics"
    And the user clicks the reservation search "Search" button
    Then the reservation list title says "1" of "2" reservations match "Acme Robotics"
    And the reservation search shows no message

  @TC-BLANKRESER-002 @P2 @regression @tg-cmwwb3lci000001ns1qjy3ty7
  Scenario: TC-BLANKRESER-002 Search with only spaces — the search hint is shown
    When the user enters the reservation search "   "
    And the user clicks the reservation search "Search" button
    Then the message "Type a reservation code, company or number of pieces to search." is displayed
    And the reservation list title reads "All reservations (2)"

  @TC-BLANKRESER-003 @P3 @edge @regression @tg-cmwwb3llw000201ns0t1jd08u
  Scenario: TC-BLANKRESER-003 Search with an empty field — no search hint is shown
    When the user clicks the reservation search "Search" button
    Then the reservation list title reads "All reservations (2)"
    And the reservation search shows no message
