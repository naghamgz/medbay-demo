/**
 * Currency configuration for the MedBay demo.
 *
 * All product prices are authored once in AED (see /data/products.js and the
 * inline `data-price-aed` attributes on price elements throughout the site).
 * Everything else is derived from these static exchange rates.
 *
 * IMPORTANT — PRODUCTION NOTE:
 * These rates are hardcoded for demo purposes only and are NOT live. Before
 * going to production, replace CURRENCY.exchangeRates with values fetched
 * from a trusted, licensed FX data provider (or your own backend/serverless
 * endpoint that proxies one) on a reasonable refresh interval. Do not ship
 * static rates as if they were current market rates.
 */
window.CURRENCY = {
  baseCurrency: "AED",
  // Approximate rates relative to 1 AED, set at authoring time — NOT live.
  exchangeRates: {
    AED: 1,
    USD: 0.272,
    SAR: 1.02,
    EGP: 13.4,
  },
  symbols: {
    AED: "AED",
    USD: "USD",
    SAR: "SAR",
    EGP: "EGP",
  },
  decimals: {
    AED: 2,
    USD: 2,
    SAR: 2,
    EGP: 2,
  },
};

/** Convert an AED amount to the given currency code. */
function convertFromAED(amountAED, currencyCode) {
  const rate = window.CURRENCY.exchangeRates[currencyCode] ?? 1;
  return amountAED * rate;
}

/** Format an AED amount for display in the given currency, e.g. "USD 81.40". */
function formatPrice(amountAED, currencyCode) {
  const code = currencyCode || window.CURRENCY.baseCurrency;
  const converted = convertFromAED(amountAED, code);
  const decimals = window.CURRENCY.decimals[code] ?? 2;
  const formatted = converted.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${window.CURRENCY.symbols[code] || code} ${formatted}`;
}
