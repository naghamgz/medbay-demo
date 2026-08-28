/**
 * Payment provider abstraction.
 *
 * The frontend never talks to a payment gateway directly and never holds
 * secret keys — those live only on a backend/serverless endpoint you control.
 * This file only defines the interface the checkout page calls, plus a demo
 * fallback so the static site works with no backend at all.
 *
 * To go live:
 *   1. Stand up a backend/serverless endpoint (see README.md) that creates a
 *      checkout session with your provider (Stripe Checkout, PayPal, or a
 *      UAE/GCC gateway such as Telr, PayTabs, Network International, etc.)
 *      using that provider's SECRET key — never expose it to the browser.
 *   2. Copy config/payment.example.js to config/payment.js and set
 *      PUBLIC_PAYMENT_PROVIDER / PUBLIC_CHECKOUT_ENDPOINT to your values.
 *      Only PUBLIC_ values belong in frontend config — no secrets, ever.
 *   3. Set window.SITE_CONFIG.paymentsEnabled = true (js/site-config.js).
 *   4. Implement the provider branch below to POST the order to
 *      PUBLIC_CHECKOUT_ENDPOINT and redirect to the URL it returns.
 *
 * No checkout markup or flow needs to change when you do this — only this
 * file and the config.
 */
window.PaymentProvider = {
  /**
   * @param {{items: Array, subtotalAED: number, currency: string, customer: object}} order
   * @returns {Promise<void>}
   */
  async createCheckout(order) {
    const paymentsEnabled = window.SITE_CONFIG && window.SITE_CONFIG.paymentsEnabled;

    if (!paymentsEnabled) {
      return window.PaymentProvider._demoCheckout(order);
    }

    // Example production shape (uncomment and adapt once a backend exists):
    //
    // const endpoint = window.PAYMENT_CONFIG.PUBLIC_CHECKOUT_ENDPOINT;
    // const res = await fetch(endpoint, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(order),
    // });
    // const { redirectUrl } = await res.json();
    // window.location.href = redirectUrl;

    throw new Error("paymentsEnabled is true but no live provider is wired up in payment-adapter.js yet.");
  },

  /** Demo-mode placeholder used while paymentsEnabled is false. */
  _demoCheckout(order) {
    return new Promise((resolve) => {
      const modal = document.querySelector("[data-payment-demo-modal]");
      if (modal) {
        modal.classList.add("is-open");
      } else {
        window.alert("Secure payment gateway will be connected for production.");
      }
      resolve(order);
    });
  },
};
