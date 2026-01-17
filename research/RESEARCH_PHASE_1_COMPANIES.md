# Research Phase 1: Companies Supporting Israeli Occupation

## Your Task

You are researching **companies, corporations, and business groups** that provide support to the Israeli occupation of Palestine. Your goal is to identify these companies and document evidence of their support.

**Target: 150-200 companies**

---

## What You Are Looking For

### Types of Entities to Find:
- Large multinational corporations
- Medium and small companies
- Business groups and conglomerates
- Parent companies (that may own many brands)
- Companies headquartered anywhere in the world

### Types of Support to Document:

| Support Type | Description | Examples |
|--------------|-------------|----------|
| **DIRECT_FUNDING** | Financial donations or investments | Donations to Israeli military, investments in settlement businesses |
| **OPERATIONS** | Business operations in Israel or occupied territories | Factories, offices, stores in settlements |
| **CONTRACTS** | Contracts with Israeli government or military | Supplying equipment, technology, services |
| **PARTNERSHIPS** | Business partnerships with Israeli entities | Joint ventures, licensing agreements |
| **STATEMENTS** | Public statements of support | CEO statements, company press releases |
| **PRODUCTS** | Products used in occupation | Technology used at checkpoints, equipment for military |
| **SPONSORSHIP** | Sponsoring Israeli events or organizations | Sports sponsorship, cultural events |
| **OTHER** | Any other form of support | Document clearly |

---

## Severity Levels

Rate each company based on how direct and significant their support is:

| Level | Code | Description |
|-------|------|-------------|
| **Critical** | `CRITICAL` | Direct funding of military/occupation, operations in settlements |
| **High** | `HIGH` | Significant contracts, major partnerships, clear public support |
| **Medium** | `MEDIUM` | Indirect support through subsidiaries, partial ownership |
| **Low** | `LOW` | Minor connections, historical support, unclear current status |

---

## Evidence Requirements

### For Each Evidence, Provide:
- **URL** - Direct link to the source
- **Title** - Title of the article/report
- **Publisher** - Name of the source
- **Date** - Publication date (if available)

### Important:
- At least **ONE** source per company is required
- Multiple sources strengthen the case
- Any type of source is acceptable (news, official statements, NGO reports, etc.)
- The quality of evidence will affect the confidence level assigned to the company

---

## Output Format

For each company you find, create an entry using this template:

```
================================================================================
COMPANY ENTRY
================================================================================

Company Name: [Official company name in English]
Industry/Sector: [e.g., Beverages, Technology, Food, Finance, Retail, etc.]
Headquarters Country: [Country where headquartered]
Support Type: [Use codes from table above, can list multiple separated by comma]
Severity: [CRITICAL / HIGH / MEDIUM / LOW]

--- CLAIM ---
Title: [Short title describing the support claim]
Description: [2-5 sentences explaining what the company does and how it supports the occupation]

--- EVIDENCE ---
Source 1:
  URL: [Full URL to the source]
  Title: [Title of article/report]
  Publisher: [Name of publisher]
  Date: [Publication date if known, otherwise "Unknown"]

Source 2: (if available)
  URL: [Full URL]
  Title: [Title]
  Publisher: [Publisher]
  Date: [Date]

[Add more sources as needed]

--- NOTES ---
[Any additional context, disputed claims, or important information]
[Leave empty if none]

================================================================================
```

---

## Example Entry

```
================================================================================
COMPANY ENTRY
================================================================================

Company Name: Example Corporation Inc.
Industry/Sector: Technology
Headquarters Country: United States
Support Type: OPERATIONS, CONTRACTS
Severity: HIGH

--- CLAIM ---
Title: Operations in Occupied Territories
Description: Example Corporation operates a research and development center in an illegal settlement in the West Bank. The company also holds contracts with the Israeli military to provide surveillance technology used at checkpoints. The company has publicly defended its presence in settlements despite international criticism.

--- EVIDENCE ---
Source 1:
  URL: https://www.example-news.com/article/example-corp-settlement
  Title: "Example Corp Expands Operations in West Bank Settlement"
  Publisher: Example News
  Date: 2023-05-15

Source 2:
  URL: https://whoprofits.org/company/example-corp
  Title: "Example Corporation Company Profile"
  Publisher: Who Profits Research Center
  Date: 2022-11-20

Source 3:
  URL: https://www.example-corp.com/press/statement-2023
  Title: "Company Statement on Israel Operations"
  Publisher: Example Corporation (Official)
  Date: 2023-06-01

--- NOTES ---
Company has faced shareholder pressure to divest but has refused. Some reports suggest the R&D center may be relocating, but this is unconfirmed as of latest evidence.

================================================================================
```

---

## Research Tips

1. **Start with known lists**: Organizations like BDS Movement, Who Profits, and others maintain lists you can use as starting points for your own research.

2. **Follow the money**: Look at company annual reports, investor relations pages, and financial filings.

3. **Check subsidiaries later**: If you find a parent company, note it. Subsidiaries will be researched in Phase 2.

4. **Don't duplicate**: Before adding a company, check if it's already in your list.

5. **When in doubt, include it**: If evidence is weak but exists, include it with LOW severity. Better to document than miss.

6. **Note changed behavior**: If a company previously supported but has divested, note this in the NOTES section.

---

## What NOT to Include

- Individual people (only companies/organizations)
- Companies with NO evidence of support (rumors are not enough)
- Companies that have clearly and publicly divested with evidence

---

## Output File

Your output file must have **TWO SECTIONS**:

1. **Section 1: Quick Reference List** - A simple table of all companies (will be used by other researchers)
2. **Section 2: Full Details** - Complete entries with all evidence

---

### Output Template:

```
# Phase 1 Research Results

Total Companies Found: [Number]

## Statistics

### By Severity:
- CRITICAL: [Number]
- HIGH: [Number]
- MEDIUM: [Number]
- LOW: [Number]

### By Support Type:
- DIRECT_FUNDING: [Number]
- OPERATIONS: [Number]
- CONTRACTS: [Number]
- PARTNERSHIPS: [Number]
- STATEMENTS: [Number]
- PRODUCTS: [Number]
- SPONSORSHIP: [Number]
- OTHER: [Number]

---

# SECTION 1: Quick Reference List

This table summarizes all companies found. Keep this section updated as you add entries.

| # | Company Name | Industry/Sector | Severity | Support Types |
|---|--------------|-----------------|----------|---------------|
| 1 | [Company Name] | [Industry] | [CRITICAL/HIGH/MEDIUM/LOW] | [Types, comma-separated] |
| 2 | [Company Name] | [Industry] | [Severity] | [Types] |
| 3 | [Company Name] | [Industry] | [Severity] | [Types] |
[Continue for all companies...]

---

# SECTION 2: Full Details

[All your detailed company entries below, using the template provided earlier]
```

---

### Example Quick Reference List:

```
| # | Company Name | Industry/Sector | Severity | Support Types |
|---|--------------|-----------------|----------|---------------|
| 1 | The Coca-Cola Company | Beverages | HIGH | OPERATIONS, STATEMENTS |
| 2 | Nestlé S.A. | Food & Beverages | CRITICAL | OPERATIONS, CONTRACTS |
| 3 | Example Tech Corp | Technology | MEDIUM | CONTRACTS |
| 4 | Another Company Inc | Finance | LOW | PARTNERSHIPS |
```

---

### Important Notes:

1. **Keep the Quick Reference List updated** - Every time you add a new company entry in Section 2, add a row to the table in Section 1.

2. **The table must match the entries** - The number of rows in the Quick Reference List should equal the number of detailed entries.

3. **Use consistent naming** - Company names in the table must exactly match the names in the detailed entries.

---

## Checklist Before Submitting

- [ ] Each company has at least one evidence source with URL
- [ ] Severity level is assigned to each company
- [ ] Support type(s) are specified for each company
- [ ] Description clearly explains how the company provides support
- [ ] Statistics section is completed at the top of the file
- [ ] Quick Reference List table includes ALL companies
- [ ] Quick Reference List matches the detailed entries exactly
- [ ] No duplicate companies in the list

