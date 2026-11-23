@bulk-parts-reservation
Feature: Bulk parts reservation

  Background:
    Given the user opens the Android parts shop page
    When the user clicks the header "Reserve" button
    Then the "Reserve parts" panel is shown
    When the user enters the company "Acme Robotics"
    And the user enters the first name "Ada"
    And the user enters the last name "Lovelace"
    And Is the reservation accepted?

  @TC-BULKPARTS-001 @P1 @smoke @regression @tg-cmwth1r30033l01sz4m5jp1sq
  Scenario: TC-BULKPARTS-001 Reserve 1,000 pieces of one part — reservation confirmed
    When the user enters the "Optic Sensor Array" reserved quantity "1000"
    Then the reservation total pieces reads "1,000"
    And the reservation transport cost reads "$45.00"
    When the user enters the confirmation email "buyer@acme-robotics.com"
    And the user chooses the payment method "Credit card"
    And the user clicks the reservation form "Reserve" button
    Then the "Parts reserved" confirmation is shown
    And the confirmation shows a tracking number starting with "PWR-"
    And the reservation status reads "Awaiting payment"
    And the confirmation says the details were sent to "buyer@acme-robotics.com"

  @TC-BULKPARTS-002 @P1 @regression @tg-cmwth1rgg02rd01thufl64819
  Scenario: TC-BULKPARTS-002 Reserve 999 pieces — below the 1,000 minimum is rejected
    When the user enters the "Optic Sensor Array" reserved quantity "999"
    Then the reservation total pieces reads "999"
    When the user enters the confirmation email "buyer@acme-robotics.com"
    And the user chooses the payment method "Credit card"
    And the user clicks the reservation form "Reserve" button
    Then the reservation form shows the error "A reservation needs at least 1,000 pieces in total (now 999)."
    And the reservation form is shown

  @TC-BULKPARTS-003 @P1 @regression @tg-cmwth1rx5033m01sz2oprn10o
  Scenario: TC-BULKPARTS-003 Reserve a mix of parts — transport charged per started 1,000 pieces
    When the user enters the "Servo Arm Assembly" reserved quantity "600"
    And the user enters the "Dexterous Hand Unit" reserved quantity "650"
    Then the reservation total pieces reads "1,250"
    And the reservation transport cost reads "$90.00"
    When the user enters the confirmation email "orders@acme-robotics.com"
    And the user chooses the payment method "Bank transfer"
    And the user clicks the reservation form "Reserve" button
    Then the "Parts reserved" confirmation is shown
    And the email sent lists the part "600 × Servo Arm Assembly"
    And the email sent lists the part "650 × Dexterous Hand Unit"
    And the email sent shows the transport cost "$90.00"
    And the email sent shows the payment method "Bank transfer"

  @TC-BULKPARTS-004 @P1 @regression @tg-cmwth1s6w02re01thui89j3rq
  Scenario: TC-BULKPARTS-004 Reserve with an invalid email — reservation rejected
    When the user enters the "Hydraulic Leg Module" reserved quantity "1200"
    Then the reservation total pieces reads "1,200"
    When the user enters the confirmation email "orders@acme-robotics"
    And the user chooses the payment method "Bank transfer"
    And the user clicks the reservation form "Reserve" button
    Then the reservation form shows the error "Enter a valid email address."
    And the reservation form is shown

  @TC-BULKPARTS-005 @P1 @regression @tg-cmwth1sgl033n01szwhag02mo
  Scenario: TC-BULKPARTS-005 Reserve 2,000 pieces paid by check — another reservation can be started
    When the user enters the "Neural Processor" reserved quantity "2000"
    Then the reservation total pieces reads "2,000"
    And the reservation transport cost reads "$90.00"
    When the user enters the confirmation email "buyer@acme-robotics.com"
    And the user chooses the payment method "Check"
    And the user clicks the reservation form "Reserve" button
    Then the "Parts reserved" confirmation is shown
    And the email sent shows the total pieces "2,000"
    And the email sent shows the payment method "Check"
    When the user clicks the confirmation "Make another reservation" button
    Then the reservation form is shown
    And the reservation total pieces reads "0"

  @TC-BULKPARTS-006 @P1 @regression @tg-cmwth1sqv02rf01th1azb336h
  Scenario: TC-BULKPARTS-006 Reserve without a payment method — reservation rejected
    When the user enters the "Vocal Synth Module" reserved quantity "1000"
    Then the reservation total pieces reads "1,000"
    When the user enters the confirmation email "buyer@acme-robotics.com"
    And the user clicks the reservation form "Reserve" button
    Then the reservation form shows the error "Choose a payment method."
    And the reservation form is shown

  @TC-BULKPARTS-007 @P2 @edge @regression @tg-cmwth1t0p033o01sz7d5b4jmm
  Scenario: TC-BULKPARTS-007 Reserve a fractional quantity — whole numbers required
    When the user enters the "Fusion Core Cell" reserved quantity "1000.5"
    And the user enters the confirmation email "buyer@acme-robotics.com"
    And the user chooses the payment method "Credit card"
    And the user clicks the reservation form "Reserve" button
    Then the reservation form shows the error "Quantities must be whole numbers of 0 or more."
    And the reservation form is shown
