@reserve-parts-manual-cases
Feature: Reserve parts manual cases

  Background:
    Given the user is on the Partwerk shop page

  @TC-RESERVEPAR-001 @P1 @smoke @regression @tg-cmwtipgum02yh01th5ou0houd
  Scenario: TC-RESERVEPAR-001 Payment by credit card is shown in the email
    When the user reserves 1000 "Fusion Core Cell" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Credit card"
    Then the email sent shows the payment method "Credit card"

  @TC-RESERVEPAR-002 @P2 @regression @tg-cmwtipguk02yg01thldgkso9z
  Scenario: TC-RESERVEPAR-002 Payment by bank transfer is shown in the email
    When the user reserves 1000 "Fusion Core Cell" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    Then the email sent shows the payment method "Bank transfer"

  @TC-RESERVEPAR-003 @P2 @regression @tg-cmwtipgui02yf01thvr9kdbjl
  Scenario: TC-RESERVEPAR-003 Payment by check is shown in the email
    When the user reserves 1000 "Fusion Core Cell" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Check"
    Then the email sent shows the payment method "Check"

  @TC-RESERVEPAR-004 @P2 @regression @tg-cmwtipguh02ye01th5klfcizy
  Scenario: TC-RESERVEPAR-004 Names with accents are kept as typed
    When the user reserves 1000 "Optic Sensor Array" as "José" "Pérez Núñez" of "Ingeniería Andina" with email "jose.perez@andina.example" paying by "Check"
    Then the email sent shows the requester "José Pérez Núñez" and the company "Ingeniería Andina"

  @TC-RESERVEPAR-005 @P2 @regression @tg-cmwtipguf02yd01thyeisn6k1
  Scenario: TC-RESERVEPAR-005 Exactly 1,000 pieces is accepted
    When the user reserves 1000 "Neural Processor" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Check"
    Then the reservation is confirmed with a tracking number

  @TC-RESERVEPAR-007 @P2 @regression @tg-cmwtipgub02yb01thu060c3iu
  Scenario: TC-RESERVEPAR-007 Reopening after a reservation shows an empty form
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    And the user closes the reservation form and opens it again
    Then an empty reservation form is displayed

  @TC-RESERVEPAR-008 @P2 @regression @tg-cmwtipgu902ya01thly5kt1ji
  Scenario: TC-RESERVEPAR-008 Reserving parts does not change the cart
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    And the user closes the reservation form
    Then the cart counter still shows "0"

  @TC-RESERVEPAR-009 @P2 @regression @tg-cmwtipgu802y901thvcmp2wru
  Scenario: TC-RESERVEPAR-009 Confirmation says where the email was sent
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    Then the confirmation says "We sent the reservation details and the tracking number to ana.torres@acme.example."

  @TC-RESERVEPAR-010 @P2 @regression @tg-cmwtipgu602y801th1dtih10i
  Scenario: TC-RESERVEPAR-010 Email is addressed to the requester with the tracking number in the subject
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    Then the email sent is to "ana.torres@acme.example" with the subject "Partwerk reservation" followed by the tracking number

  @TC-RESERVEPAR-011 @P2 @regression @tg-cmwtipgu502y701thc8m156m7
  Scenario: TC-RESERVEPAR-011 Shipment is on hold until the payment is completed
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    Then the confirmation says "The shipment is not sent until the payment is completed."

  @TC-RESERVEPAR-012 @P2 @regression @tg-cmwtipgu302y601thiq7wrqf5
  Scenario: TC-RESERVEPAR-012 New reservation is awaiting payment
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    Then the reservation status is "Awaiting payment"

  @TC-RESERVEPAR-013 @P2 @regression @tg-cmwtipgu202y501th5cbqpfhy
  Scenario: TC-RESERVEPAR-013 Two reservations get different tracking numbers
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    And the user makes another reservation of 1000 "Servo Arm Assembly" with the same requester
    Then the second tracking number is different from the first

  @TC-RESERVEPAR-014 @P2 @regression @tg-cmwtipgu002y401th5pxfpz89
  Scenario: TC-RESERVEPAR-014 Tracking number has the PWR format
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    Then the tracking number is "PWR-" followed by 8 uppercase letters or digits

  @TC-RESERVEPAR-015 @P2 @regression @tg-cmwtipgtz02y301th1nf37kwb
  Scenario: TC-RESERVEPAR-015 Reservation confirmation texts are spelled as approved
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "Acme Robotics" with email "ana.torres@acme.example" paying by "Bank transfer"
    Then the confirmation reads "Parts reserved", "Tracking number", "Make another reservation" and the email section reads "Email sent"

  @TC-RESERVEPAR-016 @P2 @regression @tg-cmwtipgty02y201thv9bx14rm
  Scenario: TC-RESERVEPAR-016 Company with HTML is shown as plain text
    When the user reserves 1000 "Optic Sensor Array" as "Ana" "Torres" of "<b>Acme</b>" with email "ana.torres@acme.example" paying by "Check"
    Then the email sent shows the company as the literal text "<b>Acme</b>"

  @TC-RESERVEPAR-017 @P2 @regression @tg-cmwtipgtw02y101th5gkdjo65
  Scenario: TC-RESERVEPAR-017 Clearing every quantity returns the totals to zero
    When the user opens the reservation form
    And the user enters 600 "Optic Sensor Array" and 600 "Servo Arm Assembly"
    And the user clears every quantity
    Then "Total pieces" shows "0" and "Transport cost" shows "$0.00" after clearing

  @TC-RESERVEPAR-018 @P2 @regression @tg-cmwtipgtv02y001the5ysj5y4
  Scenario: TC-RESERVEPAR-018 Part set to zero is left out of the email
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array" and 0 "Servo Arm Assembly"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Check"
    And the user submits the reservation
    Then the email sent does not list "Servo Arm Assembly"

  @TC-RESERVEPAR-019 @P2 @regression @tg-cmwtipgtt02xz01thj3rytym7
  Scenario: TC-RESERVEPAR-019 Clearing a part removes it from the totals and from the email
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array" and 300 "Servo Arm Assembly"
    And the user clears the "Servo Arm Assembly" quantity
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Check"
    And the user submits the reservation
    Then the email sent lists only "1,000 × Optic Sensor Array"

  @TC-RESERVEPAR-020 @P2 @regression @tg-cmwtipgts02xy01th4v2bbalr
  Scenario: TC-RESERVEPAR-020 Decreasing a quantity below a thousand recalculates the transport cost
    When the user opens the reservation form
    And the user enters 2000 "Neural Processor"
    And the user changes the "Neural Processor" quantity to 999
    Then "Total pieces" shows "999" and "Transport cost" shows "$45.00"

  @TC-RESERVEPAR-021 @P2 @regression @tg-cmwtipgtq02xx01thalmh4l4l
  Scenario: TC-RESERVEPAR-021 Increasing a quantity updates the transport cost
    When the user opens the reservation form
    And the user enters 1000 "Neural Processor"
    And the user changes the "Neural Processor" quantity to 2500
    Then "Total pieces" shows "2,500" and "Transport cost" shows "$135.00"

  @TC-RESERVEPAR-022 @P2 @regression @tg-cmwtipgto02xw01thww8r5330
  Scenario: TC-RESERVEPAR-022 Quantities of several parts are added together
    When the user opens the reservation form
    And the user enters 700 "Optic Sensor Array", 400 "Servo Arm Assembly" and 300 "Fusion Core Cell"
    Then "Total pieces" shows "1,400" and "Transport cost" shows "$90.00" for the three parts

  @TC-RESERVEPAR-023 @P2 @regression @tg-cmwtipgtn02xv01thb959apc9
  Scenario: TC-RESERVEPAR-023 Typing a quantity updates the totals
    When the user opens the reservation form
    And the user enters 1500 "Dexterous Hand Unit"
    Then "Total pieces" shows "1,500" and "Transport cost" shows "$90.00"

  @TC-RESERVEPAR-024 @P2 @regression @tg-cmwtipgtl02xu01thcw8igsls
  Scenario: TC-RESERVEPAR-024 Focus moves to the close button when the form opens
    When the user opens the reservation form
    Then the keyboard focus is on the close button of the reservation form

  @TC-RESERVEPAR-025 @P2 @regression @tg-cmwtipgti02xt01thraemhd5k
  Scenario: TC-RESERVEPAR-025 Reservation form closes with the Escape key
    When the user opens the reservation form
    And the user presses Escape
    Then the reservation form is hidden after Escape

  @TC-RESERVEPAR-026 @P2 @regression @tg-cmwtipgtg02xs01th9hwsx33l
  Scenario: TC-RESERVEPAR-026 Reservation form closes when clicking outside it
    When the user opens the reservation form
    And the user clicks outside the reservation form
    Then the reservation form is hidden after the outside click

  @TC-RESERVEPAR-027 @P2 @regression @tg-cmwtipgtf02xr01thkcuzx1iq
  Scenario: TC-RESERVEPAR-027 Reservation form closes with the close button
    When the user opens the reservation form
    And the user clicks the close button of the reservation form
    Then the reservation form is hidden

  @TC-RESERVEPAR-028 @P2 @regression @tg-cmwtipgtd02xq01thmgmv6gw7
  Scenario: TC-RESERVEPAR-028 Email repeats the totals of the form
    When the user opens the reservation form
    And the user enters 2500 "Neural Processor"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Check"
    And the user submits the reservation
    Then the email sent shows total pieces "2,500" and transport cost "$135.00"

  @TC-RESERVEPAR-029 @P2 @regression @tg-cmwtipgtb02xp01thrtm7zo58
  Scenario: TC-RESERVEPAR-029 Email lists only the parts with a quantity
    When the user opens the reservation form
    And the user enters 1500 "Optic Sensor Array" and 500 "Vocal Synth Module"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Credit card"
    And the user submits the reservation
    Then the email sent lists "1,500 × Optic Sensor Array" and "500 × Vocal Synth Module" and no other part

  @TC-RESERVEPAR-030 @P2 @regression @tg-cmwtipgt902xo01theto9dgqj
  Scenario: TC-RESERVEPAR-030 Empty quantity fields count as zero
    When the user opens the reservation form
    And the user enters 1200 "Fusion Core Cell" and leaves every other part empty
    Then "Total pieces" shows "1,200" and "Transport cost" shows "$90.00"

  @TC-RESERVEPAR-031 @P2 @regression @tg-cmwtipgt802xn01thj4ey53zv
  Scenario: TC-RESERVEPAR-031 Quantity with leading zeros is read as a number
    When the user opens the reservation form
    And the user enters 01000 "Hydraulic Leg Module"
    Then "Total pieces" shows "1,000" for the quantity with leading zeros

  @TC-RESERVEPAR-032 @P2 @regression @tg-cmwtipgt602xm01thjoluw714
  Scenario: TC-RESERVEPAR-032 One million pieces are formatted with thousands separators
    When the user opens the reservation form
    And the user enters 1000000 "Torso Chassis Frame"
    Then "Total pieces" shows "1,000,000" and "Transport cost" shows "$45,000.00"

  @TC-RESERVEPAR-033 @P2 @regression @tg-cmwtipgt402xl01thsg90893n
  Scenario: TC-RESERVEPAR-033 1,000 pieces reached by combining two parts is accepted
    When the user opens the reservation form
    And the user enters 500 "Optic Sensor Array" and 500 "Servo Arm Assembly"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Credit card"
    And the user submits the reservation
    Then the reservation of 1,000 combined pieces is confirmed

  @TC-RESERVEPAR-034 @P2 @regression @tg-cmwtipgt202xk01thgc58ujm4
  Scenario: TC-RESERVEPAR-034 Transport for 2,001 pieces is 135 dollars
    When the user opens the reservation form
    And the user enters 2001 "Vocal Synth Module"
    Then "Total pieces" shows "2,001" and "Transport cost" shows "$135.00"

  @TC-RESERVEPAR-035 @P2 @regression @tg-cmwtipgt002xj01thhx03zekp
  Scenario: TC-RESERVEPAR-035 Transport for 2,000 pieces is 90 dollars
    When the user opens the reservation form
    And the user enters 2000 "Vocal Synth Module"
    Then "Total pieces" shows "2,000" and "Transport cost" shows "$90.00"

  @TC-RESERVEPAR-036 @P2 @regression @tg-cmwtipgsz02xi01thqdmy3ftt
  Scenario: TC-RESERVEPAR-036 Transport for 1,001 pieces is 90 dollars
    When the user opens the reservation form
    And the user enters 1001 "Vocal Synth Module"
    Then "Total pieces" shows "1,001" and "Transport cost" shows "$90.00"

  @TC-RESERVEPAR-037 @P2 @regression @tg-cmwtipgsx02xh01thy71kti4r
  Scenario: TC-RESERVEPAR-037 Transport for 1,000 pieces is 45 dollars
    When the user opens the reservation form
    And the user enters 1000 "Vocal Synth Module"
    Then "Total pieces" shows "1,000" and "Transport cost" shows "$45.00"

  @TC-RESERVEPAR-038 @P2 @regression @tg-cmwtipgsv02xg01tht9ij5sjk
  Scenario: TC-RESERVEPAR-038 999 pieces is rejected
    When the user opens the reservation form
    And the user enters 999 "Neural Processor"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Check"
    And the user submits the reservation
    Then the error "A reservation needs at least 1,000 pieces in total (now 999)." is displayed

  @TC-RESERVEPAR-039 @P2 @regression @tg-cmwtipgst02xf01th2zle2fsp
  Scenario: TC-RESERVEPAR-039 Reservation is submitted with the Enter key
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Bank transfer"
    And the user presses Enter in the email field
    Then the reservation is confirmed after pressing Enter

  @TC-RESERVEPAR-040 @P2 @regression @tg-cmwtipgss02xe01th5tiogl3k
  Scenario: TC-RESERVEPAR-040 Email with a one-letter domain ending is rejected
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana@acme.c" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "Enter a valid email address." is displayed for the one-letter domain

  @TC-RESERVEPAR-041 @P2 @regression @tg-cmwtipgsq02xd01thori3gz80
  Scenario: TC-RESERVEPAR-041 Last name is required
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "Acme Robotics", "Ana", "", "ana.torres@acme.example" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "Last name is required." is displayed

  @TC-RESERVEPAR-042 @P2 @regression @tg-cmwtipgso02xc01th0df93mn4
  Scenario: TC-RESERVEPAR-042 First name is required
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "Acme Robotics", "", "Torres", "ana.torres@acme.example" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "First name is required." is displayed

  @TC-RESERVEPAR-043 @P2 @regression @tg-cmwtipgsn02xb01th14hhx1ks
  Scenario: TC-RESERVEPAR-043 Company is required
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "", "Ana", "Torres", "ana.torres@acme.example" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "Company is required." is displayed

  @TC-RESERVEPAR-044 @P2 @regression @tg-cmwtipgsl02xa01thqn331fg7
  Scenario: TC-RESERVEPAR-044 Company with only spaces is treated as empty
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "   ", "Ana", "Torres", "ana.torres@acme.example" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "Company is required." is displayed for the blank company

  @TC-RESERVEPAR-045 @P2 @regression @tg-cmwtipgsj02x901thcdimcw0h
  Scenario: TC-RESERVEPAR-045 Payment method is required
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and no payment method
    And the user submits the reservation
    Then the error "Choose a payment method." is displayed

  @TC-RESERVEPAR-046 @P2 @regression @tg-cmwtipgsh02x801th7yvuxhgw
  Scenario: TC-RESERVEPAR-046 Email without a full domain is rejected
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana@acme" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "Enter a valid email address." is displayed

  @TC-RESERVEPAR-047 @P2 @regression @tg-cmwtipgsf02x701thb7fau7ad
  Scenario: TC-RESERVEPAR-047 Email is required
    When the user opens the reservation form
    And the user enters 1000 "Optic Sensor Array"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "Email is required." is displayed

  @TC-RESERVEPAR-048 @P2 @regression @tg-cmwtipgsd02x601thhdk9hrtc
  Scenario: TC-RESERVEPAR-048 Decimal quantity is rejected
    When the user opens the reservation form
    And the user enters 1000.5 "Fusion Core Cell"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "Quantities must be whole numbers of 0 or more." is displayed for the decimal quantity

  @TC-RESERVEPAR-049 @P2 @regression @tg-cmwtipgsb02x501thpk8exa54
  Scenario: TC-RESERVEPAR-049 Negative quantity is rejected
    When the user opens the reservation form
    And the user enters -5 "Servo Arm Assembly" and 1000 "Optic Sensor Array"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "Quantities must be whole numbers of 0 or more." is displayed

  @TC-RESERVEPAR-050 @P2 @regression @tg-cmwtipgs902x401thgoloonsk
  Scenario: TC-RESERVEPAR-050 Reservation of 900 pieces is rejected below the minimum
    When the user opens the reservation form
    And the user enters 600 "Optic Sensor Array" and 300 "Dexterous Hand Unit"
    And the user fills the requester "Acme Robotics", "Ana", "Torres", "ana.torres@acme.example" and the payment "Bank transfer"
    And the user submits the reservation
    Then the error "A reservation needs at least 1,000 pieces in total (now 900)." is displayed

  @TC-RESERVEPAR-051 @P2 @regression @tg-cmwtipgs802x301thy7latb5s
  Scenario: TC-RESERVEPAR-051 Empty reservation shows every error at once
    When the user opens the reservation form
    And the user submits the reservation with no field filled
    Then 6 error messages are displayed

  @TC-RESERVEPAR-052 @P2 @regression @tg-cmwtipgs602x201thbsqoo4x8
  Scenario: TC-RESERVEPAR-052 Reservation form lists a quantity field for each part
    When the user opens the reservation form
    Then a quantity field is displayed for "Optic Sensor Array", "Servo Arm Assembly", "Fusion Core Cell", "Dexterous Hand Unit", "Hydraulic Leg Module", "Neural Processor", "Vocal Synth Module" and "Torso Chassis Frame"

  @TC-RESERVEPAR-053 @P2 @regression @tg-cmwtipgs402x101th8ai620rf
  Scenario: TC-RESERVEPAR-053 Reservation form shows its title and the rules hint
    When the user opens the reservation form
    Then the title "Reserve parts" and the hint "Reserve parts in bulk: at least 1,000 pieces in total, combining any parts. Transport costs $45.00 for every 1,000 pieces (or part of them)." are displayed

  @TC-RESERVEPAR-054 @P2 @regression @tg-cmwtipgs202x001thc1ac5j9r
  Scenario: TC-RESERVEPAR-054 Reservation error messages are spelled as approved
    When the user opens the reservation form
    And the user submits the reservation with every field empty
    Then the error messages read exactly "A reservation needs at least 1,000 pieces in total (now 0).", "Company is required.", "First name is required.", "Last name is required.", "Email is required." and "Choose a payment method."

  @TC-RESERVEPAR-055 @P2 @regression @tg-cmwtipgs102wz01thf4e93gmz
  Scenario: TC-RESERVEPAR-055 Reservation form section titles are spelled as approved
    When the user opens the reservation form
    Then the section titles read exactly "Parts and quantities", "Requested by" and "Payment method"

  @TC-RESERVEPAR-056 @P2 @regression @tg-cmwtipgrz02wy01thsi0l89nb
  Scenario: TC-RESERVEPAR-056 Payment note and Reserve submit button are displayed
    When the user opens the reservation form
    Then the note "The reserved shipment is not sent until the payment is completed." and the "Reserve" submit button are displayed

  @TC-RESERVEPAR-057 @P2 @regression @tg-cmwtipgrx02wx01th0pksowj3
  Scenario: TC-RESERVEPAR-057 Reservation totals start at zero
    When the user opens the reservation form
    Then "Total pieces" shows "0" and "Transport cost" shows "$0.00"

  @TC-RESERVEPAR-058 @P2 @regression @tg-cmwtipgrv02ww01thjolk3sy8
  Scenario: TC-RESERVEPAR-058 Payment methods are displayed with none selected
    When the user opens the reservation form
    Then the payment options "Check", "Bank transfer" and "Credit card" are displayed and none is selected

  @TC-RESERVEPAR-059 @P2 @regression @tg-cmwtipgrt02wv01thn41e57eu
  Scenario: TC-RESERVEPAR-059 Requester fields are displayed with their labels
    When the user opens the reservation form
    Then the fields "Company", "First name", "Last name(s)" and "Email for the confirmation" are displayed

  @TC-RESERVEPAR-060 @P2 @regression @tg-cmwtipgrq02wu01th0o8jk9pv
  Scenario: TC-RESERVEPAR-060 Reservation form fits a 375px wide screen
    When the user opens the page on a 375px wide viewport
    And the user opens the reservation form on the small screen
    Then the reservation form has no horizontal scroll and the name fields are stacked

  @TC-RESERVEPAR-061 @P2 @regression @tg-cmwtipgro02wt01thck0dm6qk
  Scenario: TC-RESERVEPAR-061 Reserve button shows only its icon on a 375px wide screen
    When the user opens the page on a 375px wide viewport
    Then the "Reserve" button shows its icon without the label and the header has no horizontal scroll

  @TC-RESERVEPAR-062 @P2 @regression @tg-cmwtipgrl02ws01th1uafd4bx
  Scenario: TC-RESERVEPAR-062 Reserve button is shown next to the Cart button
    When the user looks at the page header
    Then a "Reserve" button is displayed next to the "Cart" button
