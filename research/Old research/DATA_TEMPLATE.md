# 📝 Quick Data Entry Template

Copy and fill these templates, then paste into `backend/data/boycott_data.json`.

---

## ⭐ Key Features

| Feature | How to Use |
|---------|------------|
| **Multiple Alternatives** | Add multiple entries with same `boycottedProductId`, different `alternativeProductId` |
| **Logos/Images** | Use `logoUrl` for companies/brands, `imageUrl` for products |
| **Company Hierarchy** | Use `parentId` to link subsidiary to parent company |

---

## 🏢 Company Template (To Boycott)

```json
{
  "id": "company-name-lowercase",
  "nameEn": "Company Name in English",
  "nameAr": "اسم الشركة بالعربية",
  "country": "USA",
  "logoUrl": "https://example.com/logos/company.png",
  "verdict": "AVOID",
  "confidence": "HIGH"
}
```

## 🏢 Company Template (Safe Alternative)

```json
{
  "id": "safe-company-name",
  "nameEn": "Safe Company Name",
  "nameAr": "اسم الشركة الآمنة",
  "country": "Libya",
  "logoUrl": "https://example.com/logos/safe-company.png",
  "verdict": "PREFERRED",
  "confidence": "HIGH"
}
```

---

## 🏷️ Brand Template

```json
{
  "id": "brand-name-lowercase",
  "nameEn": "Brand Name",
  "nameAr": "اسم العلامة التجارية",
  "companyId": "company-id-here",
  "logoUrl": "https://example.com/logos/brand.png"
}
```

---

## 📦 Product Template (To Boycott)

```json
{
  "id": "product-name-lowercase",
  "nameEn": "Product Name 330ml",
  "nameAr": "اسم المنتج 330 مل",
  "barcode": "1234567890123",
  "brandId": "brand-id-here",
  "categoryId": "beverages",
  "imageUrl": "https://example.com/products/product.jpg",
  "verdict": "AVOID",
  "confidence": "HIGH"
}
```

## 📦 Product Template (Alternative)

```json
{
  "id": "alternative-product-name",
  "nameEn": "Alternative Product Name",
  "nameAr": "اسم المنتج البديل",
  "barcode": "9876543210123",
  "brandId": "safe-brand-id",
  "categoryId": "beverages",
  "imageUrl": "https://example.com/products/alternative.jpg",
  "verdict": "PREFERRED",
  "confidence": "HIGH"
}
```

---

## ⚠️ Claim Template (Why to Boycott)

```json
{
  "id": "claim-id-unique",
  "titleEn": "Title of the reason",
  "titleAr": "عنوان السبب",
  "descriptionEn": "Detailed explanation in English of why this company/product should be boycotted.",
  "descriptionAr": "شرح مفصل بالعربية لسبب مقاطعة هذه الشركة/المنتج.",
  "issueType": "OCCUPATION",
  "confidence": "HIGH",
  "appliesToCompanyId": "company-id-here",
  "evidence": [
    {
      "url": "https://source-link.com/article",
      "title": "Article or Report Title",
      "publisher": "Publisher Name"
    }
  ]
}
```

**Issue Types:** `OCCUPATION`, `FUNDING`, `HUMAN_RIGHTS`, `LABOR`, `ENVIRONMENTAL`, `OTHER`

---

## 🔄 Alternative Link Template

> ⭐ **One product can have MULTIPLE alternatives!** Add multiple entries with the same `boycottedProductId`.

```json
{
  "boycottedProductId": "boycotted-product-id",
  "alternativeProductId": "alternative-1-id",
  "isExactAlternative": true,
  "notes": "First alternative option",
  "notesAr": "البديل الأول"
}
```

### Example: Multiple Alternatives for One Product

```json
[
  {
    "boycottedProductId": "coca-cola-330ml",
    "alternativeProductId": "rc-cola-330ml",
    "isExactAlternative": true,
    "notes": "International alternative"
  },
  {
    "boycottedProductId": "coca-cola-330ml",
    "alternativeProductId": "libyan-cola-330ml",
    "isExactAlternative": true,
    "notes": "Local Libyan option"
  },
  {
    "boycottedProductId": "coca-cola-330ml",
    "alternativeProductId": "mecca-cola-330ml",
    "isExactAlternative": true,
    "notes": "Halal alternative"
  }
]
```

---

## 🏪 Store Template

```json
{
  "id": "store-name-city",
  "name": "Store Name",
  "nameAr": "اسم المتجر",
  "city": "طرابلس",
  "area": "اسم المنطقة",
  "latitude": 32.8872,
  "longitude": 13.1913,
  "tags": ["supermarket"]
}
```

**Libyan Cities:** `طرابلس`, `بنغازي`, `مصراتة`, `الزاوية`, `زليتن`, `البيضاء`, `طبرق`, `سبها`, `سرت`, `الخمس`

---

## 📍 Store Availability Template

```json
{
  "storeId": "store-id-here",
  "alternativeProductId": "alternative-product-id",
  "priceMin": 3.5,
  "priceMax": 4.5,
  "currency": "LYD"
}
```

---

## 📂 Available Categories

| ID | English | العربية |
|----|---------|---------|
| `beverages` | Beverages | المشروبات |
| `snacks` | Snacks & Chips | الوجبات الخفيفة والشيبس |
| `dairy` | Dairy Products | منتجات الألبان |
| `chocolate` | Chocolate & Candy | الشوكولاتة والحلويات |
| `coffee-tea` | Coffee & Tea | القهوة والشاي |
| `personal-care` | Personal Care | العناية الشخصية |
| `cleaning` | Cleaning Products | منتجات التنظيف |
| `baby` | Baby Products | منتجات الأطفال |
| `food` | Food & Groceries | الطعام والبقالة |
| `fast-food` | Fast Food & Restaurants | الوجبات السريعة والمطاعم |

---

## ✅ Verdict Values

| Value | Meaning | Usage |
|-------|---------|-------|
| `AVOID` | 🔴 Boycott | Products/companies to boycott |
| `CAUTION` | 🟡 Use with caution | Partial ownership, unclear info |
| `UNKNOWN` | ⚪ Unknown status | Not enough information |
| `PREFERRED` | 🟢 Recommended | Safe alternatives |

---

## 🔐 Confidence Levels

| Value | Meaning |
|-------|---------|
| `HIGH` | Strong evidence, verified |
| `MEDIUM` | Some evidence, needs verification |
| `LOW` | Limited evidence, uncertain |

---

## 🖼️ Image/Logo Fields

| Entity | Field | Description |
|--------|-------|-------------|
| Company | `logoUrl` | Company logo (optional) |
| Brand | `logoUrl` | Brand logo (optional) |
| Product | `imageUrl` | Main product image (optional) |
| Product | `images` | Array of additional images (optional) |

**Tips:**
- Use direct image URLs (`.png`, `.jpg`, `.webp`)
- Square images work best for logos
- All image fields are optional

---

## 📋 Complete Example Entry

Here's a complete example adding **Coca-Cola** with **multiple alternatives**:

### 1. Add to `companies` array:
```json
{
  "id": "coca-cola-company",
  "nameEn": "The Coca-Cola Company",
  "nameAr": "شركة كوكا كولا",
  "country": "USA",
  "logoUrl": "https://example.com/logos/coca-cola-company.png",
  "verdict": "AVOID",
  "confidence": "HIGH"
},
{
  "id": "rc-cola-intl",
  "nameEn": "RC Cola International",
  "nameAr": "شركة آر سي كولا",
  "country": "USA",
  "logoUrl": "https://example.com/logos/rc-cola.png",
  "verdict": "PREFERRED",
  "confidence": "HIGH"
},
{
  "id": "libyan-beverages",
  "nameEn": "Libyan Beverages Co",
  "nameAr": "شركة المشروبات الليبية",
  "country": "Libya",
  "verdict": "PREFERRED",
  "confidence": "HIGH"
}
```

### 2. Add to `brands` array:
```json
{
  "id": "coca-cola",
  "nameEn": "Coca-Cola",
  "nameAr": "كوكا كولا",
  "companyId": "coca-cola-company",
  "logoUrl": "https://example.com/logos/coca-cola-brand.png"
},
{
  "id": "rc-cola",
  "nameEn": "RC Cola",
  "nameAr": "آر سي كولا",
  "companyId": "rc-cola-intl",
  "logoUrl": "https://example.com/logos/rc-cola-brand.png"
},
{
  "id": "libyan-cola",
  "nameEn": "Libyan Cola",
  "nameAr": "كولا ليبيا",
  "companyId": "libyan-beverages"
}
```

### 3. Add to `products` array:
```json
{
  "id": "coca-cola-330ml",
  "nameEn": "Coca-Cola 330ml",
  "nameAr": "كوكا كولا 330 مل",
  "barcode": "5449000000996",
  "brandId": "coca-cola",
  "categoryId": "beverages",
  "imageUrl": "https://example.com/products/coca-cola.jpg",
  "verdict": "AVOID",
  "confidence": "HIGH"
},
{
  "id": "rc-cola-330ml",
  "nameEn": "RC Cola 330ml",
  "nameAr": "آر سي كولا 330 مل",
  "brandId": "rc-cola",
  "categoryId": "beverages",
  "imageUrl": "https://example.com/products/rc-cola.jpg",
  "verdict": "PREFERRED",
  "confidence": "HIGH"
},
{
  "id": "libyan-cola-330ml",
  "nameEn": "Libyan Cola 330ml",
  "nameAr": "كولا ليبيا 330 مل",
  "brandId": "libyan-cola",
  "categoryId": "beverages",
  "imageUrl": "https://example.com/products/libyan-cola.jpg",
  "verdict": "PREFERRED",
  "confidence": "HIGH"
}
```

### 4. Add to `claims` array:
```json
{
  "id": "coca-cola-occupation",
  "titleEn": "Support for Israeli occupation",
  "titleAr": "دعم الاحتلال الإسرائيلي",
  "descriptionEn": "The Coca-Cola Company has significant business operations and investments that support the Israeli occupation.",
  "descriptionAr": "لشركة كوكا كولا عمليات تجارية واستثمارات كبيرة تدعم الاحتلال الإسرائيلي.",
  "issueType": "OCCUPATION",
  "confidence": "HIGH",
  "appliesToCompanyId": "coca-cola-company",
  "evidence": [
    {
      "url": "https://bdsmovement.net/coca-cola",
      "title": "BDS Movement - Coca-Cola",
      "publisher": "BDS Movement"
    }
  ]
}
```

### 5. Add to `alternatives` array (⭐ MULTIPLE alternatives!):
```json
{
  "boycottedProductId": "coca-cola-330ml",
  "alternativeProductId": "rc-cola-330ml",
  "isExactAlternative": true,
  "notes": "International alternative, similar taste",
  "notesAr": "بديل عالمي، طعم مشابه"
},
{
  "boycottedProductId": "coca-cola-330ml",
  "alternativeProductId": "libyan-cola-330ml",
  "isExactAlternative": true,
  "notes": "Local Libyan product, support local economy",
  "notesAr": "منتج ليبي محلي، دعم الاقتصاد المحلي"
}
```

### 6. Add to `stores` array:
```json
{
  "id": "riyada-tripoli",
  "name": "Al-Riyada Supermarket",
  "nameAr": "سوبر ماركت الريادة",
  "city": "طرابلس",
  "area": "وسط المدينة",
  "latitude": 32.8872,
  "longitude": 13.1913,
  "tags": ["supermarket"]
}
```

### 7. Add to `storeAvailability` array:
```json
{
  "storeId": "riyada-tripoli",
  "alternativeProductId": "rc-cola-330ml",
  "priceMin": 3.5,
  "priceMax": 4.5,
  "currency": "LYD"
},
{
  "storeId": "riyada-tripoli",
  "alternativeProductId": "libyan-cola-330ml",
  "priceMin": 2.5,
  "priceMax": 3.5,
  "currency": "LYD"
}
```

---

## 🚀 After Filling Data

Run these commands from the `backend` directory:

```bash
# Setup database (first time only)
npm run db:push

# Import your data
npm run db:import

# Or clear everything and reimport
npm run db:import:clear
```

