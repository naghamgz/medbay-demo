/**
 * Payment provider configuration TEMPLATE.
 *
 * Copy this file to config/payment.js and fill in PUBLIC values only.
 * config/payment.js is gitignored — never commit real endpoint URLs or
 * provider identifiers if they reveal anything sensitive about your setup,
 * and NEVER put secret/private API keys, server secrets, or merchant
 * passwords in this file or anywhere under build/ — those belong only on
 * your backend/serverless environment, never in frontend code.
 *
 * build/js/payment-adapter.js reads window.PAYMENT_CONFIG at runtime, so if
 * you do load this in the browser, include it as a plain <script> tag
 * before payment-adapter.js.
 */
window.PAYMENT_CONFIG = {
  // Which adapter branch payment-adapter.js should use, e.g. "stripe", "paypal", "telr", "paytabs".
  PUBLIC_PAYMENT_PROVIDER: "",

  // Your backend/serverless endpoint that creates a checkout session server-side.
  // Must accept a POST with the order payload and return { redirectUrl }.
  PUBLIC_CHECKOUT_ENDPOINT: "",

  // Any provider "publishable"/"client" key is safe here (never a secret key).
  PUBLIC_PROVIDER_CLIENT_KEY: "",
};
