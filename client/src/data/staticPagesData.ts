/**
 * Static mock data for ModeStreet content pages.
 * Based in Chennai, India. Currency in INR (₹).
 */

// -------------------------------------------------------------
// 1. TERMS OF SERVICE
// -------------------------------------------------------------
export interface TermsSection {
  id: string;
  number: number;
  title: string;
  content: string[];
  link?: {
    text: string;
    to: string;
  };
}

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: 'acceptance',
    number: 1,
    title: 'Acceptance of Terms',
    content: [
      'By accessing, browsing, or purchasing from ModeStreet ("we", "our", or "us") via modestreet.com or associated mobile storefronts, you agree to be bound by these Terms of Service, our Privacy Policy, and any additional guidelines posted on our platform.',
      'If you do not agree with any portion of these terms, please discontinue your use of our storefront immediately.',
    ],
  },
  {
    id: 'eligibility',
    number: 2,
    title: 'Eligibility',
    content: [
      'To make purchases through ModeStreet, you must be at least 18 years of age or possess legal parental or guardian consent. By completing a transaction, you represent that you possess the legal capacity to enter into binding agreements under Indian law.',
    ],
  },
  {
    id: 'accounts',
    number: 3,
    title: 'Customer Accounts & Information',
    content: [
      'You are responsible for ensuring that all details submitted during guest checkout or account creation are accurate, current, and complete.',
      'You agree to notify us immediately of any unauthorised use of your contact information or security breach. ModeStreet is not liable for losses arising from inaccurate delivery details supplied by the customer.',
    ],
  },
  {
    id: 'orders-pricing',
    number: 4,
    title: 'Orders & Pricing',
    content: [
      'All product prices displayed on the storefront are listed in Indian Rupees (INR, ₹) and are inclusive of applicable goods and services taxes (GST) unless explicitly noted otherwise.',
      'We reserve the right to decline or cancel any order in the event of unforeseen inventory shortages, pricing misprints, or suspected fraudulent activity. In such events, any funds debited will be refunded in full.',
    ],
  },
  {
    id: 'payments',
    number: 5,
    title: 'Payments & Billing',
    content: [
      'We accept major Indian debit/credit cards, UPI, net banking, and verified digital wallets through encrypted, PCI-DSS compliant payment gateways.',
      'ModeStreet does not store your raw card numbers or CVV. Full payment authorization is required before order dispatch commences.',
    ],
  },
  {
    id: 'shipping',
    number: 6,
    title: 'Shipping & Delivery',
    content: [
      'We ship across all serviceable pin codes in India using carbon-conscious courier partners. Estimated delivery times, rates, and dispatch timelines are detailed in our dedicated Shipping Policy.',
    ],
    link: {
      text: 'View full Shipping & Delivery guidelines →',
      to: '/shipping',
    },
  },
  {
    id: 'returns',
    number: 7,
    title: 'Returns & Exchanges',
    content: [
      'Unworn, unwashed garments with tags intact may be returned or exchanged within 14 days of receipt. Custom pieces, altered garments, and intimate apparel are final sale.',
    ],
    link: {
      text: 'Review our complete Returns & Exchanges policy →',
      to: '/returns',
    },
  },
  {
    id: 'intellectual-property',
    number: 8,
    title: 'Intellectual Property',
    content: [
      'All content published on ModeStreet — including logos, photography, typography, garment designs, copy, and website code — is the exclusive property of ModeStreet and protected under Indian and international copyright and trademark laws.',
      'Reproduction, copying, or commercial distribution of any asset without prior written authorization is strictly prohibited.',
    ],
  },
  {
    id: 'user-conduct',
    number: 9,
    title: 'User Conduct',
    content: [
      'You agree not to use our storefront for unlawful purposes, introduce malicious software, scrape data, or interfere with server operations.',
      'Any attempt to manipulate pricing, inventory reservations, or order status will result in immediate termination of service and potential legal action.',
    ],
  },
  {
    id: 'liability',
    number: 10,
    title: 'Limitation of Liability',
    content: [
      'To the fullest extent permitted by Indian law, ModeStreet and its affiliates shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use our products or services.',
      'Our total cumulative liability for any claim shall not exceed the amount actually paid by you for the specific product giving rise to the claim.',
    ],
  },
  {
    id: 'changes',
    number: 11,
    title: 'Changes to Terms',
    content: [
      'We reserve the right to amend these Terms of Service at any time. Any changes take effect immediately upon being posted to this page, with the revised "Last updated" date visible at the top.',
      'Continued use of our storefront after modifications constitutes your binding acceptance of the updated terms.',
    ],
  },
  {
    id: 'governing-law',
    number: 12,
    title: 'Governing Law & Jurisdiction',
    content: [
      'These Terms of Service are governed by and construed in accordance with the laws of the Republic of India.',
      'Any disputes, claims, or controversies arising out of or relating to these terms or transactions on ModeStreet shall be subject to the exclusive jurisdiction of the civil courts situated in Chennai, Tamil Nadu, India.',
    ],
  },
  {
    id: 'contact-inquiries',
    number: 13,
    title: 'Contact & Inquiries',
    content: [
      'For legal notices or questions regarding these terms, please contact our administrative team:',
      'ModeStreet Atelier\n24, Nungambakkam High Road, Nungambakkam\nChennai, Tamil Nadu 600034, India\nEmail: hello@modestreet.com\nPhone: +91 98765 43210 (Mon – Sat, 10:00 AM – 8:00 PM IST)',
    ],
    link: {
      text: 'Visit our Contact Page →',
      to: '/contact',
    },
  },
];

// -------------------------------------------------------------
// 2. SHIPPING & DELIVERY
// -------------------------------------------------------------
export interface ShippingOption {
  name: string;
  duration: string;
  cost: string;
  threshold?: string;
  notes: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    name: 'Standard Delivery',
    duration: '4–6 business days',
    cost: '₹99',
    threshold: 'Free above ₹1,999',
    notes: 'Available nationwide across all serviceable Indian pincodes via Blue Dart, Delhivery, and DTDC.',
  },
  {
    name: 'Express Delivery',
    duration: '2–3 business days',
    cost: '₹199',
    notes: 'Priority air dispatch to major Indian metros (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Kolkata).',
  },
  {
    name: 'Same-Day Chennai',
    duration: 'Same day (evening)',
    cost: '₹149',
    notes: 'Orders placed before 12:00 PM IST Monday to Saturday within Chennai city limits.',
  },
];

// -------------------------------------------------------------
// 3. RETURNS & EXCHANGES
// -------------------------------------------------------------
export interface ReturnStep {
  step: string;
  title: string;
  description: string;
}

export const RETURN_STEPS: ReturnStep[] = [
  {
    step: '01',
    title: 'Request',
    description: 'Initiate a return or size exchange within 14 days of delivery via our Contact page or by emailing hello@modestreet.com.',
  },
  {
    step: '02',
    title: 'Pack',
    description: 'Place the unworn garment with all original tags attached inside the cotton dust pouch and kraft shipping box.',
  },
  {
    step: '03',
    title: 'Refund',
    description: 'Our Chennai atelier inspects the piece upon receipt. Your refund is credited within 5–7 business days to your original payment method.',
  },
];

export const CONDITION_CHECKLIST: string[] = [
  'Item is unworn, unwashed, and entirely free of alterations.',
  'Original brand tags and internal fabric care labels are intact and untampered.',
  'Packed securely in the original cotton drawstring pouch and protective packaging.',
  'Garment is free of makeup marks, deodorant residue, perfumes, or tobacco odor.',
];

// -------------------------------------------------------------
// 4. SIZE GUIDE
// -------------------------------------------------------------
export interface SizeRow {
  size: string;
  chest?: string;
  waist?: string;
  hip?: string;
  length?: string;
  sleeve?: string;
  shoulder?: string;
  inseam?: string;
  thigh?: string;
}

export interface SizeCategory {
  id: 'shirts' | 'tshirts' | 'bottoms';
  label: string;
  fitNote: string;
  columns: { key: keyof SizeRow; label: string }[];
  dataCm: SizeRow[];
  dataInches: SizeRow[];
}

export const SIZE_CATEGORIES: SizeCategory[] = [
  {
    id: 'shirts',
    label: 'Shirts',
    fitNote: 'Tailored relaxed cut. If you prefer a loose, oversized drape or layer over tees, consider sizing up one size.',
    columns: [
      { key: 'size', label: 'Size' },
      { key: 'chest', label: 'Chest' },
      { key: 'shoulder', label: 'Shoulder' },
      { key: 'length', label: 'Length' },
      { key: 'sleeve', label: 'Sleeve' },
    ],
    dataCm: [
      { size: 'XS', chest: '92', shoulder: '42', length: '71', sleeve: '61' },
      { size: 'S', chest: '97', shoulder: '44', length: '73', sleeve: '62' },
      { size: 'M', chest: '102', shoulder: '46', length: '75', sleeve: '63' },
      { size: 'L', chest: '107', shoulder: '48', length: '77', sleeve: '64' },
      { size: 'XL', chest: '112', shoulder: '50', length: '79', sleeve: '65' },
      { size: 'XXL', chest: '117', shoulder: '52', length: '81', sleeve: '66' },
    ],
    dataInches: [
      { size: 'XS', chest: '36.2', shoulder: '16.5', length: '28.0', sleeve: '24.0' },
      { size: 'S', chest: '38.2', shoulder: '17.3', length: '28.7', sleeve: '24.4' },
      { size: 'M', chest: '40.2', shoulder: '18.1', length: '29.5', sleeve: '24.8' },
      { size: 'L', chest: '42.1', shoulder: '18.9', length: '30.3', sleeve: '25.2' },
      { size: 'XL', chest: '44.1', shoulder: '19.7', length: '31.1', sleeve: '25.6' },
      { size: 'XXL', chest: '46.1', shoulder: '20.5', length: '31.9', sleeve: '26.0' },
    ],
  },
  {
    id: 'tshirts',
    label: 'T-Shirts',
    fitNote: 'Heavyweight organic cotton cut with a subtle drop shoulder. Pre-shrunk to maintain proportions after gentle cold washing.',
    columns: [
      { key: 'size', label: 'Size' },
      { key: 'chest', label: 'Chest' },
      { key: 'shoulder', label: 'Shoulder' },
      { key: 'length', label: 'Length' },
      { key: 'sleeve', label: 'Sleeve' },
    ],
    dataCm: [
      { size: 'XS', chest: '96', shoulder: '45', length: '68', sleeve: '21' },
      { size: 'S', chest: '101', shoulder: '47', length: '70', sleeve: '22' },
      { size: 'M', chest: '106', shoulder: '49', length: '72', sleeve: '23' },
      { size: 'L', chest: '111', shoulder: '51', length: '74', sleeve: '24' },
      { size: 'XL', chest: '116', shoulder: '53', length: '76', sleeve: '25' },
      { size: 'XXL', chest: '121', shoulder: '55', length: '78', sleeve: '26' },
    ],
    dataInches: [
      { size: 'XS', chest: '37.8', shoulder: '17.7', length: '26.8', sleeve: '8.3' },
      { size: 'S', chest: '39.8', shoulder: '18.5', length: '27.6', sleeve: '8.7' },
      { size: 'M', chest: '41.7', shoulder: '19.3', length: '28.3', sleeve: '9.1' },
      { size: 'L', chest: '43.7', shoulder: '20.1', length: '29.1', sleeve: '9.4' },
      { size: 'XL', chest: '45.7', shoulder: '20.9', length: '29.9', sleeve: '9.8' },
      { size: 'XXL', chest: '47.6', shoulder: '21.7', length: '30.7', sleeve: '10.2' },
    ],
  },
  {
    id: 'bottoms',
    label: 'Bottoms',
    fitNote: 'Mid-rise with a neat gentle taper through the ankle. We recommend ordering according to your natural waist circumference.',
    columns: [
      { key: 'size', label: 'Size' },
      { key: 'waist', label: 'Waist' },
      { key: 'hip', label: 'Hip' },
      { key: 'inseam', label: 'Inseam' },
      { key: 'thigh', label: 'Thigh' },
    ],
    dataCm: [
      { size: 'XS (28)', waist: '72', hip: '94', inseam: '76', thigh: '56' },
      { size: 'S (30)', waist: '77', hip: '99', inseam: '77', thigh: '58' },
      { size: 'M (32)', waist: '82', hip: '104', inseam: '78', thigh: '60' },
      { size: 'L (34)', waist: '87', hip: '109', inseam: '79', thigh: '62' },
      { size: 'XL (36)', waist: '92', hip: '114', inseam: '80', thigh: '64' },
      { size: 'XXL (38)', waist: '97', hip: '119', inseam: '81', thigh: '66' },
    ],
    dataInches: [
      { size: 'XS (28)', waist: '28.3', hip: '37.0', inseam: '29.9', thigh: '22.0' },
      { size: 'S (30)', waist: '30.3', hip: '39.0', inseam: '30.3', thigh: '22.8' },
      { size: 'M (32)', waist: '32.3', hip: '40.9', inseam: '30.7', thigh: '23.6' },
      { size: 'L (34)', waist: '34.3', hip: '42.9', inseam: '31.1', thigh: '24.4' },
      { size: 'XL (36)', waist: '36.2', hip: '44.9', inseam: '31.5', thigh: '25.2' },
      { size: 'XXL (38)', waist: '38.2', hip: '46.9', inseam: '31.9', thigh: '26.0' },
    ],
  },
];

export const MEASURING_TIPS = [
  {
    title: 'Chest',
    instruction: 'Measure around the fullest part of your chest, keeping the tape comfortably horizontal under your armpits and across your shoulder blades.',
  },
  {
    title: 'Waist',
    instruction: 'Measure around your natural waistline, where you typically wear your trousers or jeans. Keep one finger between tape and body for breathing room.',
  },
  {
    title: 'Hips',
    instruction: 'Stand with your feet together and measure around the fullest point of your hips and seat.',
  },
  {
    title: 'Inseam',
    instruction: 'Measure vertically along the inside seam of your leg, from the crotch point down to the ankle bone.',
  },
];

// -------------------------------------------------------------
// 5. FAQS
// -------------------------------------------------------------
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  category: string;
  items: FaqItem[];
}

export const FAQ_DATA: FaqGroup[] = [
  {
    category: 'Orders & Modifications',
    items: [
      {
        id: 'order-modify',
        question: 'Can I modify or cancel my order after placing it?',
        answer: 'Because our Chennai fulfillment atelier begins processing orders rapidly, we can only modify addresses or sizes within 2 hours of placement. Please email hello@modestreet.com or call +91 98765 43210 immediately with your order number.',
      },
      {
        id: 'order-confirmation',
        question: 'How do I know my order has been confirmed?',
        answer: 'You will receive an automated confirmation email and SMS containing your order number (#MS-...) and item summary as soon as checkout is completed.',
      },
      {
        id: 'order-guest',
        question: 'Do I need an account to place an order?',
        answer: 'No. You may checkout seamlessly as a guest with your phone number, email, and shipping address. An account is only required for administrative management.',
      },
      {
        id: 'order-bulk',
        question: 'Do you accept corporate or bridal party orders?',
        answer: 'Yes, we take bespoke bulk inquiries for weddings and corporate gifting. Please reach out through our Contact page with your quantity, timeline, and fabric preferences.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        id: 'shipping-time',
        question: 'How long does delivery take across India?',
        answer: 'Standard shipping takes 4–6 business days. Express shipping delivers within 2–3 business days to metro cities. In Chennai, same-day delivery is available for orders confirmed before 12:00 PM IST.',
      },
      {
        id: 'shipping-tracking',
        question: 'How do I track the movement of my parcel?',
        answer: 'As soon as your parcel leaves our studio, we generate an airway bill and dispatch an SMS with the live tracking link via Blue Dart or Delhivery.',
      },
      {
        id: 'shipping-charges',
        question: 'Are there any hidden shipping fees or duties?',
        answer: 'No hidden charges. Standard delivery is ₹99 across India, and completely free on orders above ₹1,999. Express delivery is ₹199.',
      },
      {
        id: 'shipping-international',
        question: 'Do you ship internationally outside India?',
        answer: 'We currently service all pincodes across India. International express shipping to the UAE, UK, US, and Singapore is launching later this year.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        id: 'return-window',
        question: 'What is your return and exchange window?',
        answer: 'We provide a 14-day hassle-free window from the day of delivery for returns and size exchanges on all unworn items with tags intact.',
      },
      {
        id: 'return-pickup',
        question: 'Do you arrange doorstep return pickups?',
        answer: 'Yes. Once your return or exchange request is authorized, we schedule a doorstep courier pickup from your delivery address at no extra cost.',
      },
      {
        id: 'return-refund-timeline',
        question: 'How long does it take to receive my refund?',
        answer: 'Once our atelier inspects the piece (within 48 hours of receipt), the refund is processed back to your original payment mode or UPI within 5–7 business days.',
      },
      {
        id: 'return-nonreturnable',
        question: 'Which items cannot be returned or exchanged?',
        answer: 'Items marked as Final Archive Sale, innerwear, and customized or hemmed pieces cannot be returned for hygiene and craftsmanship reasons.',
      },
    ],
  },
  {
    category: 'Payments & Pricing',
    items: [
      {
        id: 'payment-methods',
        question: 'What payment methods do you accept?',
        answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Visa, MasterCard, RuPay, American Express, Net Banking, and select digital wallets via encrypted checkout.',
      },
      {
        id: 'payment-cod',
        question: 'Is Cash on Delivery (COD) available?',
        answer: 'To uphold carbon-neutral operations and reduce transit re-routing, we operate on prepaid checkout only. We offer instant refunds in the rare event an item is out of stock.',
      },
      {
        id: 'payment-taxes',
        question: 'Are taxes included in the displayed product prices?',
        answer: 'Yes, all prices displayed on ModeStreet include 12% GST. An official tax invoice is sent with your shipping confirmation email.',
      },
      {
        id: 'payment-security',
        question: 'Is it safe to enter my card details on ModeStreet?',
        answer: 'Absolutely. All transactions are processed through 256-bit SSL encrypted PCI-DSS Level 1 compliant payment gateways. We never view or store your card credentials.',
      },
    ],
  },
  {
    category: 'Products & Garment Care',
    items: [
      {
        id: 'care-fabrics',
        question: 'Where are your fabrics sourced and tailored?',
        answer: 'Our textiles are sustainably woven in Tamil Nadu and Gujarat using organic cotton, raw linen, and durable twills. Every garment is tailored in small batches at our Chennai studio.',
      },
      {
        id: 'care-washing',
        question: 'How should I wash and care for my ModeStreet pieces?',
        answer: 'We recommend gentle machine wash in cold water with mild liquid detergent. Line dry in the shade to preserve garment fibers and avoid direct scorching heat.',
      },
      {
        id: 'care-shrinkage',
        question: 'Will 100% cotton garments shrink after washing?',
        answer: 'All our cotton and linen fabrics are pre-washed and pre-shrunk before cutting. When laundered in cold water, shrinkage is negligible (under 1–2%).',
      },
      {
        id: 'care-sizing-help',
        question: 'I am between sizes. How should I choose?',
        answer: 'Please consult our detailed Size Guide. If you are unsure between two sizes, feel free to email hello@modestreet.com with your measurements and our studio team will advise.',
      },
    ],
  },
];
