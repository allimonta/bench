@cart-volume-discount
Feature: Cart volume discount

  Background:
    Given the user is on the Partwerk shop page
    Then the cart counter shows "0"
    When Does the cart hold 3 or more parts?

  @TC-CARTVOLUME-001 @P1 @smoke @regression @tg-cmwv22e0400fj01tu20hc2fpm @fail @BUG-012
  Scenario: TC-CARTVOLUME-001 Three different parts in the cart — the volume discount is applied
    When the user fills the cart with "Optic Sensor Array, Dexterous Hand Unit, Vocal Synth Module"
    Then the cart counter shows "3"
    When the user opens the cart
    Then the cart subtotal is "$4,280"
    And the cart shows a volume discount of "$214"
    And the cart shipping is "$150"
    And the cart total is "$4,216"
    And the cart volume discount note reads "Volume discount applied: 5% off for 3 or more parts."

  @TC-CARTVOLUME-002 @P1 @regression @tg-cmwv22eav014o01sieu53p5sa
  Scenario: TC-CARTVOLUME-002 Two different parts in the cart — no volume discount
    When the user fills the cart with "Servo Arm Assembly, Dexterous Hand Unit"
    Then the cart counter shows "2"
    When the user opens the cart
    Then the cart subtotal is "$5,630"
    And the cart does not show a volume discount
    And the cart shipping is "$150"
    And the cart total is "$5,780"
    And the cart volume discount note reads "Add 1 more part to get 5% off."

  @TC-CARTVOLUME-003 @P1 @regression @tg-cmwv22ek200fk01tuarrw39nt @fail @BUG-012
  Scenario: TC-CARTVOLUME-003 One part with quantity 3 — the volume discount is applied
    When the user fills the cart with "Fusion Core Cell"
    Then the cart counter shows "1"
    When the user opens the cart
    Then the cart lists the "Fusion Core Cell" part with quantity 1
    When the user increases the quantity of the "Fusion Core Cell" part in the cart
    Then the cart lists the "Fusion Core Cell" part with quantity 2
    When the user increases the quantity of the "Fusion Core Cell" part in the cart
    Then the cart lists the "Fusion Core Cell" part with quantity 3
    And the cart subtotal is "$17,700"
    And the cart shows a volume discount of "$885"
    And the cart shipping is "Free"
    And the cart total is "$16,815"
    And the cart volume discount note reads "Volume discount applied: 5% off for 3 or more parts."

  @TC-CARTVOLUME-004 @P1 @regression @tg-cmwv22et0014p01sidauieoj9
  Scenario: TC-CARTVOLUME-004 One part with quantity 2 — no volume discount
    When the user fills the cart with "Neural Processor"
    Then the cart counter shows "1"
    When the user opens the cart
    Then the cart lists the "Neural Processor" part with quantity 1
    When the user increases the quantity of the "Neural Processor" part in the cart
    Then the cart lists the "Neural Processor" part with quantity 2
    And the cart subtotal is "$15,600"
    And the cart does not show a volume discount
    And the cart shipping is "Free"
    And the cart total is "$15,600"
    And the cart volume discount note reads "Add 1 more part to get 5% off."

  @TC-CARTVOLUME-005 @P1 @regression @tg-cmwv22f2u00fl01tuzdd9g1ao @fail @BUG-012
  Scenario: TC-CARTVOLUME-005 Four parts in the cart — the volume discount is rounded to the dollar
    When the user fills the cart with "Hydraulic Leg Module, Optic Sensor Array, Servo Arm Assembly, Vocal Synth Module"
    Then the cart counter shows "4"
    When the user opens the cart
    Then the cart subtotal is "$9,930"
    And the cart shows a volume discount of "$497"
    And the cart shipping is "$150"
    And the cart total is "$9,583"
    And the cart volume discount note reads "Volume discount applied: 5% off for 3 or more parts."

  @TC-CARTVOLUME-006 @P1 @regression @tg-cmwv22fca014q01si046klnos
  Scenario: TC-CARTVOLUME-006 One part in the cart — the note asks for 2 more parts
    When the user fills the cart with "Torso Chassis Frame"
    Then the cart counter shows "1"
    When the user opens the cart
    Then the cart subtotal is "$6,450"
    And the cart does not show a volume discount
    And the cart shipping is "$150"
    And the cart total is "$6,600"
    And the cart volume discount note reads "Add 2 more parts to get 5% off."
