// ============================================================
// Floor — Instant Payout Service (Razorpay Sandbox Simulation)
// Phase 3: Real payment gateway integration simulation
// ============================================================
const crypto = require("crypto");

// Razorpay sandbox API simulation (no real keys needed for demo)
// In production: replace with actual Razorpay SDK + real keys
const RAZORPAY_KEY_ID  = process.env.RAZORPAY_KEY_ID  || "rzp_test_FloorInsurtech2026";
const RAZORPAY_SECRET  = process.env.RAZORPAY_SECRET  || "floor_razorpay_test_secret_key";

/**
 * Generate a realistic Razorpay-format Order ID
 */
function generateOrderId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const suffix = Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `order_${suffix}`;
}

/**
 * Generate a realistic Razorpay Payment ID
 */
function generatePaymentId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const suffix = Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `pay_${suffix}`;
}

/**
 * Generate a Razorpay-style HMAC signature for verification
 */
function generateSignature(orderId, paymentId) {
  return crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

/**
 * Simulate instant UPI payout.
 * In production, this would call Razorpay Payout API:
 * POST https://api.razorpay.com/v1/payouts
 * 
 * @param {object} params
 * @param {number} params.amount - amount in INR (₹)
 * @param {string} params.upiId  - worker's UPI VPA (e.g., "rajesh@upi")
 * @param {string} params.name   - beneficiary name
 * @param {string} params.purpose - "insurance_claim_payout"
 * @returns {object} payout result with gateway IDs
 */
async function initiateUPIPayout({ amount, upiId, name, purpose = "insurance_claim_payout" }) {
  const startTime = Date.now();

  // Simulate Razorpay processing latency (800ms - 2.5s)
  const processingTime = 800 + Math.random() * 1700;
  await new Promise(resolve => setTimeout(resolve, processingTime));

  const orderId   = generateOrderId();
  const paymentId = generatePaymentId();
  const signature = generateSignature(orderId, paymentId);

  // Simulate ~95% success rate (real Razorpay UPI success rate)
  const success = Math.random() > 0.05;

  const result = {
    success,
    gatewayOrderId:   orderId,
    gatewayPaymentId: success ? paymentId : null,
    gatewaySignature: success ? signature : null,
    upiId,
    amount,
    currency: "INR",
    method: "upi",
    processingMs: Date.now() - startTime,
    processedAt: new Date(),
    gatewayResponse: success
      ? {
          entity: "payment",
          id: paymentId,
          order_id: orderId,
          amount: amount * 100, // Razorpay uses paise
          currency: "INR",
          status: "captured",
          method: "upi",
          vpa: upiId,
          description: purpose,
          captured: true,
          created_at: Math.floor(Date.now() / 1000),
          key_id: RAZORPAY_KEY_ID,
        }
      : {
          error_code: "BAD_REQUEST_ERROR",
          error_description: "UPI ID not registered or temporarily unavailable",
          error_source: "gateway",
          error_step: "payment_initiation",
        },
  };

  return result;
}

/**
 * Verify a completed payout signature (anti-tampering check)
 */
function verifyPayoutSignature(orderId, paymentId, signature) {
  const expectedSig = generateSignature(orderId, paymentId);
  return expectedSig === signature;
}

/**
 * Calculate UPI ID for a worker from their phone number (standard practice)
 * Most Indian banks auto-assign <phone>@upi or <phone>@paytm etc.
 */
function deriveUPIId(phone, platform) {
  const clean = phone.replace(/\D/g, "").slice(-10);
  const upiSuffixes = { zomato: "zomato", swiggy: "oksbi", zepto: "paytm", blinkit: "ybl", dunzo: "apl" };
  const suffix = upiSuffixes[platform] || "upi";
  return `${clean}@${suffix}`;
}

module.exports = { initiateUPIPayout, verifyPayoutSignature, deriveUPIId };
