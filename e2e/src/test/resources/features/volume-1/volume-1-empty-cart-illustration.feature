@volume-1
Feature: Volume 1 — empty cart illustration

  Background:
    Given the user is on the Partwerk shop page
    Then the cart counter shows "0"
    When Does the cart end up empty?

  @TC-VOLUME1-026 @P1 @smoke @regression @tg-cmwts89j703ff01thjl12xkpz
  Scenario: TC-VOLUME1-026 Open an empty cart — empty-cart illustration shown
    When the user opens the cart
    Then the cart shows the message "Your cart is empty. Add a part from the catalog to start your build."
    And the cart shows the empty-cart illustration

  @TC-VOLUME1-027 @P2 @regression @tg-cmwts89v803yq01szcacaf505
  Scenario: TC-VOLUME1-027 Open a cart with a part — no empty-cart illustration
    When the user adds the "Fusion Core Cell" part to the cart
    Then the cart counter shows "1"
    When the user opens the cart
    Then the cart lists the "Fusion Core Cell" part
    And the cart does not show the empty-cart illustration

  @TC-VOLUME1-028 @P1 @regression @tg-cmwts8a3n03fg01ths032qo5g
  Scenario: TC-VOLUME1-028 Remove the last part — empty-cart illustration shown
    When the user adds the "Optic Sensor Array" part to the cart
    Then the cart counter shows "1"
    When the user opens the cart
    Then the cart lists the "Optic Sensor Array" part
    When the user removes the "Optic Sensor Array" part from the cart
    Then the cart shows the message "Your cart is empty. Add a part from the catalog to start your build."
    And the cart shows the empty-cart illustration

  @TC-VOLUME1-029 @P2 @regression @tg-cmwts8adb03yr01szfe2ukuup
  Scenario: TC-VOLUME1-029 Remove one of two parts — no empty-cart illustration
    When the user adds the "Servo Arm Assembly" part to the cart
    Then the cart counter shows "1"
    When the user adds the "Hydraulic Leg Module" part to the cart
    Then the cart counter shows "2"
    When the user opens the cart
    Then the cart lists the "Servo Arm Assembly" part
    When the user removes the "Servo Arm Assembly" part from the cart
    Then the cart does not list the "Servo Arm Assembly" part
    And the cart lists the "Hydraulic Leg Module" part
    And the cart does not show the empty-cart illustration
