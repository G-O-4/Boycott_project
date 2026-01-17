# Research Phase 2: Brands and Subsidiaries

## Your Task

You have received a list of **parent companies** from Phase 1 research. Your task is to find all the **brands, subsidiaries, and owned companies** under each parent company.

This is important because consumers interact with brands, not parent companies. Someone might not know that their favorite snack brand is owned by a company that supports the occupation.

---

## Input

You will receive a file containing a **summary table** of parent companies.

The table looks like this:

```
| # | Company Name | Industry/Sector | Severity | Support Types |
|---|--------------|-----------------|----------|---------------|
| 1 | The Coca-Cola Company | Beverages | HIGH | OPERATIONS, STATEMENTS |
| 2 | Nestlé S.A. | Food & Beverages | CRITICAL | OPERATIONS, CONTRACTS |
| 3 | Example Tech Corp | Technology | MEDIUM | CONTRACTS |
```

**What you need from this table:**
- **Company Name** - The parent company to research
- **Industry/Sector** - Helps you understand what brands to look for
- **Severity** - Use this to prioritize (CRITICAL first, then HIGH, etc.)

---

## What You Are Looking For

For each parent company in the Phase 1 list, find:

### 1. Subsidiaries
- Companies that are wholly or partially owned by the parent
- Regional divisions (e.g., "Company Name Middle East")
- Acquired companies that operate under their own name

### 2. Brands
- Product brand names owned by the company
- Service brands
- Store/restaurant brands
- Sub-brands and product lines

### 3. Ownership Details
- Percentage owned (if less than 100%)
- Joint ventures
- Licensing agreements (when a brand is licensed to another company)

---

## Relationship Types

| Type | Code | Description |
|------|------|-------------|
| **Subsidiary** | `SUBSIDIARY` | A separate company owned by the parent |
| **Brand** | `BRAND` | A brand name owned by the parent (not a separate company) |
| **Division** | `DIVISION` | A division or business unit of the parent |
| **Joint Venture** | `JOINT_VENTURE` | Partially owned with another company |
| **Licensed** | `LICENSED` | Brand licensed to/from another company |

---

## Output Format

For each brand/subsidiary you find, create an entry using this template:

```
================================================================================
BRAND/SUBSIDIARY ENTRY
================================================================================

Parent Company: [Name of parent company from Phase 1]
Entity Name: [Name of brand/subsidiary]
Entity Type: [SUBSIDIARY / BRAND / DIVISION / JOINT_VENTURE / LICENSED]
Industry/Sector: [e.g., Soft Drinks, Snacks, Skincare, etc.]
Ownership: [100% / Percentage if known / "Unknown"]

--- DETAILS ---
Description: [1-2 sentences about what this brand/subsidiary does]
Products/Services: [List main products or services, comma-separated]
Known Regions: [Where this brand is commonly found, if known]

--- SOURCE ---
URL: [URL confirming ownership relationship]
Title: [Title of source]
Publisher: [Publisher name]

--- NOTES ---
[Any additional information]
[Leave empty if none]

================================================================================
```

---

## Example Entries

### Example 1: Brand

```
================================================================================
BRAND/SUBSIDIARY ENTRY
================================================================================

Parent Company: The Coca-Cola Company
Entity Name: Fanta
Entity Type: BRAND
Industry/Sector: Soft Drinks
Ownership: 100%

--- DETAILS ---
Description: Fanta is a fruit-flavored carbonated soft drink brand owned by The Coca-Cola Company.
Products/Services: Orange soda, Grape soda, Strawberry soda, various fruit flavors
Known Regions: Global

--- SOURCE ---
URL: https://www.coca-colacompany.com/brands/fanta
Title: "Fanta Brand Page"
Publisher: The Coca-Cola Company (Official)

--- NOTES ---

================================================================================
```

### Example 2: Subsidiary

```
================================================================================
BRAND/SUBSIDIARY ENTRY
================================================================================

Parent Company: Nestlé S.A.
Entity Name: Nespresso
Entity Type: SUBSIDIARY
Industry/Sector: Coffee
Ownership: 100%

--- DETAILS ---
Description: Nespresso is an operating unit of the Nestlé Group, specializing in premium coffee machines and capsules.
Products/Services: Coffee machines, Coffee capsules, Accessories
Known Regions: Global

--- SOURCE ---
URL: https://www.nestle.com/brands/coffee/nespresso
Title: "Nespresso - Nestlé Global"
Publisher: Nestlé (Official)

--- NOTES ---
Operates as a separate subsidiary with its own retail stores.

================================================================================
```

### Example 3: Joint Venture

```
================================================================================
BRAND/SUBSIDIARY ENTRY
================================================================================

Parent Company: Example Corporation
Entity Name: Example-Partner Foods
Entity Type: JOINT_VENTURE
Industry/Sector: Food Products
Ownership: 50%

--- DETAILS ---
Description: A joint venture between Example Corporation and Partner Inc. for food distribution.
Products/Services: Packaged foods, Frozen meals
Known Regions: Middle East, North Africa

--- SOURCE ---
URL: https://www.example-news.com/joint-venture-announcement
Title: "Example Corp and Partner Inc Announce Joint Venture"
Publisher: Example News

--- NOTES ---
Joint venture formed in 2019. Partner Inc. owns the other 50%.

================================================================================
```

---

## Research Tips

1. **Check official sources first**: 
   - Company websites (About Us, Brands, Our Companies pages)
   - Annual reports and investor relations
   - Wikipedia (verify with official sources)

2. **Use brand databases**:
   - Company brand portfolio pages
   - Business databases (Crunchbase, Bloomberg, etc.)

3. **Look for acquisitions**:
   - News about company acquisitions
   - "Owned by" or "A subsidiary of" mentions

4. **Be thorough but focused**:
   - Include all consumer-facing brands
   - Include major subsidiaries
   - Skip internal/technical divisions that consumers don't interact with

5. **When ownership is unclear**:
   - Note "Unknown" for ownership percentage
   - Include what you found in notes

---

## What NOT to Include

- Internal departments that aren't separate brands/companies
- Discontinued brands (unless still sold in some regions)
- Brands that have been sold to other companies (note in parent company if relevant)
- Speculation without sources

---

## Handling Edge Cases

### Brand sold to another company:
If a brand was previously owned but has been sold, note this in the NOTES section of the parent company, not as a new entry.

### Brand exists in some regions only:
Include it and note the regions in "Known Regions" field.

### Unclear if subsidiary or brand:
Use your best judgment. If it operates independently with its own leadership, it's likely a SUBSIDIARY. If it's just a product name, it's a BRAND.

---

## Output File

Structure your file as:
1. Summary section at the top
2. Entries grouped by parent company

### Output Template:

```
# Phase 2 Research Results

Parent Companies Processed: [Number]
Total Brands/Subsidiaries Found: [Number]

## Statistics

### By Entity Type:
- SUBSIDIARY: [Number]
- BRAND: [Number]
- DIVISION: [Number]
- JOINT_VENTURE: [Number]
- LICENSED: [Number]

### Top Parent Companies by Brand Count:
1. [Company Name]: [Number] brands/subsidiaries
2. [Company Name]: [Number] brands/subsidiaries
3. [Company Name]: [Number] brands/subsidiaries
[Top 10]

---

# Brand/Subsidiary Entries

## [Company Name 1]
[All entries for this parent]

## [Company Name 2]
[All entries for this parent]

[Continue for all parent companies]
```

---

## Priority Order

Process parent companies in this order:
1. **CRITICAL** severity companies first
2. **HIGH** severity companies second
3. **MEDIUM** severity companies third
4. **LOW** severity companies last

This ensures the most important brands are documented first.

---

## Checklist Before Submitting

- [ ] Every parent company from the input list has been processed
- [ ] Each entry has a source URL confirming ownership
- [ ] Entity type is specified for each entry
- [ ] Statistics section is completed
- [ ] Entries are grouped by parent company
- [ ] No duplicate entries

