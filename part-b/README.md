# Part B – Question (a): Billing Form UI Review

## Table of Contents

- [Question (a): Billing Form UI Review](#part-b--question-a-billing-form-ui-review)
- [Question (b): Functional Test Cases](#part-b--question-b-functional-test-cases)
- [Question (c): Proposed Product Solution](#part-b--question-c-proposed-product-solution)

After reviewing the billing form mock-up, I identified several potential issues related to functionality, security, usability, and internationalization.

Since this is a UI mock-up rather than a working application, I can identify visible design issues and potential risks, but some of their consequences would require further testing.

<img width="691" height="589" alt="image" src="https://github.com/user-attachments/assets/fe101e8f-8777-4017-adb3-2f1b2871e8d1" />


## Missing Country Field

The billing form does not include a country field, even though the company operates globally. It requires customers to enter a state or province without first allowing them to select their country.

This could prevent international customers from entering their billing addresses correctly. For example, an Israeli customer needs to provide an Israeli address and postal code rather than select a US state. The missing country information could also make it harder to determine which tax rules apply to a transaction.

A possible solution would be to add a required country field and adjust the address fields and validation rules based on the selected country.

For comparison, [Evernote](https://evernote.com/)'s checkout includes a country selector.

<img width="952" height="629" alt="image" src="https://github.com/user-attachments/assets/206b1245-ef2d-4d94-9df2-276e75c58eed" />


## Unlabeled Second Address Field

The form shows two street-address inputs, but only the first has a visible label. Customers may not know whether the second input is intended for an apartment, suite, or another address detail, or whether it is optional.

I would label them `Address Line 1` and `Address Line 2 (optional)` and ensure each input also has an appropriate accessible label.

## Missing Payment Currency

The payment amount is displayed as `30.00`, without a currency symbol or currency code.

For a global SaaS company, this creates ambiguity. Customers cannot determine whether they are paying in US dollars, Canadian dollars, or another currency.

Even displaying `$30.00` would not completely solve this issue because several countries use the dollar symbol.

The amount should be displayed with an unambiguous currency identifier, such as `USD 30.00` or `CAD 30.00`. The same currency should also appear on the payment confirmation and receipt.

For comparison, see the Evernote checkout shown above, which includes a currency identifier for the Polish złoty.


## Missing Card Security Code

The form does not include a CVV/CVC field.

Card security codes are commonly requested during online payments as an additional verification measure. However, the absence of this field does not necessarily mean the payment system is insecure, as the payment provider may use an alternative verification process.

I would investigate whether the security code is collected at another stage or whether the payment provider requires it.

For comparison, the Evernote checkout shown above includes a CVV field alongside the card number and expiration date.

## Redundant Card Type Selection

The form asks customers to select a card type, even though the card network can usually be identified from the card number.

This adds an unnecessary step and creates an opportunity for mistakes. For example, a customer might select Visa but enter a Mastercard number. I would check whether the selection is required and how the form handles a mismatch.

The form could automatically detect and display the card network as the customer enters the number, with a manual option if detection is ambiguous.

## Restrictive Card Number and Postal Code Formatting

The card number field instructs customers to enter the number with no dashes or spaces, while the postal code field says not to use dashes.

These restrictions may make the form harder to use. For example, a customer pasting a card number formatted as `4111 1111 1111 1111` would have to remove the spaces manually. A US ZIP+4 code such as `10001-1234` contains a valid dash, and postal code formats differ between countries. The mock-up does not establish whether the application actually rejects these inputs, so I would verify that behavior.

A possible solution would be to accept common card-number separators and normalize the input before validation. Postal code validation should follow the selected country's format rather than applying a blanket restriction on dashes.

## Unclear "MI" Abbreviation

The form contains a field labeled `MI`, which stands for *Middle Initial*.

This abbreviation may be familiar to American customers but unclear to international users. As a result, customers might not understand what information they are expected to enter.

Replacing `MI` with `Middle Initial (optional)` would make the field easier to understand.

## Performance Considerations

I cannot determine whether the form has a performance problem from a static mock-up. With a working application, I would measure how quickly the checkout loads, whether the fields stay responsive, and how the Continue button behaves on a slow connection.

I would also check that a delayed response does not lead to repeated submissions or duplicate payments. These are areas for further testing, not confirmed defects in the mock-up.

---

# Part B – Question (b): Functional Test Cases

The following test cases cover three different flows: successful payment, input validation, and payment cancellation.

These test cases are based on the provided UI mock-up. The exact payment behavior and navigation destinations should be confirmed against the product requirements before execution. All payment tests should use a payment sandbox and synthetic customer data.

## TC-01: US Customer – Successful Payment

**Objective:** Verify that a US customer can complete the payment process using valid information.

**Preconditions:**
- The billing form is accessible.
- The payment sandbox is available.
- A valid test card configured for successful payment is available.

**Test data:**
- Card type: Visa
- Card number: Valid Visa sandbox test number
- Expiration date: A valid future date
- Cardholder name: John Smith
- Billing address: A valid US test address
- State: A valid US state
- Postal code: A valid ZIP code

**Test steps:**

1. Open the billing form.
2. Select Visa as the card type.
3. Enter the valid test card number and expiration date.
4. Enter the cardholder's first and last name.
5. Fill in all required billing address fields using the US test address.
6. Click Continue.
7. Complete any remaining steps in the payment flow.
8. Check the resulting page and the transaction status in the payment sandbox.

**Expected result:**

The form accepts the valid information, the payment is completed successfully, and the customer receives a clear confirmation. The payment sandbox records one successful transaction with the correct amount and currency.

---

## TC-02: Invalid Input Validation

**Objective:** Verify that the form handles invalid input correctly and prevents invalid submissions.

**Preconditions:**
- The billing form is accessible.
- A complete set of valid test data is available.

**Test data:**

Start with the valid data from TC-01. For each iteration, replace only one value with an invalid value.

| Iteration | Field | Invalid value |
|---|---|---|
| 1 | Card number | An invalid card number |
| 2 | Expiration date | A date in the past |
| 3 | First name | Empty value |
| 4 | Card type | Visa selected with a Mastercard test number |
| 5 | Postal code | `ABCDE` for a US billing address |

**Test steps:**

1. Open the billing form.
2. Fill in all required fields using valid test data.
3. Replace one field with the invalid value from the table.
4. Click Continue.
5. Check the validation result and any displayed error messages.
6. Restore the valid value.
7. Repeat steps 3–6 for each remaining iteration.

**Expected result:**

For each iteration, the form identifies the invalid or inconsistent information and prevents an incorrect payment submission.

The form displays a clear error message for the relevant field and allows the customer to correct it without re-entering all the other information.

For the card-type mismatch, the form should either identify the mismatch and require correction or automatically detect the correct card network. The intended behavior should be confirmed against the requirements.

No payment should be processed while the submitted information is invalid.

**Note:** Each iteration should be recorded separately so that a failure can be traced to a specific input.

---

## TC-03: Cancel Payment

**Objective:** Verify that a customer can cancel the payment process without completing a transaction.

**Preconditions:**
- The billing form is accessible.
- The payment sandbox is available.
- Valid test data is available.

**Test data:**

Use the valid customer, card, and billing information from TC-01.

**Test steps:**

1. Open the billing form.
2. Fill in all required fields using valid test data.
3. Click Cancel instead of Continue.
4. Check the resulting page or application state.
5. Check the transaction status in the payment sandbox.

**Expected result:**

The form exits the payment process and returns the customer to the appropriate page or displays a clear cancellation indication, according to the product requirements.

No payment is processed as a result of the cancellation, and the payment sandbox shows no successful charge for this attempt.

---

**Execution status:** Not executed. These test cases were designed from the UI mock-up and require a working application and payment sandbox for verification.

---

# Part B – Question (c): Proposed Product Solution

I consider the missing country field the most severe issue because it could prevent international customers from entering their billing addresses correctly.

My immediate solution would be to fix the existing billing form by adding the missing information and improving its validation.

First, I would add a required country field. Based on the selected country, the form should adjust its address fields and postal code validation so international customers can enter their billing information correctly.

I would also display the payment amount with an unambiguous currency code, such as `USD 30.00`, and verify whether the payment provider requires a CVV/CVC field or uses an alternative verification process.

However, these changes would only address the issues we identified in the current form. We would still be responsible for maintaining the payment UI, handling different card formats, integrating with the payment system, and testing the entire payment flow.

For a more complete, long-term solution, I would consider integrating an established payment provider such as Stripe, using its hosted checkout or payment components instead of building and maintaining all the payment fields ourselves.

This could reduce the amount of custom payment functionality we need to maintain, but it would not eliminate our responsibility. We would still need to configure the correct currency and billing requirements, handle payment success and failure correctly, and test the integration before releasing it.
