/**
 * Shipping provider helpers — configure when fulfillment is implemented.
 */

export type ShipmentQuote = {
  provider: string;
  amount: number;
  estimatedDays: number;
};

export async function getShippingQuote(_input: {
  postalCode: string;
  weightGrams: number;
}): Promise<ShipmentQuote> {
  // TODO: integrate shipping provider API
  return {
    provider: "standard",
    amount: 0,
    estimatedDays: 5,
  };
}

export async function createShipment(_input: {
  orderId: string;
  addressId: string;
}): Promise<{ trackingNumber: string; provider: string }> {
  // TODO: create shipment with provider
  return {
    trackingNumber: "",
    provider: "standard",
  };
}
