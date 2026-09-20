# Part B – Question (a): Billing Form UI Review

After reviewing the billing form mock-up, I identified several potential issues related to functionality, security, usability, and internationalization.

Since this is a UI mock-up rather than a working application, I can identify visible design issues and potential risks, but some of their consequences would require further testing.

<img width="691" height="589" alt="image" src="https://github.com/user-attachments/assets/fe101e8f-8777-4017-adb3-2f1b2871e8d1" />


## Missing Country Field

The billing form does not include a Country field, even though the company operates globally. It requires customers to enter a State or Province without first allowing them to select their country.

This could prevent international customers from entering their billing addresses correctly. For example, an Israeli customer needs to provide an Israeli address and postal code rather than select a US state. The missing country information could also make it harder to determine which tax rules apply to a transaction.

A possible solution would be to add a required Country field and adjust the address fields and validation rules based on the selected country.

For comparison, [Evernote](https://evernote.com/)'s checkout includes a Country selector.

<img width="952" height="629" alt="image" src="https://github.com/user-attachments/assets/206b1245-ef2d-4d94-9df2-276e75c58eed" />


## Missing Payment Currency

The payment amount is displayed as `30.00`, without a currency symbol or currency code.

For a global SaaS company, this creates ambiguity. Customers cannot determine whether they are paying in US dollars, Canadian dollars, or another currency.

Even displaying `$30.00` would not completely solve this issue because several countries use the dollar symbol.

The amount should be displayed with an unambiguous currency identifier, such as `USD 30.00` or `CAD 30.00`. The same currency should also appear on the payment confirmation and receipt.

For comparison see the evernote checkout from above that include the currency idenfiter for Polish zloty.


## Missing Card Security Code

The form does not include a CVV/CVC field.

Card security codes are commonly requested during online payments as an additional verification measure. However, the absence of this field does not necessarily mean the payment system is insecure, as the payment provider may use an alternative verification process.

I would investigate whether the security code is collected at another stage or whether the payment provider requires it.

For comparison see the evernote checkout from above include the cvv long side the card number and the expeiry

## Unclear "MI" Abbreviation

The form contains a field labeled `MI`, which stands for *Middle Initial*.

This abbreviation may be familiar to American customers but unclear to international users. As a result, customers might not understand what information they are expected to enter.

Replacing `MI` with `Middle Initial (optional)` would make the field easier to understand.

