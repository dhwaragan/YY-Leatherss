var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_supabase_js = require("@supabase/supabase-js");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_stripe = __toESM(require("stripe"), 1);
var import_razorpay = __toESM(require("razorpay"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_meta = {};
import_dotenv.default.config();
var _filename = typeof __filename !== "undefined" ? __filename : import_meta.url ? (0, import_url.fileURLToPath)(import_meta.url) : "";
var _dirname = typeof __dirname !== "undefined" ? __dirname : _filename ? import_path.default.dirname(_filename) : process.cwd();
var aiClient = null;
function getAi() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var SUPABASE_URL = process.env.SUPABASE_URL || "https://vnspipodxzxuwsailgok.supabase.co";
var SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3BpcG9keHp4dXdzYWlsZ29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIyNTgsImV4cCI6MjA5NjMyODI1OH0.wI8_OVKRzSGDTMyNQd5I_U1wZmQwVkDWYR2g-eiU78s";
var supabase = (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
var stripeSecretKey = process.env.STRIPE_SECRET_KEY;
var stripe = null;
if (stripeSecretKey) {
  stripe = new import_stripe.default(stripeSecretKey, {
    apiVersion: "2024-06-20"
  });
}
var razorpayKeyId = process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TCC3Up2fPxpuKN";
var razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "4rqwmTVVaG2MV16fvGlspAt8";
var razorpay = new import_razorpay.default({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret
});
var app = (0, import_express.default)();
var PORT = Number(process.env.PORT || 3e3);
var getDeliveryCharge = (region, weightKg) => {
  switch (region) {
    case "TN":
      return 80 * weightKg;
    case "South":
      return 100 * weightKg;
    case "North":
      return 150 * weightKg;
    case "North East":
      return 250 * weightKg;
    case "North West":
      return 200 * weightKg;
    case "Himachal":
      return 200 * weightKg;
    default:
      return 0;
  }
};
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, import_cors.default)());
app.post("/api/stripe/create-payment-intent", async (req, res) => {
  const {
    amount,
    currency = "inr",
    email,
    customer_name,
    address,
    phone,
    items,
    delivery_region,
    delivery_charge,
    estimated_weight_kg,
    student_discount_requested,
    student_discount_details,
    birthday_benefit_requested,
    birthday_benefit_details,
    buyback_requested,
    buyback_details,
    applied_offer
  } = req.body;
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ error: "A valid payment amount is required." });
  }
  if (!email || !customer_name) {
    return res.status(400).json({ error: "Customer name and email are required." });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Shopping cart cannot be empty." });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      metadata: {
        customer_name,
        address: address || "",
        phone: phone || "",
        delivery_region: delivery_region || "TN",
        delivery_charge: String(delivery_charge || 0),
        estimated_weight_kg: String(estimated_weight_kg || 0),
        items: JSON.stringify(items)
      }
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error("Payment intent creation failed:", error);
    res.status(500).json({ error: error.message || "Unable to initialize payment." });
  }
});
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const { address, phone, email, customer_name, items, total, delivery_region, delivery_charge, estimated_weight_kg, buyback_requested, buyback_details, birthday_benefit_requested, birthday_benefit_details, student_discount_requested, student_discount_details, applied_offer } = req.body;
  try {
    const resolvedWeightKg = Number(estimated_weight_kg) || 1;
    const resolvedDeliveryCharge = getDeliveryCharge(delivery_region, resolvedWeightKg);
    const pendingOrder = {
      id: `YY-ORD-${Math.floor(1e4 + Math.random() * 9e4)}`,
      user_id: req.body.user_id || "guest",
      customer_name: customer_name || "Guest",
      customer_email: email || "guest@example.com",
      items,
      total: Number(total) || 0,
      status: "Pending",
      address,
      phone,
      buyback_requested: Boolean(buyback_requested),
      buyback_details: buyback_requested ? { ...buyback_details, status: "Pending" } : null,
      birthday_benefit_requested: Boolean(birthday_benefit_requested),
      birthday_benefit_details: birthday_benefit_requested ? { ...birthday_benefit_details, status: "Pending" } : null,
      student_discount_requested: Boolean(student_discount_requested),
      student_discount_details: student_discount_requested ? { ...student_discount_details, status: "Pending" } : null,
      applied_offer: applied_offer || "none",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.orders.unshift(pendingOrder);
    saveDatabase(db);
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          images: item.product.images,
          metadata: {
            product_id: item.product.id,
            size: item.selectedSize
          }
        },
        unit_amount: Math.round(Number(item.product?.price ?? item.price ?? 0) * 100)
      },
      quantity: item.quantity
    }));
    if (resolvedDeliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charge",
            metadata: {
              region: delivery_region,
              weight_kg: estimated_weight_kg
            }
          },
          unit_amount: resolvedDeliveryCharge * 100
          // Amount in paise
        },
        quantity: 1
      });
    }
    const processingFee = Math.round(total * 0.025);
    if (processingFee > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Processing Fee",
            metadata: {
              type: "payment_gateway"
            }
          },
          unit_amount: processingFee * 100
        },
        quantity: 1
      });
    }
    const origin = req.headers.origin || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/?orderSuccess=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?orderCancelled=true`,
      customer_email: email,
      metadata: {
        order_id: pendingOrder.id,
        user_id: req.body.user_id || "guest",
        customer_name,
        address,
        phone,
        delivery_region,
        delivery_charge: resolvedDeliveryCharge,
        estimated_weight_kg: resolvedWeightKg,
        items: JSON.stringify(items),
        buyback_requested: String(Boolean(buyback_requested)),
        buyback_details: JSON.stringify(buyback_requested ? { ...buyback_details, status: "Pending" } : null),
        birthday_benefit_requested: String(Boolean(birthday_benefit_requested)),
        birthday_benefit_details: JSON.stringify(birthday_benefit_requested ? { ...birthday_benefit_details, status: "Pending" } : null)
      }
    });
    res.json({ url: session.url, orderId: pendingOrder.id });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/stripe/webhook", import_express.default.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).send("Webhook secret not configured");
  }
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Checkout session completed:", session);
      const { metadata } = session;
      const orderId = metadata?.order_id || `YY-ORD-${Math.floor(1e4 + Math.random() * 9e4)}`;
      const existingOrder = db.orders.find((order) => order.id === orderId);
      const newOrder = {
        id: orderId,
        user_id: metadata?.user_id || "guest",
        customer_name: metadata?.customer_name || "N/A",
        customer_email: session.customer_details?.email || "N/A",
        items: JSON.parse(metadata?.items || "[]"),
        total: session.amount_total ? session.amount_total / 100 : 0,
        status: "Paid",
        address: metadata?.address || "N/A",
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        delivery_region: metadata?.delivery_region,
        delivery_charge: parseFloat(metadata?.delivery_charge || "0"),
        estimated_weight_kg: parseFloat(metadata?.estimated_weight_kg || "0"),
        buyback_requested: metadata?.buyback_requested === "true",
        buyback_details: metadata?.buyback_details ? JSON.parse(metadata.buyback_details) : null,
        birthday_benefit_requested: metadata?.birthday_benefit_requested === "true",
        birthday_benefit_details: metadata?.birthday_benefit_details ? JSON.parse(metadata.birthday_benefit_details) : null,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (existingOrder) {
        Object.assign(existingOrder, newOrder, { created_at: existingOrder.created_at || newOrder.created_at });
      } else {
        db.orders.unshift(newOrder);
      }
      saveDatabase(db);
      console.log("Order saved to DB:", newOrder);
      break;
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log("PaymentIntent was successful!", paymentIntentSucceeded);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.status(200).json({ received: true });
});
var IS_SERVERLESS = !!(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.AWS_EXECUTION_ENV);
var DB_FILE = IS_SERVERLESS ? "/tmp/db.json" : import_path.default.join(_dirname, "db.json");
var initialDB = {
  profiles: [
    {
      id: "admin-id",
      email: "sriramsriram0105@gmail.com",
      name: "Sriram Srinivasan (Admin)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      phone: "+91 98765 43210",
      role: "admin",
      address: "YY Leathers, Khader Nawaz Khan Road, Nungambakkam, Chennai, Tamil Nadu - 600006",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "customer-id",
      email: "customer@example.com",
      name: "Rajesh Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      phone: "+91 98400 12345",
      role: "customer",
      address: "12, TTK Road, Alwarpet, Chennai, Tamil Nadu - 600018",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  products: [
    {
      id: "prod-1021",
      name: "Leather Chelsea Boot for Men's - 1021",
      description: "VOGUISH Masterpiece. Hand-crafted premium high-ankle Chelsea boot featuring premium full-grain leather upper, sweat-wicking leather lining, durable double elasticated side gussets, front and back leather pull tabs, and a supportive cushioned heel step with dynamic anti-slip sole. Chennai's ultimate style icon.",
      price: 4999,
      category: "Boots",
      images: [
        "https://images.unsplash.com/photo-1634825212488-8b9f713e7104?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop"
      ],
      is_new_arrival: true,
      is_best_seller: true,
      is_published: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "prod-1",
      name: "The Imperial Wingtip Derby",
      description: "Masterpiece derby crafted from full-grain French calfskin with hand-bushed mahogany patina. Hand-stitched wingtip brogue detailing, Blake welted construction with single-layer oak bark tanned leather sole. Chennai's peak bespoke shoe.",
      price: 18500,
      category: "Derby",
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=600&auto=format&fit=crop"
      ],
      is_new_arrival: false,
      is_best_seller: true,
      is_published: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "prod-2",
      name: "The Royal Chelsea Boot",
      description: "Sleek, continuous single-piece leather cut Chelsea boot in rich Italian tan leather. Generous elasticated gussets, leather pull tabs, and robust storm-welted leather soles. Epitomizes royal elegance combined with modern durable craft.",
      price: 24e3,
      category: "Boots",
      images: [
        "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1634825212488-8b9f713e7104?q=80&w=600&auto=format&fit=crop"
      ],
      is_new_arrival: true,
      is_best_seller: true,
      is_published: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "prod-3",
      name: "The Chennai Legacy Monkstraps",
      description: "Distinctive double-buckle monkstrap shoes using gold-burnished solid brass buckles. Tailored using premium locally tanned deep dark leather, presenting an exceptional dark sheen under sunlight. Fully customizable shoe depth and instep fit.",
      price: 19500,
      category: "Monkstrap",
      images: [
        "https://images.unsplash.com/photo-1614252304915-d36c53fc36d9?q=80&w=600&auto=format&fit=crop"
      ],
      is_new_arrival: false,
      is_best_seller: true,
      is_published: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "prod-4",
      name: "The Heirloom Oxford",
      description: "Unmatched formal elegance. Strict cap-toe oxford constructed on a custom high-arch royal last. Handmade detailing across blind eyelets and double-waxed braided corded laces. Rich tan finish matches custom designer drapes.",
      price: 16800,
      category: "Oxford",
      images: [
        "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=600&auto=format&fit=crop"
      ],
      is_new_arrival: true,
      is_best_seller: false,
      is_published: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "prod-5",
      name: "The Estate Velvet Loafer",
      description: "Slip-on penny loafer incorporating supple full-grain chocolate brown suede. Unlined structure gives lightweight flexibility and supreme barefoot luxury feel. Hand-sewn apron stitching with customized heel counters.",
      price: 15500,
      category: "PENNY LOAFERS",
      images: [
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop"
      ],
      is_new_arrival: true,
      is_best_seller: false,
      is_published: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "prod-6",
      name: "Classic Leather Belt",
      description: "Premium full grain leather belt with solid brass buckle.",
      price: 2500,
      category: "BELT",
      images: [
        "https://images.unsplash.com/photo-1627092104085-f2adba578508?q=80&w=600&auto=format&fit=crop"
      ],
      is_new_arrival: true,
      is_best_seller: true,
      is_published: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "prod-7",
      name: "Minimalist Suede Mules",
      description: "Handcrafted suede mules for effortless style.",
      price: 9500,
      category: "MULES",
      images: [
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=600&auto=format&fit=crop"
      ],
      is_new_arrival: true,
      is_best_seller: false,
      is_published: true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  orders: [
    {
      id: "YY-ORD-94812",
      user_id: "customer-id",
      customer_name: "Rajesh Kumar",
      customer_email: "customer@example.com",
      items: [
        {
          product: {
            id: "prod-1",
            name: "The Imperial Wingtip Derby",
            price: 18500,
            images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop"]
          },
          quantity: 1,
          selectedSize: "9"
        }
      ],
      total: 18500,
      status: "Delivered",
      address: "12, TTK Road, Alwarpet, Chennai, Tamil Nadu - 600018",
      razorpay_order_id: "order_mock_112233",
      razorpay_payment_id: "pay_mock_223344",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3).toISOString()
    }
  ],
  preorders: [
    {
      id: "YY-PRE-8105",
      user_id: "customer-id",
      name: "Rajesh Kumar",
      email: "customer@example.com",
      phone: "+91 98400 12345",
      style_desc: "Custom Crocodile-Embossed Wingtip Boots. Royal dark green color wanted with golden buckles.",
      image_urls: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop"],
      size: "10",
      color: "Royal Forest Green & Mahogany",
      sole: "Double Red Dainite Rubber Sole",
      budget_range: "\u20B925,000 - \u20B935,000",
      notes: "Please add extra memory foam premium inner cushions. Ensure fitting matches wide-toes sizing.",
      status: "Confirmed",
      admin_note: "Sourcing premium full-grain Italian calf crust. Confirmed to build onto custom extra-wide last. Hand dye process assigned.",
      estimated_delivery: "2026-07-15",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
    }
  ],
  offers: [
    {
      id: "off-1",
      title: "Royal Mid-Summer Sovereign Offer",
      description: "Acquire our royal leather masterpiece footwear series with premium customization options. Earn complimentary aromatic cedar shoe trees with every order.",
      discount_percent: 15,
      banner_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
      valid_until: new Date(Date.now() + 10 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      is_active: true
    },
    {
      id: "off-2",
      title: "Heritage Collection Early Access",
      description: "First look at our new handmade collection. Sign up now and enjoy an exclusive discount on your next full-price purchase.",
      discount_percent: 25,
      banner_url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop",
      valid_until: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      is_active: true
    }
  ],
  content_blocks: [
    {
      id: "cb-about",
      key: "about",
      value: JSON.stringify({
        title: "The Legacy of YY Leathers",
        tagline: "Where Leather Meets Legacy \u2014 Bespoke Shoemakers",
        paragraphs: [
          "Nestled in the historical center of premium leather processing in Chennai, India, YY Leathers began as a humble atelier with a singular vision: to preserve the delicate art of hand-crafted footwear. Every pair that enters our workshop goes through 150 meticulous steps, from selecting pristine full-grain calf skins to the precise, patient double stitches of leather welt.",
          "We synthesize time-honored European Cordwaining techniques with native Indian shoe construction wisdom, fashioning masterwork shoes that last generations. Under the stewardship of master craftsmen, YY Leathers forms an iconic emblem of style, confidence, and uncompromising Indian heritage."
        ],
        founder: "Yogesh & Yashwanth (Master Shoemakers)",
        mission: "To offer Chennai the world's finest premium hand-crafted leather shoes, built strictly customized, and backed by our lifetime-grade circular Buy Back guarantee."
      })
    },
    {
      id: "cb-history",
      key: "history",
      value: JSON.stringify([
        { year: "Founding", title: "Atelier Foundation", desc: "First custom workshop opened in Chennai, offering bespoke fitting for royal dignitaries." },
        { year: "2002", title: "Masters' Union Creation", desc: "Built our Master Guild uniting third-generation shoemakers to define bespoke Indian design standards." },
        { year: "2010", title: "The Blake Handwelt Launch", desc: "Introduced our signature Blake-stitched single oak-bark sole model, bringing ultimate flexibility." },
        { year: "2018", title: "Circular Buy Back Scheme", desc: "Pioneered India's first organic shoe recycling pledge, buy-backs that refurbish worn items." },
        { year: "2026", title: "Digital Luxury Experience", desc: "Bringing bespoke royal ordering and premium pre-orders directly to national connoisseurs." }
      ])
    },
    {
      id: "cb-policies",
      key: "policies",
      value: JSON.stringify({
        returns: "If your customized ready-to-wear shoe doesn't fit beautifully, we provide a complimentary re-sizing and fit adjustment services within 14 days of delivery. For orders custom crafted to individual measures, returns are not eligible but full bespoke scaling and alteration support is provided by our Chennai shop.",
        privacy: "YY Leathers protects customer fit records and billing information under stringent data privacy. We do not distribute foot measurement blueprints or contact info to any marketing partner.",
        shipping: "Within Chennai, courier deliveries are scheduled with white-gloved specialists. For other tier-1 metros in India, standard shipping completes securely within 3-5 working days.",
        buyback: "Every authentic YY Leather pair qualifies for our circular restoration ecosystem. Depending on leather depth and structural preservation, we grant up to 20% of original price as store-credit coupon codes or instant cash support.",
        preorders: "Pre-order items represent bespoke crafting allocated individually. Handcraft cycles require 15-25 days from confirmation of physical sizing. Standard token non-refundable down-payment of 30% binds the reservation."
      })
    }
  ]
};
function loadDatabase() {
  if (!import_fs.default.existsSync(DB_FILE)) {
    saveDatabase(initialDB);
    return initialDB;
  }
  try {
    const data = import_fs.default.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse db.json, falling back to seed", error);
    return initialDB;
  }
}
async function syncToSupabase(key, value) {
  try {
    const { error } = await supabase.from("yy_store_sync").upsert({ key, value, updated_at: (/* @__PURE__ */ new Date()).toISOString() }, { onConflict: "key" });
    if (error) {
      if (error.code === "42P01") {
        console.warn(`[Supabase Sync] Table 'yy_store_sync' does not exist yet. Cloud sync will operate when table is created.`);
      } else {
        console.error(`[Supabase Sync] Error syncing key '${key}':`, error);
      }
    } else {
      console.log(`[Supabase Sync] Synced key '${key}' successfully to cloud Supabase.`);
    }
  } catch (err) {
    console.error(`[Supabase Sync] Network failed for '${key}':`, err);
  }
}
async function pullFromSupabase() {
  console.log("[Supabase Sync] Retrieving dynamic cloud records from Supabase PostgreSQL...");
  try {
    const { data, error } = await supabase.from("yy_store_sync").select("*");
    if (error) {
      if (error.code === "42P01") {
        console.warn("[Supabase Sync] 'yy_store_sync' table missing on Supabase. Using local db.json cache storage.");
        return false;
      }
      console.error("[Supabase Sync] Pull error:", error);
      return false;
    }
    if (data && data.length > 0) {
      console.log(`[Supabase Sync] Restoring state for ${data.length} keys from Supabase...`);
      const tempDb = { ...db };
      let anyMerged = false;
      for (const row of data) {
        if (row.key in tempDb) {
          tempDb[row.key] = row.value;
          anyMerged = true;
        }
      }
      if (anyMerged) {
        db = tempDb;
        import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
        return true;
      }
    } else {
      console.log("[Supabase Sync] Supabase table is empty. Pre-seeding Supabase with local data...");
      const keysToSync = ["profiles", "products", "orders", "preorders", "offers", "content_blocks"];
      for (const key of keysToSync) {
        await syncToSupabase(key, db[key]);
      }
    }
  } catch (err) {
    console.error("[Supabase Sync] Connection error during initial restore:", err);
  }
  return false;
}
function saveDatabase(newDb) {
  try {
    db = newDb;
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
    const keysToSync = ["profiles", "products", "orders", "preorders", "offers", "content_blocks"];
    for (const key of keysToSync) {
      syncToSupabase(key, db[key]);
    }
  } catch (error) {
    console.error("Failed to write to db.json", error);
  }
}
var db = loadDatabase();
var isSupabasePulled = false;
app.use(async (req, res, next) => {
  if (req.url.startsWith("/.netlify/functions/api")) {
    req.url = req.url.replace("/.netlify/functions/api", "/api");
  }
  if (IS_SERVERLESS && !isSupabasePulled && req.url.startsWith("/api")) {
    try {
      await pullFromSupabase();
      isSupabasePulled = true;
    } catch (e) {
      console.error("Serverless Supabase pull failed", e);
    }
  }
  next();
});
app.get("/api/auth/profile/:email", (req, res) => {
  const { email } = req.params;
  const user = db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  if (user) {
    return res.json(user);
  }
  const newProfile = {
    id: `cust-${Date.now()}`,
    email: email.toLowerCase(),
    name: email.split("@")[0].toUpperCase(),
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    phone: "",
    role: "customer",
    address: "",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.profiles.push(newProfile);
  saveDatabase(db);
  res.json(newProfile);
});
app.post("/api/auth/profile", (req, res) => {
  const updatedProfile = req.body;
  const index = db.profiles.findIndex((p) => p.email.toLowerCase() === updatedProfile.email.toLowerCase());
  if (index !== -1) {
    db.profiles[index] = { ...db.profiles[index], ...updatedProfile };
  } else {
    updatedProfile.id = updatedProfile.id || `cust-${Date.now()}`;
    updatedProfile.role = updatedProfile.role || "customer";
    updatedProfile.created_at = (/* @__PURE__ */ new Date()).toISOString();
    db.profiles.push(updatedProfile);
  }
  saveDatabase(db);
  res.json({ success: true, profile: db.profiles.find((p) => p.email.toLowerCase() === updatedProfile.email.toLowerCase()) });
});
app.get("/api/products", (req, res) => {
  res.json(db.products);
});
app.post("/api/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id = `prod-${Date.now()}`;
  newProduct.created_at = (/* @__PURE__ */ new Date()).toISOString();
  newProduct.images = newProduct.images?.length ? newProduct.images : ["https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop"];
  newProduct.price = Number(newProduct.price) || 12e3;
  newProduct.is_new_arrival = !!newProduct.is_new_arrival;
  newProduct.is_best_seller = !!newProduct.is_best_seller;
  newProduct.is_published = newProduct.is_published !== false;
  db.products.unshift(newProduct);
  saveDatabase(db);
  res.json({ success: true, product: newProduct });
});
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const index = db.products.findIndex((p) => p.id === id);
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...updatedData, id };
    saveDatabase(db);
    return res.json({ success: true, product: db.products[index] });
  }
  res.status(404).json({ success: false, message: "Footwear not found." });
});
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const initialCount = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length < initialCount) {
    saveDatabase(db);
    return res.json({ success: true });
  }
  res.status(404).json({ success: false, message: "Product not found." });
});
app.get("/api/orders", (req, res) => {
  res.json(db.orders);
});
app.get("/api/orders/user/:userId", (req, res) => {
  const { userId } = req.params;
  const userOrders = db.orders.filter((o) => o.user_id === userId);
  res.json(userOrders);
});
app.post("/api/orders", (req, res) => {
  const { user_id, items, total, address, customer_name, customer_email, razorpay_order_id, razorpay_payment_id, buyback_requested, buyback_details } = req.body;
  const newOrder = {
    id: `YY-ORD-${Math.floor(1e4 + Math.random() * 9e4)}`,
    user_id,
    customer_name,
    customer_email,
    items,
    total,
    status: "Pending",
    address,
    razorpay_order_id: razorpay_order_id || `order_rp_${Date.now()}`,
    razorpay_payment_id: razorpay_payment_id || `pay_rp_${Date.now()}`,
    buyback_requested: buyback_requested || false,
    buyback_details: buyback_details || null,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.orders.unshift(newOrder);
  saveDatabase(db);
  res.json({ success: true, order: newOrder });
});
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = db.orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    db.orders[index].status = status;
    saveDatabase(db);
    return res.json({ success: true, order: db.orders[index] });
  }
  res.status(404).json({ success: false, message: "Order records not found." });
});
app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "A valid payment amount is required." });
    }
    const options = {
      amount: Math.round(Number(amount) * 100),
      // Amount in paise
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ error: error.message || "Unable to create Razorpay order." });
  }
});
app.post("/api/razorpay/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification parameters." });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = import_crypto.default.createHmac("sha256", razorpayKeySecret).update(body.toString()).digest("hex");
    const isSignatureValid = expectedSignature === razorpay_signature;
    if (isSignatureValid) {
      res.json({ status: "ok", verified: true, payment_id: razorpay_payment_id, order_id: razorpay_order_id });
    } else {
      res.status(400).json({ status: "error", verified: false, message: "Invalid payment signature." });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ error: error.message || "Payment verification failed." });
  }
});
app.post("/api/razorpay/webhook", (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("RAZORPAY_WEBHOOK_SECRET not configured. Skipping webhook verification.");
    return res.json({ status: "ok", message: "Webhook received (no verification configured)." });
  }
  const expectedSignature = req.headers["x-razorpay-signature"];
  if (!expectedSignature) {
    return res.status(400).json({ status: "error", message: "Missing signature header." });
  }
  try {
    const body = JSON.stringify(req.body);
    const expectedSig = import_crypto.default.createHmac("sha256", webhookSecret).update(body).digest("hex");
    if (expectedSig !== expectedSignature) {
      return res.status(400).json({ status: "error", message: "Invalid webhook signature." });
    }
    const event = req.body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const payment = req.body.payload?.payment?.entity;
      const orderEntity = req.body.payload?.order?.entity;
      if (payment && orderEntity) {
        const orderId = `YY-ORD-${Math.floor(1e4 + Math.random() * 9e4)}`;
        const newOrder = {
          id: orderId,
          user_id: payment.notes?.user_id || "guest",
          customer_name: payment.notes?.customer_name || "Customer",
          customer_email: payment.email || payment.notes?.email || "",
          items: payment.notes?.items ? JSON.parse(payment.notes.items) : [],
          total: (orderEntity.amount || 0) / 100,
          status: "Paid",
          address: payment.notes?.address || "",
          phone: payment.contact || payment.notes?.phone || "",
          delivery_region: payment.notes?.delivery_region || "TN",
          delivery_charge: parseFloat(payment.notes?.delivery_charge || "0"),
          estimated_weight_kg: parseFloat(payment.notes?.estimated_weight_kg || "0"),
          razorpay_order_id: orderEntity.id,
          razorpay_payment_id: payment.id,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        db.orders.unshift(newOrder);
        saveDatabase(db);
        console.log("Order saved from Razorpay webhook:", newOrder);
      }
    }
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});
app.get("/api/preorders", (req, res) => {
  res.json(db.preorders);
});
app.get("/api/preorders/user/:userId", (req, res) => {
  const { userId } = req.params;
  const userPreorders = db.preorders.filter((p) => p.user_id === userId);
  res.json(userPreorders);
});
app.post("/api/preorders", (req, res) => {
  const preorderData = req.body;
  preorderData.id = `YY-PRE-${Math.floor(1e3 + Math.random() * 9e3)}`;
  preorderData.status = "Under Review";
  preorderData.created_at = (/* @__PURE__ */ new Date()).toISOString();
  preorderData.image_urls = preorderData.image_urls || ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop"];
  db.preorders.unshift(preorderData);
  saveDatabase(db);
  res.json({ success: true, preorder: preorderData });
});
app.put("/api/preorders/:id", (req, res) => {
  const { id } = req.params;
  const { status, admin_note, estimated_delivery } = req.body;
  const index = db.preorders.findIndex((p) => p.id === id);
  if (index !== -1) {
    if (status) db.preorders[index].status = status;
    if (admin_note !== void 0) db.preorders[index].admin_note = admin_note;
    if (estimated_delivery !== void 0) db.preorders[index].estimated_delivery = estimated_delivery;
    saveDatabase(db);
    return res.json({ success: true, preorder: db.preorders[index] });
  }
  res.status(404).json({ success: false, message: "Pre-order records not found." });
});
app.get("/api/offers", (req, res) => {
  res.json(db.offers);
});
app.post("/api/offers", (req, res) => {
  const newOffer = req.body;
  newOffer.id = `off-${Date.now()}`;
  newOffer.is_active = newOffer.is_active !== false;
  newOffer.discount_percent = Number(newOffer.discount_percent) || 10;
  newOffer.banner_url = newOffer.banner_url || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200 auto=format&fit=crop";
  db.offers.unshift(newOffer);
  saveDatabase(db);
  res.json({ success: true, offer: newOffer });
});
app.delete("/api/offers/:id", (req, res) => {
  const { id } = req.params;
  db.offers = db.offers.filter((o) => o.id !== id);
  saveDatabase(db);
  res.json({ success: true });
});
app.get("/api/content-blocks", (req, res) => {
  res.json(db.content_blocks);
});
app.post("/api/content-blocks", (req, res) => {
  const { key, value } = req.body;
  const index = db.content_blocks.findIndex((cb) => cb.key === key);
  if (index !== -1) {
    db.content_blocks[index].value = typeof value === "object" ? JSON.stringify(value) : value;
  } else {
    db.content_blocks.push({
      id: `cb-${key}`,
      key,
      value: typeof value === "object" ? JSON.stringify(value) : value
    });
  }
  saveDatabase(db);
  res.json({ success: true, content_blocks: db.content_blocks });
});
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key is not configured." });
    }
    const systemInstruction = `You are the official AI Customer Support Assistant for YY Leathers, a premium leather goods brand. Your goal is to provide helpful, polite, and concise support to customers browsing the website or looking at their profiles.

### Tone & Style:
- Professional, welcoming, and premium yet approachable.
- Keep answers short and direct (1-3 sentences maximum per response) so it fits well inside a compact web chat widget.
- Use bullet points if listing steps or multiple items.

### Core Knowledge Base & App Navigation:
1. About YY Leathers: We specialize in high-quality leather products, including men's collections, new arrivals, and custom pre-orders.
2. Offline Store & Location: We have an offline flagship store and workshop located in Surapet, Chennai. Customers can visit us to experience our leather goods firsthand.
3. Our Collections: We feature categories such as "Best Sellers" and "New Arrivals". Users can find these directly on the "Shop" page.
4. Ordering: Customers can place standard Orders (shipped online) or Pre-orders (for store reservations or custom pickups). 
5. Order Tracking: Customers can check their order status, past purchases, or active pre-orders by clicking on the Profile icon (top right or bottom navigation) and selecting the "My Orders" or "Store Reservations" tab.
6. Browsing & Filtering: On the Shop page, users can filter by categories (Shoes, Bags, Belts), collections (Best Sellers, New Arrivals), or sort products by price (Low to High, High to Low).

### Guiding the User:
- If a user asks where to find something, give them exact instructions (e.g., "Go to the Shop page and use the Sort by Price option at the top" or "Click the Profile icon and navigate to 'My Orders'").

### Guardrails & Hand-off Rules:
- If a user asks about a specific order status or personal account issue, remind them to log in and check their Profile, or offer human support.
- If a customer asks a question outside of product details, store policies, or order support, politely guide them back to the topic.
- If you do not know the answer, say: "I'm sorry I can't resolve this right now. Please leave your email address and order number, and a human support representative will get back to you shortly."`;
    const ai = getAi();
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history,
      // array of { role: 'user' | 'model', parts: [{text: string}] }
      config: {
        systemInstruction
      }
    });
    const response = await chat.sendMessage({ message });
    res.json({ response: response.text });
  } catch (err) {
    console.error("Chat Error:", err);
    if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("Quota")) {
      return res.status(429).json({ error: "AI service is currently busy. Please try again later." });
    }
    res.status(500).json({ error: "Failed to process chat message." });
  }
});
app.get("/api/supabase-status", async (req, res) => {
  try {
    const start = Date.now();
    const { data, error } = await supabase.from("yy_store_sync").select("key, updated_at").limit(10);
    const latency = Date.now() - start;
    if (error) {
      if (error.code === "42P01") {
        return res.json({
          configured: true,
          connected: true,
          table_exists: false,
          supabase_url: SUPABASE_URL,
          error: "Table 'yy_store_sync' does not exist in your Supabase schema.",
          sql_migration: `CREATE TABLE IF NOT EXISTS yy_store_sync (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) to secure or open up client access
ALTER TABLE yy_store_sync ENABLE ROW LEVEL SECURITY;

-- Allow unrestricted anonymous select and write access for key-value records
CREATE POLICY "Allow anon read" ON yy_store_sync FOR SELECT USING (true);
CREATE POLICY "Allow anon upsert" ON yy_store_sync FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON yy_store_sync FOR UPDATE USING (true);
`
        });
      }
      return res.json({
        configured: true,
        connected: false,
        table_exists: false,
        supabase_url: SUPABASE_URL,
        error: error.message
      });
    }
    return res.json({
      configured: true,
      connected: true,
      table_exists: true,
      supabase_url: SUPABASE_URL,
      latency_ms: latency,
      records: data
    });
  } catch (err) {
    res.json({
      configured: true,
      connected: false,
      table_exists: false,
      supabase_url: SUPABASE_URL,
      error: err.message || String(err)
    });
  }
});
app.post("/api/supabase-sync/push", async (req, res) => {
  try {
    const keys = ["profiles", "products", "orders", "preorders", "offers", "content_blocks"];
    let successCount = 0;
    for (const key of keys) {
      const { error } = await supabase.from("yy_store_sync").upsert({ key, value: db[key], updated_at: (/* @__PURE__ */ new Date()).toISOString() }, { onConflict: "key" });
      if (!error) {
        successCount++;
      } else {
        console.error(`[Manual Sync Push] Error pushing '${key}':`, error);
      }
    }
    res.json({ success: true, message: `Pushed ${successCount} collections to Supabase Cloud.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.post("/api/supabase-sync/pull", async (req, res) => {
  try {
    const ok = await pullFromSupabase();
    if (ok) {
      res.json({ success: true, message: "Successfully synchronized and pulled fresh state from Supabase Cloud." });
    } else {
      res.status(400).json({ success: false, message: "Failed to pull state. Please run SQL migration script to construct 'yy_store_sync' table." });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.all("/api/*", (req, res) => {
  res.status(404).json({ success: false, error: "API route not found" });
});
async function startServer() {
  try {
    await pullFromSupabase();
  } catch (e) {
    console.error("Initial Supabase cloud state restore pass skipped.", e);
  }
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  if (IS_SERVERLESS) {
  } else {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`YY Leathers Server listening on host 0.0.0.0 port ${PORT}`);
    });
  }
}
if (!IS_SERVERLESS) {
  startServer();
}
var server_default = app;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
