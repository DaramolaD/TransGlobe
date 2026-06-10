# Booking form fields — plain-language guide

Use this to explain **Reference number** and **HS / tariff code** to customers and staff.

---

## Quick answers

| Field | Required? | In one sentence |
|--------|-----------|-----------------|
| **Your reference number** | **No** — optional | Your own PO or order number so you can find this shipment in *your* systems. |
| **HS / tariff code** | **Only if** your operator turned on “Require HS code” in platform settings | A standard customs product code so border agencies know what you are shipping. |

Neither field replaces the **tracking number**. SwiftCargo generates the tracking number automatically when you book.

---

## Your reference number

### What is it?

A label **you** already use in your business, for example:

- Purchase order: `PO-2026-0042`
- Sales order: `SO-8841`
- Internal job code: `PROJECT-ALPHA`

It is **not**:

- The carrier tracking number (e.g. `TG-ABC123`)
- A customs code
- Something SwiftCargo assigns

### Do customers need to fill it in?

**No.** Leave it blank if you do not use PO numbers or internal refs.

Fill it in when you want this shipment tied to paperwork you already have (accounting, procurement, warehouse).

### Where does it go? (the flow)

```
Customer books shipment
        ↓
Saved on the shipment record (metadata.referenceNumber)
        ↓
Shown on:
  • Booking review step (before submit)
  • Invoice / receipt for that shipment (“Your reference: …”)
        ↓
Staff can see it when billing or answering support questions
```

It does **not** change routing, price, or tracking. It is for **your records**.

### Example

> “We shipped spare parts for job PO-2026-0042.”  
> You enter `PO-2026-0042` as the reference.  
> Later, when finance opens the invoice, they see the same PO and can match payment.

---

## HS / tariff code

### What is it?

**HS** = Harmonized System. Governments worldwide use these codes to classify goods at the border.

You may also hear:

- Tariff code  
- Commodity code  
- Customs classification code  

**Example:** `8471.30` often describes portable computers/laptops.

Customs uses the code plus your **goods description** to decide duties, restrictions, and paperwork.

### Do customers need to fill it in?

| Situation | Required? |
|-----------|-----------|
| Domestic shipment, operator has not enabled HS requirement | **Optional** — can leave blank |
| International shipment, operator enabled **Require HS code** | **Yes** — form blocks submit without it |
| You are unsure of the code | Ask your supplier, customs broker, or check your product’s commercial invoice |

Super Admin controls the rule: **Platform settings → Claims / booking → Require HS code**.

### Where does it go? (the flow)

```
Customer enters HS code + goods description at booking
        ↓
Saved on the shipment record (metadata.hsCode)
        ↓
Shown on:
  • Booking review step
  • Invoice / shipment paperwork for staff and customer
        ↓
Operations / customs use it when preparing clearance (outside the app: brokers, manifests)
```

The app **stores** the code for the shipment. Actual customs filing may still happen in broker tools or government portals — but your team is not starting from an empty record.

### Example

> You ship 50 printed circuit boards to Germany.  
> Description: “Bare PCB assemblies, not populated.”  
> HS code: `8534.00` (example — always confirm with your broker).  
> Customs can classify faster; your invoice archive shows what was declared at booking time.

---

## How this fits the full booking flow

```
1. Service          → Air / sea / road, express, insurance
2. Shipper & recipient → Names, addresses, contacts
3. Packages         → Weights, descriptions per box
4. Customs block    → Goods description + HS code (if needed)
5. Pickup           → Optional linked pickup request
6. Review & submit  → You see reference + HS code again
7. Success          → Tracking number (carrier ID) — save this for Track page
```

**Three different numbers — do not confuse them:**

| Name | Who creates it | Purpose |
|------|----------------|---------|
| **Tracking number** | SwiftCargo | Follow shipment on Track page |
| **Your reference** | You (optional) | Match your PO / ERP / invoice |
| **HS code** | You or supplier (sometimes required) | Customs product classification |

---

## Staff cheat sheet

- **Customer asks “What’s reference number?”**  
  → “Your own order or PO number — optional. We print it on your invoice so you can match your books.”

- **Customer asks “What’s HS code?”**  
  → “The customs product code for what’s in the box. Optional unless we require it for international bookings.”

- **Customer left both blank**  
  → Booking still works. Tracking still works. Only HS may be blocked if platform requires it.

- **Where to see saved values**  
  → Shipment `metadata` in database; reference + goods description + HS on invoice shipment details.

---

## Related settings

| Setting | Location | Effect |
|---------|----------|--------|
| Require HS code | Super Admin → Platform settings | Makes HS field mandatory at booking |
| Default map / booking rules | Platform settings | Does not affect reference or HS |

---

*Last updated for TransGlobe portal booking (`/app/portal/book`).*
