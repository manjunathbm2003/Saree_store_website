/**
 * Razorpay payment helpers — configure when payment flow is implemented.
 */

export type CreateRazorpayOrderInput = {
  amount: number;
  currency?: string;
  receipt: string;
};

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
};

export async function createRazorpayOrder(
  input: CreateRazorpayOrderInput,
): Promise<RazorpayOrder> {
  // TODO: call Razorpay Orders API
  return {
    id: `order_${input.receipt}`,
    amount: input.amount,
    currency: input.currency ?? "INR",
    receipt: input.receipt,
  };
}

export async function verifyRazorpayPayment(_payload: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<boolean> {
  // TODO: verify signature with RAZORPAY_KEY_SECRET
  return false;
}
