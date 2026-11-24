@weird-names
Feature: Weird names

  Background:
    Given the user is on the Partwerk shop page

  @TC-WEIRDNAMES-001 @P1 @smoke @regression @tg-cmwunkn4g001u01si0kv4wx0h
  Scenario: TC-WEIRDNAMES-001 👻
    When the user opens the menu on a 375px wide viewport
    Then the navigation links are displayed

  @TC-WEIRDNAMES-002 @P2 @regression @tg-cmwunkn4f001t01si5jmp38zi
  Scenario: TC-WEIRDNAMES-002 Remove — the last part — with em dashes
    When the user enters 2500 pieces of "Servo Arm Assembly" in the reservation form
    Then the transport cost shows "$135.00"

  @TC-WEIRDNAMES-003 @P2 @regression @tg-cmwunkn4e001s01si5yhfudmw
  Scenario: TC-WEIRDNAMES-003 ../../etc/passwd
    When the user opens the reservation form and enters 999 pieces of "Optic Sensor Array"
    Then the total pieces show "999"

  @TC-WEIRDNAMES-004 @P2 @regression @tg-cmwunkn4c001r01sixhevxgz3
  Scenario: TC-WEIRDNAMES-004 Quotes "double" and 'single' in the title
    When the user places an order with the "Optic Sensor Array" part in the cart
    Then an order confirmation with an order reference is displayed

  @TC-WEIRDNAMES-005 @P2 @regression @tg-cmwunkn4b001q01sift2s5qtj
  Scenario: TC-WEIRDNAMES-005 pipe | separated | title
    When the user adds the "Servo Arm Assembly" part to the cart and increases its quantity
    Then the cart lists the "Servo Arm Assembly" part with quantity 2

  @TC-WEIRDNAMES-006 @P2 @regression @tg-cmwunkn4a001p01silbgzwu3f
  Scenario: TC-WEIRDNAMES-006 undefined
    When the user adds the "Optic Sensor Array" part to the cart and removes it
    Then the cart shows the message "Your cart is empty. Add a part from the catalog to start your build."

  @TC-WEIRDNAMES-007 @P2 @regression @tg-cmwunkn49001o01siyzn358gv
  Scenario: TC-WEIRDNAMES-007 null
    When the user clicks the "Shop parts" button in the banner
    Then the parts catalog section is shown

  @TC-WEIRDNAMES-008 @P2 @regression @tg-cmwunkn48001n01siw8rp03vx
  Scenario: TC-WEIRDNAMES-008 9854092687459867045986
    When the user adds the "Optic Sensor Array" part to the cart
    Then the cart counter shows "1"

  @TC-WEIRDNAMES-009 @P2 @regression @tg-cmwunkn47001m01siedo8sh17
  Scenario: TC-WEIRDNAMES-009 日本語のテスト名
    When the user opens the reservation form and presses Escape
    Then the reservation form is hidden

  @TC-WEIRDNAMES-010 @P2 @regression @tg-cmwunkn46001l01sivmkg4k96
  Scenario: TC-WEIRDNAMES-010 # looks like a comment
    When the user searches for a reservation with an empty field
    Then every reservation is listed

  @TC-WEIRDNAMES-011 @P2 @regression @tg-cmwunkn45001k01sixxalk0s6
  Scenario: TC-WEIRDNAMES-011 TC-VOLUME1-001
    When the user filters the catalog by "Power"
    Then only parts of the "Power" category are listed

  @TC-WEIRDNAMES-012 @P2 @regression @tg-cmwunkn43001j01sigl0lpt4q
  Scenario: TC-WEIRDNAMES-012 x
    When the user opens the cart and closes it with the close button
    Then the cart drawer is hidden

  @TC-WEIRDNAMES-013 @P2 @regression @tg-cmwunkn42001i01si4wnrs5rs
  Scenario: TC-WEIRDNAMES-013 Very long title aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    When the user opens the cart without adding parts
    Then the cart shows the empty-cart illustration

  @TC-WEIRDNAMES-014 @P2 @regression @tg-cmwunkn41001h01sioh8155cv
  Scenario: TC-WEIRDNAMES-014 @smoke looks like a tag
    When the user opens the reservation search with no reservations
    Then the message "No reservations yet." is displayed

  @TC-WEIRDNAMES-015 @P2 @regression @tg-cmwunkn3z001g01si6u2ozikh
  Scenario: TC-WEIRDNAMES-015 🛒🛒🛒 add to cart 🤖
    When the user adds the "Fusion Core Cell" part to the cart
    And the user opens the cart
    Then the cart lists the "Fusion Core Cell" part

  @TC-WEIRDNAMES-016 @P2 @regression @tg-cmwunkn3y001f01siyj9url5a
  Scenario: TC-WEIRDNAMES-016 test
    When the user filters the catalog by "Limbs"
    Then only parts of the "Limbs" category are listed

  @TC-WEIRDNAMES-017 @P2 @regression @tg-cmwunkn3w001e01si5jdx1vpk
  Scenario: TC-WEIRDNAMES-017 Ñandú añade piezas: ¿funciona con acentos?
    When the user filters the catalog by "Sensors"
    Then only parts of the "Sensors" category are listed

  @TC-WEIRDNAMES-018 @P2 @regression @tg-cmwunkn3v001d01sinq14hxkn
  Scenario: TC-WEIRDNAMES-018 !!!@@@###$$$%%%
    When the user adds the "Servo Arm Assembly" part to the cart twice
    Then the cart counter shows "2"

  @TC-WEIRDNAMES-019 @P2 @regression @tg-cmwunkn3u001c01si1m6h2gw0
  Scenario: TC-WEIRDNAMES-019 <script>alert('xss')</script>
    When the user opens the reservation form
    Then the title "Reserve parts" is displayed

  @TC-WEIRDNAMES-020 @P2 @regression @tg-cmwunkn3r001b01siu50oxf9u
  Scenario: TC-WEIRDNAMES-020 Scenario: nested keyword in the title
    When the user opens the reservation search
    Then the title "Find a reservation" is displayed
