/**
 * Centralized product data for the MedBay demo.
 * Source: https://medbayint.com/shop/ (see /data/source-content.json and /CONTENT-MIGRATION.md).
 * All prices are stored once, in AED (the site's base currency) — see /data/currency.js
 * for how they are converted/displayed in other currencies.
 */
window.PRODUCTS = [
  { id: "protack-5mm", name: "Covidien MEDTRONIC PROTACK 5MM with 30 Titanium Helical Fasteners", sku: "174006", category: "General Surgery", manufacturer: "Covidien / Medtronic", priceAED: 200.00, purchaseType: "quote" },
  { id: "excalibur-anchor-30", name: "3.0mm Excalibur Screw Anchor Titanium – Double Suture with Needle", sku: "TM05112130", category: "Orthopedic Surgery", manufacturer: "Excalibur", priceAED: 38.00, purchaseType: "quote" },
  { id: "excalibur-anchor-50", name: "5.0mm Excalibur Screw Anchor Titanium – Double Suture with Needles", sku: "TM05112150", category: "Orthopedic Surgery", manufacturer: "Excalibur", priceAED: 38.00, purchaseType: "quote" },
  { id: "abbott-guidewire", name: "Abbott Balance Middleweight Guide Wire with MICROGLIDE Coating", sku: "1001780", category: "Radiology & Interventional Radiology", manufacturer: "Abbott", priceAED: 38.00, purchaseType: "quote" },
  { id: "acrysof-lens", name: "AcrySof SA60AT Intraocular Lens", sku: "SA60AT", category: "Ophthalmology", manufacturer: "Alcon", priceAED: 50.00, purchaseType: "quote" },
  { id: "amcrylate-adhesive", name: "Amcrylate Surgical Bio-Adhesive – Iso Amyl 2-Cyanoacrylate 0.25ml", sku: null, category: "General Surgery", manufacturer: "Amcrylate", priceAED: 18.00, purchaseType: "quote" },
  { id: "bojin-drill", name: "Bojin BJ1303B Cannulated Surgical Drill – Cordless Power Tool", sku: null, category: "Orthopedic Surgery", manufacturer: "Bojin", priceAED: 600.00, purchaseType: "quote" },
  { id: "boston-guidewire", name: "Boston Scientific Zebra Straight Tip Guidewire – 0.035in x 150cm", sku: "M0066701120", category: "Radiology & Interventional Radiology", manufacturer: "Boston Scientific", priceAED: 20.00, purchaseType: "quote" },
  { id: "covidien-eea-stapler", name: "Covidien EEA Circular Stapler with Tri-Staple Technology – 31mm", sku: "TRIEEA31MT", category: "General Surgery", manufacturer: "Covidien", priceAED: 300.00, purchaseType: "quote" },
  { id: "covidien-endogia-reload", name: "Covidien Endo GIA Articulating Reload", sku: "EGIA60AMT", category: "General Surgery", manufacturer: "Covidien", priceAED: 50.00, purchaseType: "quote" },
  { id: "covidien-endogia-60", name: "Covidien Endo GIA Universal Loading Unit 60mm", sku: "030415", category: "General Surgery", manufacturer: "Covidien", priceAED: 36.00, purchaseType: "quote" },
  { id: "covidien-endogia-60-35", name: "Covidien Endo GIA Universal Loading Unit 60mm – 3.5mm", sku: "030414", category: "General Surgery", manufacturer: "Covidien", priceAED: 36.00, purchaseType: "quote" }
];

/**
 * Bilingual search aliases: EN/AR terms mapped to the MedBay specialty/category
 * they should surface. Lets search work in either language regardless of the
 * active UI language (per the localization spec). Extend this list as real
 * DentalBay/consumer categories become available.
 */
window.SEARCH_ALIASES = [
  { category: "Anesthesiology and Critical Care", terms: ["anesthesiology", "critical care", "anesthesia", "تخدير", "رعاية حرجة", "العناية المركزة"] },
  { category: "Dentistry", terms: ["dentistry", "dental", "oral", "teeth", "أسنان", "فم", "طب الأسنان"] },
  { category: "Dermatology", terms: ["dermatology", "skin", "بشرة", "جلدية"] },
  { category: "Emergency Medicine", terms: ["emergency", "طوارئ"] },
  { category: "General Surgery", terms: ["general surgery", "surgery", "جراحة", "جراحة عامة"] },
  { category: "Internal Medicine", terms: ["internal medicine", "الباطنة", "طب باطني"] },
  { category: "Medical Laboratories", terms: ["laboratory", "lab", "مختبر", "مختبرات"] },
  { category: "Obstetrics & Gynecology (OB/GYN)", terms: ["ob/gyn", "obstetrics", "gynecology", "نساء وتوليد", "نسائية"] },
  { category: "Ophthalmology", terms: ["ophthalmology", "eye", "vision", "عيون", "طب العيون"] },
  { category: "Orthopedic Surgery", terms: ["orthopedic", "orthopedics", "bone", "عظام", "جراحة العظام"] },
  { category: "Otolaryngology (ENT Surgery)", terms: ["ent", "otolaryngology", "أنف وأذن وحنجرة", "أنف"] },
  { category: "Pathology", terms: ["pathology", "علم الأمراض"] },
  { category: "Radiology & Interventional Radiology", terms: ["radiology", "imaging", "أشعة", "تصوير"] },
  { category: "Urology", terms: ["urology", "مسالك بولية", "بولية"] }
];
