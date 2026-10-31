import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3e3;
const isProduction = process.env.NODE_ENV === "production";
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});
app.use(express.json());
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DEFAULT_PRODUCTS = [
  {
    id: "prod-maggi-masala",
    name: "Masala Maggi",
    description: "Classic aromatic Indian spice mix noodles with saut\xE9ed fresh vegetables, coriander, and authentic desi tadka.",
    price: 40,
    originalPrice: 50,
    category: "Maggi & Noodles",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 10,
    sellerName: "Asha Devi Rasoi",
    sellerLocation: "Rohania Market, Varanasi",
    rating: 4.8,
    reviewCount: 142,
    tags: ["Best Seller", "Desi Spices", "Quick Bite"]
  },
  {
    id: "prod-maggi-cheese",
    name: "Cheese Maggi",
    description: "Double melted mozzarella and processed cheese loaded on piping hot spicy masala Maggi with oregano herbs.",
    price: 60,
    originalPrice: 75,
    category: "Maggi & Noodles",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 12,
    sellerName: "Kashi Fast Food & Cafe",
    sellerLocation: "Station Road, Phulpur",
    rating: 4.9,
    reviewCount: 98,
    tags: ["Super Cheesy", "Kids Favorite"]
  },
  {
    id: "prod-pasta-red-sauce",
    name: "Red Sauce Pasta",
    description: "Italian penne tossed in rich sun-ripened tomato basil sauce, garlic, bell peppers, sweet corn, and Indian herbs.",
    price: 60,
    originalPrice: 70,
    category: "Pasta & Italian",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 15,
    sellerName: "Shri Ram Local Delights",
    sellerLocation: "Sahjanwa Bazaar, Gorakhpur",
    rating: 4.7,
    reviewCount: 86,
    tags: ["Tangy", "Fresh Veggies"]
  },
  {
    id: "prod-pasta-white-sauce",
    name: "White Sauce Pasta",
    description: "Creamy gourmet Bechamel pasta made with butter, fresh milk, roasted garlic, black pepper, and golden sweet corn.",
    price: 80,
    originalPrice: 99,
    category: "Pasta & Italian",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 18,
    sellerName: "Kashi Fast Food & Cafe",
    sellerLocation: "Station Road, Phulpur",
    rating: 4.9,
    reviewCount: 114,
    tags: ["Chef Special", "Rich & Creamy"]
  },
  {
    id: "prod-macaroni-masala",
    name: "Masala Macaroni",
    description: "Traditional home-style desi macaroni prepared with chopped onions, juicy tomatoes, green chillies, and chatpata garam masala.",
    price: 50,
    originalPrice: 60,
    category: "Desi Macaroni",
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 12,
    sellerName: "Ganga Maa Mahila Self Help Group",
    sellerLocation: "Bithoor Village, Kanpur",
    rating: 4.8,
    reviewCount: 79,
    tags: ["Home Style", "Women Entrepreneur"]
  },
  {
    id: "prod-macaroni-chatpata",
    name: "Chatpata Macaroni",
    description: "Extra spicy street-style macaroni saut\xE9ed with capsicum, Schezwan chili garlic paste, lemon juice, and crispy fried onions.",
    price: 60,
    originalPrice: 75,
    category: "Desi Macaroni",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 14,
    sellerName: "Asha Devi Rasoi",
    sellerLocation: "Rohania Market, Varanasi",
    rating: 4.7,
    reviewCount: 63,
    tags: ["Extra Spicy", "Street Style"]
  },
  {
    id: "prod-chai-samosa-combo",
    name: "Desi Kulhad Chai & 2 Crispy Samosas",
    description: "Steaming ginger cardamom tea served in authentic clay kulhad with 2 fresh golden potato samosas and mint chutney.",
    price: 35,
    originalPrice: 45,
    category: "Tea & Snacks",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 8,
    sellerName: "Pandey Ji Tea Stall & Sweets",
    sellerLocation: "Main Chowk, Danapur",
    rating: 4.9,
    reviewCount: 230,
    tags: ["All-Time Favorite", "Local Kulhad"]
  },
  {
    id: "prod-paneer-pakoda",
    name: "Stuffed Paneer Bread Pakoda (2 Pcs)",
    description: "Soft malai paneer slice inside potato spiced bread, dipped in gram flour batter and deep fried to golden crispness.",
    price: 45,
    originalPrice: 55,
    category: "Tea & Snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 10,
    sellerName: "Asha Devi Rasoi",
    sellerLocation: "Rohania Market, Varanasi",
    rating: 4.8,
    reviewCount: 52,
    tags: ["Fresh Paneer", "Crispy"]
  }
];
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = {
        products: DEFAULT_PRODUCTS,
        orders: [],
        applications: [],
        emailLogs: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.products || parsed.products.length === 0) {
      parsed.products = DEFAULT_PRODUCTS;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch (err) {
    console.error("Error reading DB file, returning fallback:", err);
    return {
      products: DEFAULT_PRODUCTS,
      orders: [],
      applications: [],
      emailLogs: []
    };
  }
}
function writeDB(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error writing DB file:", err);
  }
}
function generateOrderId() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const random = Math.floor(1e3 + Math.random() * 9e3);
  return `GSS-${year}-${random}`;
}
function getValidBusinessEmail() {
  const envEmail = process.env.BUSINESS_EMAIL;
  if (envEmail && envEmail.includes("@") && envEmail.includes(".")) {
    return envEmail.trim();
  }
  return "pandeysudhanshu413@gmail.com";
}
async function sendOrderNotificationEmail(order, db) {
  const businessEmail = getValidBusinessEmail();
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const subject = `[GS Setu New Order] #${order.id} - \u20B9${order.totalAmount} from ${order.customerName}`;
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const adminUrl = `${appUrl}?admin=true`;
  const itemsListText = order.items.map((item) => `- ${item.name} x ${item.quantity} (\u20B9${item.price} each = \u20B9${item.price * item.quantity})`).join("\n");
  const textContent = `
NEW ORDER RECEIVED ON GS SETU
===================================
Order ID: ${order.id}
Status: ${order.status}
Order Time: ${new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

CUSTOMER DETAILS:
- Name: ${order.customerName}
- Phone: ${order.customerPhone}
- Village / Town / City: ${order.location}
- Delivery Address: ${order.deliveryAddress}
${order.deliveryInstructions ? `- Instructions: ${order.deliveryInstructions}` : ""}

ORDER SUMMARY:
${itemsListText}

Subtotal: \u20B9${order.subtotal}
Delivery Fee: \u20B9${order.deliveryFee === 0 ? "FREE" : `\u20B9${order.deliveryFee}`}
TOTAL AMOUNT: \u20B9${order.totalAmount}

ADMIN DASHBOARD ACTION:
Manage, Accept, or Dispatch this order in the GS Setu Admin Dashboard:
${adminUrl}

--
GS Setu - Connecting Local Needs with Local Opportunities
Founder: Sudhanshu Pandey
  `.trim();
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass
        }
      });
      await transporter.sendMail({
        from: `"GS Setu Orders" <${gmailUser}>`,
        to: businessEmail,
        subject,
        text: textContent
      });
      const log = {
        id: `email-${Date.now()}`,
        orderId: order.id,
        recipient: businessEmail,
        subject,
        status: "Sent",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        details: `Successfully sent via Gmail SMTP to ${businessEmail}`
      };
      db.emailLogs.unshift(log);
      writeDB(db);
      return { sent: true, message: `Email delivered to ${businessEmail}` };
    } catch (err) {
      console.error("Failed to send email via SMTP:", err);
      const log = {
        id: `email-${Date.now()}`,
        orderId: order.id,
        recipient: businessEmail,
        subject,
        status: "Failed",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        details: `SMTP error: ${err.message || String(err)}`
      };
      db.emailLogs.unshift(log);
      writeDB(db);
      return { sent: false, message: `SMTP error: ${err.message}` };
    }
  } else {
    const log = {
      id: `email-${Date.now()}`,
      orderId: order.id,
      recipient: businessEmail,
      subject,
      status: "Logged",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: `Queued and formatted for ${businessEmail}. Ready for SMTP delivery (Set GMAIL_USER and GMAIL_APP_PASSWORD in env to transmit live).`
    };
    db.emailLogs.unshift(log);
    writeDB(db);
    return {
      sent: false,
      message: `Order logged to server notification dispatch. To send live emails, provide GMAIL_APP_PASSWORD.`
    };
  }
}
app.get("/api/products", (_req, res) => {
  const db = readDB();
  res.json({ success: true, products: db.products });
});
app.post("/api/products", (req, res) => {
  const db = readDB();
  const { name, description, price, originalPrice, category, image, isVeg, sellerName, sellerLocation, preparationTimeMinutes, tags } = req.body;
  if (!name || price === void 0 || !category) {
    res.status(400).json({ success: false, message: "Name, price, and category are required" });
    return;
  }
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: String(name).trim(),
    description: String(description || "").trim(),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : void 0,
    category: String(category).trim(),
    image: String(image || "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80"),
    isAvailable: true,
    isVeg: isVeg !== false,
    preparationTimeMinutes: preparationTimeMinutes ? Number(preparationTimeMinutes) : 15,
    sellerName: String(sellerName || "Local Village Kitchen").trim(),
    sellerLocation: String(sellerLocation || "Local Town").trim(),
    rating: 5,
    reviewCount: 1,
    tags: Array.isArray(tags) ? tags : ["Fresh", "Locally Made"]
  };
  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json({ success: true, product: newProduct });
});
app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }
  const existing = db.products[index];
  const updated = {
    ...existing,
    ...req.body,
    price: req.body.price !== void 0 ? Number(req.body.price) : existing.price,
    originalPrice: req.body.originalPrice !== void 0 ? Number(req.body.originalPrice) : existing.originalPrice,
    isAvailable: req.body.isAvailable !== void 0 ? Boolean(req.body.isAvailable) : existing.isAvailable
  };
  db.products[index] = updated;
  writeDB(db);
  res.json({ success: true, product: updated });
});
app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }
  const removed = db.products.splice(index, 1)[0];
  writeDB(db);
  res.json({ success: true, removed });
});
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, customerPhone, deliveryAddress, location, deliveryInstructions, items } = req.body;
    if (!customerName || !String(customerName).trim()) {
      res.status(400).json({ success: false, message: "Customer name is required" });
      return;
    }
    const cleanPhone = String(customerPhone || "").replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      res.status(400).json({ success: false, message: "Please provide a valid 10-digit Indian mobile number" });
      return;
    }
    if (!deliveryAddress || !String(deliveryAddress).trim()) {
      res.status(400).json({ success: false, message: "Delivery address is required" });
      return;
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: "Cart cannot be empty" });
      return;
    }
    const db = readDB();
    let subtotal = 0;
    const validatedItems = [];
    for (const item of items) {
      const product = db.products.find((p) => p.id === item.productId);
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = product ? product.price : Number(item.price);
      const name = product ? product.name : item.name;
      subtotal += price * qty;
      validatedItems.push({
        productId: item.productId,
        name,
        price,
        quantity: qty,
        image: product?.image || item.image
      });
    }
    const deliveryFee = subtotal >= 150 ? 0 : 20;
    const totalAmount = subtotal + deliveryFee;
    const newOrder = {
      id: generateOrderId(),
      customerName: String(customerName).trim(),
      customerPhone: cleanPhone,
      deliveryAddress: String(deliveryAddress).trim(),
      location: String(location || "Local Area").trim(),
      deliveryInstructions: deliveryInstructions ? String(deliveryInstructions).trim() : void 0,
      items: validatedItems,
      subtotal,
      deliveryFee,
      totalAmount,
      status: "New",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      statusHistory: [
        {
          status: "New",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          note: "Order successfully placed by customer on GS Setu"
        }
      ]
    };
    db.orders.unshift(newOrder);
    writeDB(db);
    const emailResult = await sendOrderNotificationEmail(newOrder, db);
    res.status(201).json({
      success: true,
      order: newOrder,
      notification: emailResult
    });
  } catch (err) {
    console.error("Error in POST /api/orders:", err);
    res.status(500).json({ success: false, message: "Failed to place order. Please try again." });
  }
});
app.get("/api/orders", (req, res) => {
  const db = readDB();
  const { status, phone, search } = req.query;
  let results = [...db.orders];
  if (phone) {
    const cleanPhone = String(phone).replace(/\D/g, "");
    results = results.filter((o) => o.customerPhone === cleanPhone);
  }
  if (status && status !== "all") {
    results = results.filter((o) => o.status.toLowerCase() === String(status).toLowerCase());
  }
  if (search) {
    const term = String(search).toLowerCase();
    results = results.filter(
      (o) => o.id.toLowerCase().includes(term) || o.customerName.toLowerCase().includes(term) || o.customerPhone.includes(term) || o.location.toLowerCase().includes(term)
    );
  }
  res.json({ success: true, orders: results });
});
app.get("/api/orders/:id", (req, res) => {
  const db = readDB();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: "Order not found with the specified ID" });
    return;
  }
  res.json({ success: true, order });
});
app.patch("/api/orders/:id/status", async (req, res) => {
  const db = readDB();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: "Order not found" });
    return;
  }
  const { status, reason } = req.body;
  const validStatuses = ["New", "Accepted", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ success: false, message: "Invalid order status" });
    return;
  }
  order.status = status;
  order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (reason) {
    order.statusReason = String(reason);
  }
  order.statusHistory.push({
    status,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    note: reason ? String(reason) : `Status updated to ${status} by GS Setu Admin`
  });
  writeDB(db);
  res.json({ success: true, order });
});
app.post("/api/partners/apply", (req, res) => {
  const { type, fullName, phone, villageTown, serviceCategory, experienceDescription } = req.body;
  if (!fullName || !phone || !type) {
    res.status(400).json({ success: false, message: "Full name, phone, and type are required" });
    return;
  }
  const db = readDB();
  const application = {
    id: `app-${Date.now()}`,
    type,
    fullName: String(fullName).trim(),
    phone: String(phone).replace(/\D/g, ""),
    villageTown: String(villageTown || "").trim(),
    serviceCategory: String(serviceCategory || "").trim(),
    experienceDescription: String(experienceDescription || "").trim(),
    status: "Pending",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.applications.unshift(application);
  writeDB(db);
  res.status(201).json({ success: true, application });
});
app.get("/api/partners", (_req, res) => {
  const db = readDB();
  res.json({ success: true, applications: db.applications });
});
app.get("/api/notifications", (_req, res) => {
  const db = readDB();
  const businessEmail = getValidBusinessEmail();
  const hasSmtpConfigured = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  res.json({
    success: true,
    businessEmail,
    hasSmtpConfigured,
    smtpUser: process.env.GMAIL_USER ? `${process.env.GMAIL_USER.slice(0, 3)}***@gmail.com` : null,
    logs: db.emailLogs
  });
});
app.post("/api/notifications/test-email", async (req, res) => {
  const businessEmail = req.body.email || getValidBusinessEmail();
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const db = readDB();
  if (!gmailUser || !gmailPass) {
    const log = {
      id: `email-${Date.now()}`,
      orderId: "TEST-PING",
      recipient: businessEmail,
      subject: `[GS Setu Test] System Notification Dispatcher`,
      status: "Logged",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: `Test dispatch logged. To connect live Gmail SMTP, set GMAIL_USER and GMAIL_APP_PASSWORD in environment.`
    };
    db.emailLogs.unshift(log);
    writeDB(db);
    res.json({
      success: false,
      isLogged: true,
      message: "SMTP credentials (GMAIL_USER & GMAIL_APP_PASSWORD) not yet set in environment. Test email logged to internal server outbox."
    });
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });
    await transporter.sendMail({
      from: `"GS Setu System" <${gmailUser}>`,
      to: businessEmail,
      subject: `[GS Setu Verified] Live Email Test for Founder Sudhanshu Pandey`,
      text: `Hello Sudhanshu Pandey,

This is a live test notification from your GS Setu platform backend.
Email dispatcher is functioning properly.

Time: ${(/* @__PURE__ */ new Date()).toISOString()}`
    });
    const log = {
      id: `email-${Date.now()}`,
      orderId: "TEST-LIVE",
      recipient: businessEmail,
      subject: `[GS Setu Verified] Live Email Test`,
      status: "Sent",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: `Live test email successfully delivered via Gmail SMTP to ${businessEmail}`
    };
    db.emailLogs.unshift(log);
    writeDB(db);
    res.json({ success: true, message: `Live test email successfully sent to ${businessEmail}!` });
  } catch (err) {
    res.status(500).json({ success: false, message: `SMTP verification failed: ${err.message}` });
  }
});
app.get("/api/system/status", (_req, res) => {
  const db = readDB();
  res.json({
    status: "online",
    appName: "GS Setu",
    founder: "Sudhanshu Pandey",
    database: {
      type: "Persistent JSON Store (Atomic)",
      path: DB_FILE,
      productsCount: db.products.length,
      ordersCount: db.orders.length,
      applicationsCount: db.applications.length
    },
    notifications: {
      businessEmail: getValidBusinessEmail(),
      smtpConnected: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
    }
  });
});
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GS Setu full-stack server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
