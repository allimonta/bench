@volume-1
Feature: Volume 1

  @TC-VOLUME1-001 @P2 @regression @tg-cmwtav40b01py01thpkd5j496 @fail @BUG-001
  Scenario: TC-VOLUME1-001 Invalid email is rejected at checkout
    When the user is on the checkout form
    And the user enters "user@invalid" in the email field and submits
    Then an "invalid email" error message is displayed

  @TC-VOLUME1-002 @P1 @smoke @regression @tg-cmwtav40a01px01thohanvcev @fail @BUG-002
  Scenario: TC-VOLUME1-002 Clear all filters
    When the user has applied a category filter
    And the user clicks "Clear filters"
    Then all products are displayed again

  @TC-VOLUME1-003 @P2 @regression @tg-cmwtav40401pu01thswyhgsru @fail @BUG-009
  Scenario: TC-VOLUME1-003 Cart total is calculated correctly
    When the user has added two different products to the cart
    And the user opens the cart
    Then the total equals the sum of both product prices

  @TC-VOLUME1-004 @P2 @regression @tg-cmwtav40201pt01thzuw3ybdu
  Scenario: TC-VOLUME1-004 Shop section loads with product listing
    When the user opens the Android parts shop page
    And the user navigates to the "Shop" section
    Then a list of products is displayed with name, image and price

  @TC-VOLUME1-005 @P2 @regression @tg-cmwtav40101ps01thz8u5bwz1
  Scenario: TC-VOLUME1-005 Remove a product from the cart
    When the user has one product in the cart
    And the user removes the product from the cart
    Then the cart is empty and the counter shows 0

  @TC-VOLUME1-006 @P2 @regression @tg-cmwtav3zz01pr01thdod1k8sb @fail @BUG-003
  Scenario: TC-VOLUME1-006 Out-of-stock product cannot be added to cart
    When a product is marked as "Out of stock"
    And the user views that product
    Then the "Add to cart" button is disabled

  @TC-VOLUME1-008 @P2 @regression @tg-cmwtav3zx01pq01theve3qo6t
  Scenario: TC-VOLUME1-008 Update product quantity in the cart
    When the user has a product in the cart with quantity 1
    And the user changes the quantity to 3
    Then the line subtotal updates to 3 times the unit price

  @TC-VOLUME1-009 @P2 @regression @tg-cmwtav40601pv01thvt1vdg2c
  Scenario: TC-VOLUME1-009 Checkout is blocked with an empty cart
    When the user's cart is empty
    And the user attempts to proceed to checkout
    Then the checkout is not allowed and an empty-cart message is shown

  @TC-VOLUME1-010 @P2 @regression @tg-cmwtav3zw01pp01thxk0wr54s @fail @BUG-004
  Scenario: TC-VOLUME1-010 Sort products by price ascending
    When the user is on the Shop section
    And the user sorts products by "Price: Low to High"
    Then products are displayed in ascending price order

  @TC-VOLUME1-011 @P2 @regression @tg-cmwtav3zu01po01th4nmtvr8l @fail @BUG-005
  Scenario: TC-VOLUME1-011 Filter products by category
    When the user is on the Shop section
    And the user selects the "Screens" category filter
    Then only products from the "Screens" category are displayed

  @TC-VOLUME1-012 @P2 @regression @tg-cmwtav3zs01pn01thma1i7a3u @fail @BUG-006
  Scenario: TC-VOLUME1-012 Search with no results
    When the user is on the Shop section
    And the user searches for "xyz123"
    Then a "no products found" message is displayed

  @TC-VOLUME1-013 @P2 @regression @tg-cmwtav3zr01pm01th1jhhri4c @fail @BUG-006
  Scenario: TC-VOLUME1-013 Search for an existing product
    When the user is on the Shop section
    And the user searches for "battery"
    Then only products matching "battery" are displayed

  @TC-VOLUME1-014 @P2 @regression @tg-cmwtav3zp01pl01thmrcdkc0p
  Scenario: TC-VOLUME1-014 Add a product to the cart
    When the user is on the Shop section
    And the user clicks "Add to cart" on a product
    Then the cart counter increases by 1

  @TC-VOLUME1-017 @P2 @regression @tg-cmwtav3zk01pi01thx5a0ctwm @fail @BUG-007
  Scenario: TC-VOLUME1-017 View product details
    When the user is on the Shop section
    And the user clicks on a product name
    Then the product detail view shows description, price and compatibility info

  @TC-VOLUME1-018 @P2 @regression @tg-cmwtav3zh01ph01thsd7k0p64
  Scenario: TC-VOLUME1-018 Add the same product twice increases quantity
    When the user has a product in the cart
    And the user clicks "Add to cart" on the same product again
    Then the cart shows that product with quantity 2

  @TC-VOLUME1-019 @P2 @regression @tg-cmwtav3z501pg01th5py3lr6h @fail @BUG-010
  Scenario: TC-VOLUME1-019 Quantity cannot be set below 1
    When the user has a product in the cart
    And the user tries to set the quantity to 0
    Then the quantity remains at 1 or the product is removed with a confirmation

  @TC-VOLUME1-020 @P2 @regression @tg-cmwtav40m01q401thiibss4jc
  Scenario: TC-VOLUME1-020 Cart persists after page reload
    When the user has added a product to the cart
    And the user reloads the page
    Then the product is still in the cart

  @TC-VOLUME1-022 @P2 @regression @tg-cmwtav40j01q201thrc4a1dyt @fail @BUG-001
  Scenario: TC-VOLUME1-022 Checkout form requires all mandatory fields
    When the user has a product in the cart and is on the checkout form
    And the user submits the form with empty required fields
    Then an error message is displayed for each missing field

  @TC-VOLUME1-023 @P2 @regression @tg-cmwtav40h01q101th7a0qp1mj @fail @BUG-008
  Scenario: TC-VOLUME1-023 Apply an invalid discount code
    When the user has products in the cart
    And the user applies the discount code "FAKECODE"
    Then an "invalid code" message is displayed and the total remains unchanged

  @TC-VOLUME1-024 @P2 @regression @tg-cmwtav40f01q001th1e5a2rel @fail @BUG-008
  Scenario: TC-VOLUME1-024 Apply a valid discount code
    When the user has products in the cart
    And the user applies the discount code "SAVE10"
    Then the total is reduced by 10 percent

  @TC-VOLUME1-025 @P2 @regression @tg-cmwtav40d01pz01thnf8glmmy
  Scenario: TC-VOLUME1-025 Navigation menu links scroll to the correct section
    When the user is on the home section of the page
    And the user clicks the "Shop" link in the navigation menu
    Then the page scrolls to the Shop section and the URL ends with "#shop"
