# 📋 Data Collection Guide for Boycott App

This guide explains what information to gather and how to organize it for the Boycott app database.

---

## ⭐ Key Features Supported

| Feature | Description |
|---------|-------------|
| **Multiple Alternatives** | One boycotted product can have many alternative products |
| **Company Hierarchy** | Companies can own other companies (parent/subsidiary) |
| **Logo/Images** | Companies, brands, and products all support images |
| **Evidence-Based** | Every claim requires evidence sources with URLs |
| **Bilingual** | Arabic and English supported for all text fields |
| **Store Locations** | GPS coordinates for showing stores on maps |

---

## 📁 File Format

**Use JSON format** - It handles:
- Nested data (company → brand → product)
- Optional fields (just omit them)
- Arabic text (UTF-8)
- Arrays (multiple aliases, images, etc.)

Create a single file: `data/boycott_data.json`

---

## 🗂️ Data Organization

Organize your data in this order (from general to specific):

```
1. Categories (product categories)
2. Companies (to boycott + safe companies)
3. Brands (under companies)
4. Products (under brands)
5. Claims (reasons for boycott)
6. Evidence (sources for claims)
7. Alternatives (links between products)
8. Stores (where to buy alternatives)
9. Store Availability (which store sells which alternative)
```

---

## 📝 JSON Structure

Your `boycott_data.json` file should look like this:

```json
{
  "categories": [...],
  "companies": [...],
  "brands": [...],
  "products": [...],
  "claims": [...],
  "alternatives": [...],
  "stores": [...],
  "storeAvailability": [...]
}
```

---

## 1️⃣ Categories

Product categories for filtering.

```json
{
  "categories": [
    {
      "id": "beverages",
      "nameEn": "Beverages",
      "nameAr": "المشروبات",
      "icon": "🥤"
    },
    {
      "id": "snacks",
      "nameEn": "Snacks",
      "nameAr": "الوجبات الخفيفة",
      "icon": "🍪"
    },
    {
      "id": "dairy",
      "nameEn": "Dairy",
      "nameAr": "الألبان",
      "icon": "🥛"
    },
    {
      "id": "personal-care",
      "nameEn": "Personal Care",
      "nameAr": "العناية الشخصية",
      "icon": "🧴"
    },
    {
      "id": "cleaning",
      "nameEn": "Cleaning Products",
      "nameAr": "منتجات التنظيف",
      "icon": "🧹"
    },
    {
      "id": "food",
      "nameEn": "Food",
      "nameAr": "الطعام",
      "icon": "🍽️"
    },
    {
      "id": "baby",
      "nameEn": "Baby Products",
      "nameAr": "منتجات الأطفال",
      "icon": "👶"
    },
    {
      "id": "coffee-tea",
      "nameEn": "Coffee & Tea",
      "nameAr": "القهوة والشاي",
      "icon": "☕"
    }
  ]
}
```

### Category Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier (use English, lowercase, hyphens) |
| `nameEn` | ✅ | English name |
| `nameAr` | ✅ | Arabic name |
| `icon` | Optional | Emoji icon |
| `parentId` | Optional | For sub-categories |

---

## 2️⃣ Companies

Include BOTH companies to boycott AND safe alternative companies.

> 🖼️ **Logo Support:** Both companies and brands have `logoUrl` fields for displaying logos in the app!

```json
{
  "companies": [
    {
      "id": "coca-cola-company",
      "nameEn": "The Coca-Cola Company",
      "nameAr": "شركة كوكا كولا",
      "country": "USA",
      "verdict": "AVOID",
      "confidence": "HIGH",
      "aliases": ["Coke Company"],
      "websiteUrl": "https://coca-cola.com",
      "logoUrl": "https://example.com/logos/coca-cola-company.png",
      "description": "American multinational beverage corporation",
      "descriptionAr": "شركة مشروبات أمريكية متعددة الجنسيات"
    },
    {
      "id": "nestle",
      "nameEn": "Nestlé S.A.",
      "nameAr": "نستله",
      "country": "Switzerland",
      "verdict": "AVOID",
      "confidence": "HIGH",
      "parentId": null
    },
    {
      "id": "rc-cola-intl",
      "nameEn": "RC Cola International",
      "nameAr": "آر سي كولا الدولية",
      "country": "USA",
      "verdict": "PREFERRED",
      "confidence": "HIGH"
    },
    {
      "id": "libyan-local",
      "nameEn": "Libyan Local Products",
      "nameAr": "المنتجات الليبية المحلية",
      "country": "Libya",
      "verdict": "PREFERRED",
      "confidence": "HIGH"
    }
  ]
}
```

### Company Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier |
| `nameEn` | ✅ | English name |
| `nameAr` | Recommended | Arabic name |
| `country` | Recommended | Country of origin |
| `verdict` | ✅ | `AVOID`, `CAUTION`, `UNKNOWN`, or `PREFERRED` |
| `confidence` | ✅ | `HIGH`, `MEDIUM`, or `LOW` |
| `aliases` | Optional | Array of alternative names/spellings |
| `parentId` | Optional | ID of parent company (for subsidiaries) |
| `websiteUrl` | Optional | Company website |
| `logoUrl` | 🖼️ Recommended | URL to company logo image |
| `description` | Optional | English description |
| `descriptionAr` | Optional | Arabic description |

---

## 3️⃣ Brands

Brands owned by companies.

> 🖼️ **Logo Support:** Brands also have `logoUrl` for brand-specific logos!

```json
{
  "brands": [
    {
      "id": "coca-cola-brand",
      "nameEn": "Coca-Cola",
      "nameAr": "كوكا كولا",
      "companyId": "coca-cola-company",
      "logoUrl": "https://example.com/logos/coca-cola-brand.png",
      "aliases": ["Coke"]
    },
    {
      "id": "fanta",
      "nameEn": "Fanta",
      "nameAr": "فانتا",
      "companyId": "coca-cola-company"
    },
    {
      "id": "sprite",
      "nameEn": "Sprite",
      "nameAr": "سبرايت",
      "companyId": "coca-cola-company"
    },
    {
      "id": "nescafe",
      "nameEn": "Nescafé",
      "nameAr": "نسكافيه",
      "companyId": "nestle"
    },
    {
      "id": "kitkat",
      "nameEn": "KitKat",
      "nameAr": "كيتكات",
      "companyId": "nestle"
    },
    {
      "id": "rc-cola-brand",
      "nameEn": "RC Cola",
      "nameAr": "آر سي كولا",
      "companyId": "rc-cola-intl"
    }
  ]
}
```

### Brand Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier |
| `nameEn` | ✅ | English name |
| `nameAr` | Recommended | Arabic name |
| `companyId` | ✅ | ID of parent company |
| `aliases` | Optional | Alternative names |
| `logoUrl` | 🖼️ Recommended | URL to brand logo image |

---

## 4️⃣ Products

Individual products (both boycotted and alternatives).

```json
{
  "products": [
    {
      "id": "coca-cola-classic-330ml",
      "nameEn": "Coca-Cola Classic 330ml",
      "nameAr": "كوكا كولا كلاسيك 330 مل",
      "barcode": "5449000000996",
      "brandId": "coca-cola-brand",
      "categoryId": "beverages",
      "verdict": "AVOID",
      "confidence": "HIGH",
      "imageUrl": "https://example.com/coca-cola.jpg",
      "description": "Carbonated soft drink",
      "descriptionAr": "مشروب غازي"
    },
    {
      "id": "coca-cola-zero-330ml",
      "nameEn": "Coca-Cola Zero 330ml",
      "nameAr": "كوكا كولا زيرو 330 مل",
      "barcode": "5449000131836",
      "brandId": "coca-cola-brand",
      "categoryId": "beverages",
      "verdict": "AVOID",
      "confidence": "HIGH"
    },
    {
      "id": "nescafe-classic-100g",
      "nameEn": "Nescafé Classic 100g",
      "nameAr": "نسكافيه كلاسيك 100 جرام",
      "barcode": "7613036932523",
      "brandId": "nescafe",
      "categoryId": "coffee-tea",
      "verdict": "AVOID",
      "confidence": "HIGH"
    },
    {
      "id": "rc-cola-330ml",
      "nameEn": "RC Cola 330ml",
      "nameAr": "آر سي كولا 330 مل",
      "barcode": "1234567890123",
      "brandId": "rc-cola-brand",
      "categoryId": "beverages",
      "verdict": "PREFERRED",
      "confidence": "HIGH",
      "isLocal": false
    },
    {
      "id": "libyan-cola-330ml",
      "nameEn": "Libyan Cola 330ml",
      "nameAr": "كولا ليبيا 330 مل",
      "brandId": "libyan-local",
      "categoryId": "beverages",
      "verdict": "PREFERRED",
      "confidence": "HIGH",
      "isLocal": true
    }
  ]
}
```

### Product Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier |
| `nameEn` | ✅ | English name |
| `nameAr` | Recommended | Arabic name |
| `barcode` | Highly Recommended | Product barcode (EAN-13, UPC, etc.) |
| `brandId` | ✅ | ID of brand |
| `categoryId` | Recommended | ID of category |
| `verdict` | ✅ | `AVOID`, `CAUTION`, `UNKNOWN`, or `PREFERRED` |
| `confidence` | ✅ | `HIGH`, `MEDIUM`, or `LOW` |
| `imageUrl` | 🖼️ Recommended | URL to main product image |
| `images` | Optional | Array of additional image URLs |
| `description` | Optional | English description |
| `descriptionAr` | Optional | Arabic description |
| `aliases` | Optional | Alternative names |
| `isLocal` | Optional | `true` if Libyan product |

---

## 5️⃣ Claims

Reasons why a company/product should be boycotted.

```json
{
  "claims": [
    {
      "id": "coca-cola-occupation-support",
      "titleEn": "Financial support for occupation",
      "titleAr": "دعم مالي للاحتلال",
      "descriptionEn": "The company has significant investments and business operations that directly support the occupation.",
      "descriptionAr": "الشركة لها استثمارات كبيرة وعمليات تجارية تدعم الاحتلال بشكل مباشر.",
      "issueType": "OCCUPATION",
      "confidence": "HIGH",
      "appliesToCompanyId": "coca-cola-company",
      "evidence": [
        {
          "url": "https://example.com/report1",
          "title": "Report: Coca-Cola investments in occupied territories",
          "publisher": "BDS Movement",
          "publishedDate": "2023-05-15"
        },
        {
          "url": "https://example.com/report2",
          "title": "Corporate ties to occupation",
          "publisher": "Who Profits"
        }
      ]
    },
    {
      "id": "nestle-water-rights",
      "titleEn": "Water rights violations",
      "titleAr": "انتهاكات حقوق المياه",
      "descriptionEn": "The company has been accused of extracting water from occupied territories.",
      "descriptionAr": "تم اتهام الشركة باستخراج المياه من الأراضي المحتلة.",
      "issueType": "HUMAN_RIGHTS",
      "confidence": "HIGH",
      "appliesToCompanyId": "nestle",
      "evidence": [
        {
          "url": "https://example.com/nestle-report",
          "title": "Nestlé water extraction controversy",
          "publisher": "Human Rights Watch"
        }
      ]
    }
  ]
}
```

### Claim Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier |
| `titleEn` | ✅ | English title |
| `titleAr` | Recommended | Arabic title |
| `descriptionEn` | ✅ | English description |
| `descriptionAr` | Recommended | Arabic description |
| `issueType` | ✅ | See issue types below |
| `confidence` | ✅ | `HIGH`, `MEDIUM`, or `LOW` |
| `appliesToCompanyId` | Optional | Company this claim applies to |
| `appliesToProductId` | Optional | Specific product (if not company-wide) |
| `evidence` | Recommended | Array of evidence sources |

### Issue Types:
- `OCCUPATION` - Direct support for occupation
- `FUNDING` - Financial support/investments
- `HUMAN_RIGHTS` - Human rights violations
- `LABOR` - Labor law violations
- `ENVIRONMENTAL` - Environmental damage
- `OTHER` - Other issues

### Evidence Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `url` | ✅ | Link to source |
| `title` | ✅ | Title of article/report |
| `publisher` | Recommended | Who published it |
| `publishedDate` | Optional | Publication date (YYYY-MM-DD) |

---

## 6️⃣ Alternatives

Links between boycotted products and their alternatives.

> ⭐ **IMPORTANT:** One boycotted product can have **MULTIPLE alternatives!**
> Just add multiple entries with the same `boycottedProductId` pointing to different `alternativeProductId`s.

```json
{
  "alternatives": [
    {
      "boycottedProductId": "coca-cola-classic-330ml",
      "alternativeProductId": "rc-cola-330ml",
      "isExactAlternative": true,
      "notes": "Similar taste profile, widely available",
      "notesAr": "طعم مشابه، متوفر بشكل واسع"
    },
    {
      "boycottedProductId": "coca-cola-classic-330ml",
      "alternativeProductId": "libyan-cola-330ml",
      "isExactAlternative": true,
      "notes": "Local Libyan alternative",
      "notesAr": "بديل ليبي محلي"
    },
    {
      "boycottedProductId": "coca-cola-classic-330ml",
      "alternativeProductId": "mecca-cola-330ml",
      "isExactAlternative": true,
      "notes": "International halal alternative",
      "notesAr": "بديل حلال عالمي"
    },
    {
      "boycottedProductId": "coca-cola-zero-330ml",
      "alternativeProductId": "rc-cola-330ml",
      "isExactAlternative": false,
      "notes": "Not zero sugar but similar cola taste",
      "notesAr": "ليس خالي من السكر لكن طعم كولا مشابه"
    }
  ]
}
```

### Visual Representation:
```
┌────────────────────────┐
│  Coca-Cola 330ml       │ (boycotted)
│  boycottedProductId    │
└────────────┬───────────┘
             │
             ├──────────▶ RC Cola 330ml      (alternative 1)
             ├──────────▶ Libyan Cola 330ml  (alternative 2)
             └──────────▶ Mecca Cola 330ml   (alternative 3)
```

### Alternative Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `boycottedProductId` | ✅ | ID of product to avoid |
| `alternativeProductId` | ✅ | ID of alternative product |
| `isExactAlternative` | Recommended | `true` if exact replacement |
| `notes` | Optional | English notes about the alternative |
| `notesAr` | Optional | Arabic notes |

---

## 7️⃣ Stores

Physical stores in Libya where alternatives are sold.

```json
{
  "stores": [
    {
      "id": "riyada-tripoli-main",
      "name": "Al-Riyada Supermarket",
      "nameAr": "سوبر ماركت الريادة",
      "city": "طرابلس",
      "area": "وسط المدينة",
      "address": "شارع الجمهورية",
      "addressAr": "شارع الجمهورية، وسط المدينة",
      "latitude": 32.8872,
      "longitude": 13.1913,
      "phone": "+218 91 1234567",
      "tags": ["supermarket", "large"]
    },
    {
      "id": "amal-tripoli",
      "name": "Al-Amal Store",
      "nameAr": "متجر الأمل",
      "city": "طرابلس",
      "area": "السراج",
      "latitude": 32.8752,
      "longitude": 13.1763,
      "tags": ["supermarket", "medium"]
    },
    {
      "id": "najma-benghazi",
      "name": "Al-Najma Supermarket",
      "nameAr": "سوبر ماركت النجمة",
      "city": "بنغازي",
      "area": "شارع عمر المختار",
      "latitude": 32.1194,
      "longitude": 20.0868,
      "tags": ["supermarket", "large"]
    },
    {
      "id": "wahda-misrata",
      "name": "Al-Wahda Supermarket",
      "nameAr": "سوبر ماركت الوحدة",
      "city": "مصراتة",
      "area": "وسط المدينة",
      "latitude": 32.3754,
      "longitude": 15.0925,
      "tags": ["supermarket"]
    }
  ]
}
```

### Store Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier |
| `name` | ✅ | English name |
| `nameAr` | Recommended | Arabic name |
| `city` | ✅ | City name (in Arabic preferred) |
| `area` | Recommended | Neighborhood/district |
| `address` | Optional | Full address |
| `addressAr` | Optional | Arabic address |
| `latitude` | Recommended | GPS latitude |
| `longitude` | Recommended | GPS longitude |
| `phone` | Optional | Phone number |
| `tags` | Optional | Array: supermarket, pharmacy, convenience, etc. |

### Libyan Cities Reference:
- `طرابلس` (Tripoli)
- `بنغازي` (Benghazi)
- `مصراتة` (Misrata)
- `الزاوية` (Zawiya)
- `زليتن` (Zliten)
- `البيضاء` (Bayda)
- `طبرق` (Tobruk)
- `سبها` (Sabha)
- `سرت` (Sirte)
- `الخمس` (Khoms)

---

## 8️⃣ Store Availability

Which stores sell which alternative products.

```json
{
  "storeAvailability": [
    {
      "storeId": "riyada-tripoli-main",
      "alternativeProductId": "rc-cola-330ml",
      "priceMin": 3.5,
      "priceMax": 4.5,
      "currency": "LYD"
    },
    {
      "storeId": "riyada-tripoli-main",
      "alternativeProductId": "libyan-cola-330ml",
      "priceMin": 2.5,
      "priceMax": 3.5,
      "currency": "LYD"
    },
    {
      "storeId": "amal-tripoli",
      "alternativeProductId": "rc-cola-330ml",
      "priceMin": 3.0,
      "priceMax": 4.0,
      "currency": "LYD"
    },
    {
      "storeId": "najma-benghazi",
      "alternativeProductId": "rc-cola-330ml",
      "priceMin": 3.5,
      "priceMax": 5.0,
      "currency": "LYD"
    }
  ]
}
```

### Store Availability Fields:
| Field | Required | Description |
|-------|----------|-------------|
| `storeId` | ✅ | ID of store |
| `alternativeProductId` | ✅ | ID of alternative product |
| `priceMin` | Optional | Minimum price |
| `priceMax` | Optional | Maximum price |
| `currency` | Default "LYD" | Currency code |

---

## 📄 Complete Example File

Here's a minimal complete example:

```json
{
  "categories": [
    { "id": "beverages", "nameEn": "Beverages", "nameAr": "المشروبات", "icon": "🥤" }
  ],
  
  "companies": [
    {
      "id": "coca-cola-company",
      "nameEn": "The Coca-Cola Company",
      "nameAr": "شركة كوكا كولا",
      "country": "USA",
      "verdict": "AVOID",
      "confidence": "HIGH"
    },
    {
      "id": "rc-intl",
      "nameEn": "RC Cola International",
      "nameAr": "آر سي كولا",
      "verdict": "PREFERRED",
      "confidence": "HIGH"
    }
  ],
  
  "brands": [
    { "id": "coca-cola", "nameEn": "Coca-Cola", "nameAr": "كوكا كولا", "companyId": "coca-cola-company" },
    { "id": "rc-cola", "nameEn": "RC Cola", "nameAr": "آر سي كولا", "companyId": "rc-intl" }
  ],
  
  "products": [
    {
      "id": "coke-330",
      "nameEn": "Coca-Cola 330ml",
      "nameAr": "كوكا كولا 330 مل",
      "barcode": "5449000000996",
      "brandId": "coca-cola",
      "categoryId": "beverages",
      "verdict": "AVOID",
      "confidence": "HIGH"
    },
    {
      "id": "rc-330",
      "nameEn": "RC Cola 330ml",
      "nameAr": "آر سي كولا 330 مل",
      "brandId": "rc-cola",
      "categoryId": "beverages",
      "verdict": "PREFERRED",
      "confidence": "HIGH"
    }
  ],
  
  "claims": [
    {
      "id": "coke-occupation",
      "titleEn": "Support for occupation",
      "titleAr": "دعم الاحتلال",
      "descriptionEn": "Company supports occupation through investments",
      "descriptionAr": "الشركة تدعم الاحتلال من خلال استثماراتها",
      "issueType": "OCCUPATION",
      "confidence": "HIGH",
      "appliesToCompanyId": "coca-cola-company",
      "evidence": [
        { "url": "https://example.com/evidence", "title": "Evidence Report" }
      ]
    }
  ],
  
  "alternatives": [
    {
      "boycottedProductId": "coke-330",
      "alternativeProductId": "rc-330",
      "isExactAlternative": true
    }
  ],
  
  "stores": [
    {
      "id": "store-1",
      "name": "Al-Riyada",
      "nameAr": "الريادة",
      "city": "طرابلس",
      "latitude": 32.8872,
      "longitude": 13.1913
    }
  ],
  
  "storeAvailability": [
    {
      "storeId": "store-1",
      "alternativeProductId": "rc-330",
      "priceMin": 3.5,
      "priceMax": 4.5
    }
  ]
}
```

---

## 🖼️ Image & Logo Summary

| Entity | Field | Purpose |
|--------|-------|---------|
| **Company** | `logoUrl` | Company logo (displayed on company pages) |
| **Brand** | `logoUrl` | Brand logo (displayed on brand/product cards) |
| **Product** | `imageUrl` | Main product image |
| **Product** | `images[]` | Array of additional product images |

### Image Tips:
- Use direct image URLs (ending in `.png`, `.jpg`, `.webp`)
- Prefer square images for logos (e.g., 200x200, 500x500)
- Product images should show the actual product packaging
- Use HTTPS URLs for security

---

## ✅ Checklist Before Submitting

- [ ] All IDs are unique and consistent
- [ ] `companyId` in brands matches a company ID
- [ ] `brandId` in products matches a brand ID
- [ ] `categoryId` in products matches a category ID
- [ ] `boycottedProductId` and `alternativeProductId` match product IDs
- [ ] `storeId` and `alternativeProductId` in availability match their respective IDs
- [ ] Arabic text is included for user-facing content
- [ ] At least one evidence source for each claim

---

## 📍 How to Get GPS Coordinates

1. Open Google Maps
2. Find the store location
3. Right-click on the exact location
4. Click on the coordinates to copy them
5. First number is latitude, second is longitude

Example: `32.8872, 13.1913`

---

## 🚀 Next Steps

1. Create folder: `backend/data/`
2. Create file: `backend/data/boycott_data.json`
3. Start with categories and a few companies
4. Add brands and products incrementally
5. Run the import script to populate the database

