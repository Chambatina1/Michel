/**
 * Shipping Rate Calculator for P&S Medical Device Inc.
 *
 * Provides realistic shipping rate calculations for UPS, FedEx, and USPS
 * based on weight, freight requirements, and destination zone.
 */

export interface ShippingRate {
  carrier: 'UPS' | 'FedEx' | 'USPS';
  service: string;
  estimatedDays: string;
  price: number;
}

export interface ShippingOption {
  id: string;
  carrier: string;
  service: string;
  estimatedDays: string;
  price: number;
  requiresSignature: boolean;
  description: string;
}

/**
 * Determine shipping zone multiplier from ZIP code first digit.
 * Zone 1 = East Coast (closest to FL warehouse), Zone 8 = West Coast.
 */
function getZoneMultiplier(zip?: string): number {
  if (!zip || zip.length < 3) return 1.0;

  const firstDigit = parseInt(zip.charAt(0), 10);

  // Zone multipliers based on distance from Winter Park, FL (32792)
  const zoneMap: Record<number, number> = {
    0: 1.10, // CT, MA, ME, NH, NJ, NY, PR, RI, VT
    1: 1.05, // CT, MA, ME, NH, NJ, NY, PR, RI, VT
    2: 1.00, // FL, SC, NC, GA, VA (home zone)
    3: 1.10, // AL, TN, KY, MS, OH
    4: 1.20, // IN, MI, WI, IL
    5: 1.30, // IA, MN, MT, ND, SD
    6: 1.35, // KS, MO, NE, OK
    7: 1.40, // AR, LA, TX
    8: 1.50, // CO, ID, MT, WY
    9: 1.55, // AK, AZ, CA, HI, NV, OR, WA
  };

  return zoneMap[firstDigit] || 1.0;
}

/**
 * Calculate base shipping cost by weight range (before zone multiplier).
 */
function getBaseRate(totalWeight: number): number {
  if (totalWeight <= 1) return 12;
  if (totalWeight <= 5) return 18;
  if (totalWeight <= 10) return 28;
  if (totalWeight <= 25) return 45;
  if (totalWeight <= 50) return 85;
  if (totalWeight <= 70) return 130;
  if (totalWeight <= 100) return 200;
  if (totalWeight <= 150) return 350;
  // Freight range
  if (totalWeight <= 500) return 600;
  if (totalWeight <= 1000) return 1000;
  if (totalWeight <= 2000) return 1600;
  if (totalWeight <= 5000) return 2500;
  return 3500;
}

/**
 * Calculate freight-specific rates based on weight class.
 */
function getFreightRates(totalWeight: number, subtotal: number): ShippingOption[] {
  const baseFreight = getBaseRate(totalWeight);

  const ltlPrice = Math.round(baseFreight * 0.9);
  const whiteGlovePrice = Math.round(baseFreight * 1.5);

  const options: ShippingOption[] = [
    {
      id: 'ltl-freight',
      carrier: 'LTL Freight',
      service: 'LTL Freight Shipping',
      estimatedDays: '7-14 business days',
      price: ltlPrice,
      requiresSignature: true,
      description:
        'Standard Less-Than-Truckload freight. Includes delivery to loading dock or curbside. For professional installation, contact our team.',
    },
    {
      id: 'white-glove',
      carrier: 'White Glove',
      service: 'White Glove Delivery',
      estimatedDays: '14-21 business days',
      price: whiteGlovePrice,
      requiresSignature: true,
      description:
        'Premium inside delivery with unpacking and debris removal. Our team coordinates scheduling with your facility. Ideal for sensitive medical equipment.',
    },
  ];

  // Free shipping on orders over $50,000
  if (subtotal >= 50000) {
    return options.map((opt) => ({
      ...opt,
      price: 0,
      description: opt.price === 0
        ? 'FREE with your order over $50,000'
        : opt.description,
    }));
  }

  return options;
}

/**
 * Calculate standard shipping rates (non-freight).
 */
function getStandardRates(
  totalWeight: number,
  subtotal: number,
  zoneMultiplier: number
): ShippingOption[] {
  const baseRate = getBaseRate(totalWeight);
  const isFreeShipping = subtotal >= 50000;

  const rates: ShippingOption[] = [
    {
      id: 'usps-priority',
      carrier: 'USPS',
      service: 'USPS Priority Mail',
      estimatedDays: '2-4 business days',
      price: isFreeShipping ? 0 : Math.round(baseRate * 0.85 * zoneMultiplier),
      requiresSignature: false,
      description: totalWeight <= 70
        ? 'Affordable shipping for smaller items and accessories.'
        : 'Available for packages under 70 lbs.',
    },
    {
      id: 'ups-ground',
      carrier: 'UPS',
      service: 'UPS Ground',
      estimatedDays: '5-7 business days',
      price: isFreeShipping ? 0 : Math.round(baseRate * 1.0 * zoneMultiplier),
      requiresSignature: false,
      description: 'Reliable ground shipping with tracking. Most economical for medium-weight packages.',
    },
    {
      id: 'fedex-ground',
      carrier: 'FedEx',
      service: 'FedEx Ground',
      estimatedDays: '5-7 business days',
      price: isFreeShipping ? 0 : Math.round(baseRate * 1.05 * zoneMultiplier),
      requiresSignature: false,
      description: 'FedEx Ground delivery with full tracking and insurance up to $100.',
    },
    {
      id: 'fedex-express-saver',
      carrier: 'FedEx',
      service: 'FedEx Express Saver',
      estimatedDays: '2-3 business days',
      price: isFreeShipping ? 0 : Math.round(baseRate * 1.6 * zoneMultiplier),
      requiresSignature: false,
      description: 'Expedited delivery. Ideal for time-sensitive orders.',
    },
    {
      id: 'fedex-2day',
      carrier: 'FedEx',
      service: 'FedEx 2Day',
      estimatedDays: '2 business days',
      price: isFreeShipping ? 0 : Math.round(baseRate * 2.2 * zoneMultiplier),
      requiresSignature: true,
      description: 'Guaranteed 2-business-day delivery with signature required.',
    },
    {
      id: 'fedex-overnight',
      carrier: 'FedEx',
      service: 'FedEx Priority Overnight',
      estimatedDays: 'Next business day',
      price: isFreeShipping ? 0 : Math.round(baseRate * 3.5 * zoneMultiplier),
      requiresSignature: true,
      description: 'Premium next-business-day delivery by 10:30 AM. Signature required.',
    },
  ];

  // Filter out USPS for items over 70 lbs
  return rates.filter((r) => !(r.carrier === 'USPS' && totalWeight > 70));
}

/**
 * Main shipping rate calculator.
 *
 * @param totalWeight - Total weight of all items in lbs
 * @param hasFreight - Whether any item requires freight shipping
 * @param destinationZip - Optional ZIP code for zone-based pricing
 * @param subtotal - Order subtotal for free shipping threshold
 * @returns Array of shipping options available
 */
export function calculateShippingRates(
  totalWeight: number,
  hasFreight: boolean,
  destinationZip?: string,
  subtotal: number = 0
): ShippingOption[] {
  // Orders over $50,000 get free shipping
  const isFreeShipping = subtotal >= 50000;

  if (isFreeShipping) {
    // Even for free shipping, show appropriate options with $0 price
    if (hasFreight || totalWeight >= 150) {
      return getFreightRates(totalWeight, subtotal);
    }
    return getStandardRates(totalWeight, subtotal, getZoneMultiplier(destinationZip));
  }

  // Freight items or heavy total weight
  if (hasFreight || totalWeight >= 150) {
    return getFreightRates(totalWeight, subtotal);
  }

  // Standard shipping
  const zoneMultiplier = getZoneMultiplier(destinationZip);
  return getStandardRates(totalWeight, subtotal, zoneMultiplier);
}

/**
 * Get a single shipping option by ID.
 */
export function getShippingOptionById(
  options: ShippingOption[],
  id: string
): ShippingOption | undefined {
  return options.find((opt) => opt.id === id);
}

/**
 * Format shipping price for display.
 */
export function formatShippingPrice(price: number): string {
  if (price === 0) return 'FREE';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}
