import express from 'express';
type Request = express.Request;
type Response = express.Response;
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return parseInt(process.argv[portArgIndex + 1], 10);
  }
  if (process.env.PORT) {
    return parseInt(process.env.PORT, 10);
  }
  return 3000;
}

const PORT = getPort();
const isProduction = process.env.NODE_ENV === 'production';

// CORS Middleware for iframe proxy and API calls
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Persistent Data Storage Path
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface FoodProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  isAvailable: boolean;
  isVeg: boolean;
  preparationTimeMinutes: number;
  sellerName: string;
  sellerLocation: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export type OrderStatus = 'New' | 'Accepted' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  location: string; // village / town / city
  deliveryInstructions?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  statusReason?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
}

export interface PartnerApplication {
  id: string;
  type: 'seller' | 'delivery' | 'worker';
  fullName: string;
  phone: string;
  villageTown: string;
  serviceCategory: string;
  experienceDescription: string;
  status: 'Pending' | 'Approved' | 'Contacted';
  createdAt: string;
}

export interface EmailLog {
  id: string;
  orderId: string;
  recipient: string;
  subject: string;
  status: 'Sent' | 'Logged' | 'Failed';
  timestamp: string;
  details: string;
}

interface DatabaseSchema {
  products: FoodProduct[];
  orders: Order[];
  applications: PartnerApplication[];
  emailLogs: EmailLog[];
}

const DEFAULT_PRODUCTS: FoodProduct[] = [
  {
    id: 'prod-maggi-masala',
    name: 'Masala Maggi',
    description: 'Hot and tasty masala Maggi, freshly prepared with Indian spices.',
    price: 35,
    originalPrice: 45,
    category: 'Maggi & Noodles',
    image: '/images/masala_maggi.jpg',
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 10,
    sellerName: 'Asha Devi Rasoi',
    sellerLocation: 'Rohania Market, Varanasi',
    rating: 4.8,
    reviewCount: 142,
    tags: ['Best Seller', 'Desi Spices', 'Quick Bite']
  },
  {
    id: 'prod-maggi-cheese',
    name: 'Cheese Maggi',
    description: 'Double melted mozzarella and processed cheese loaded on piping hot spicy masala Maggi with oregano herbs.',
    price: 60,
    originalPrice: 75,
    category: 'Maggi & Noodles',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 12,
    sellerName: 'Kashi Fast Food & Cafe',
    sellerLocation: 'Station Road, Phulpur',
    rating: 4.9,
    reviewCount: 98,
    tags: ['Super Cheesy', 'Kids Favorite']
  },
  {
    id: 'prod-pasta-red-sauce',
    name: 'Red Sauce Pasta',
    description: 'Italian penne tossed in rich sun-ripened tomato basil sauce, garlic, bell peppers, sweet corn, and Indian herbs.',
    price: 60,
    originalPrice: 70,
    category: 'Pasta & Italian',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 15,
    sellerName: 'Shri Ram Local Delights',
    sellerLocation: 'Sahjanwa Bazaar, Gorakhpur',
    rating: 4.7,
    reviewCount: 86,
    tags: ['Tangy', 'Fresh Veggies']
  },
  {
    id: 'prod-pasta-white-sauce',
    name: 'White Sauce Pasta',
    description: 'Creamy gourmet Bechamel pasta made with butter, fresh milk, roasted garlic, black pepper, and golden sweet corn.',
    price: 80,
    originalPrice: 99,
    category: 'Pasta & Italian',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 18,
    sellerName: 'Kashi Fast Food & Cafe',
    sellerLocation: 'Station Road, Phulpur',
    rating: 4.9,
    reviewCount: 114,
    tags: ['Chef Special', 'Rich & Creamy']
  },
  {
    id: 'prod-macaroni-masala',
    name: 'Masala Macaroni',
    description: 'Traditional home-style desi macaroni prepared with chopped onions, juicy tomatoes, green chillies, and chatpata garam masala.',
    price: 50,
    originalPrice: 60,
    category: 'Desi Macaroni',
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 12,
    sellerName: 'Ganga Maa Mahila Self Help Group',
    sellerLocation: 'Bithoor Village, Kanpur',
    rating: 4.8,
    reviewCount: 79,
    tags: ['Home Style', 'Women Entrepreneur']
  },
  {
    id: 'prod-macaroni-chatpata',
    name: 'Chatpata Macaroni',
    description: 'Extra spicy street-style macaroni sautéed with capsicum, Schezwan chili garlic paste, lemon juice, and crispy fried onions.',
    price: 60,
    originalPrice: 75,
    category: 'Desi Macaroni',
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 14,
    sellerName: 'Asha Devi Rasoi',
    sellerLocation: 'Rohania Market, Varanasi',
    rating: 4.7,
    reviewCount: 63,
    tags: ['Extra Spicy', 'Street Style']
  },
  {
    id: 'prod-chai-samosa-combo',
    name: 'Desi Kulhad Chai & 2 Crispy Samosas',
    description: 'Steaming ginger cardamom tea served in authentic clay kulhad with 2 fresh golden potato samosas and mint chutney.',
    price: 35,
    originalPrice: 45,
    category: 'Tea & Snacks',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 8,
    sellerName: 'Pandey Ji Tea Stall & Sweets',
    sellerLocation: 'Main Chowk, Danapur',
    rating: 4.9,
    reviewCount: 230,
    tags: ['All-Time Favorite', 'Local Kulhad']
  },
  {
    id: 'prod-paneer-pakoda',
    name: 'Stuffed Paneer Bread Pakoda (2 Pcs)',
    description: 'Soft malai paneer slice inside potato spiced bread, dipped in gram flour batter and deep fried to golden crispness.',
    price: 45,
    originalPrice: 55,
    category: 'Tea & Snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isVeg: true,
    preparationTimeMinutes: 10,
    sellerName: 'Asha Devi Rasoi',
    sellerLocation: 'Rohania Market, Varanasi',
    rating: 4.8,
    reviewCount: 52,
    tags: ['Fresh Paneer', 'Crispy']
  }
];

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = {
        products: DEFAULT_PRODUCTS,
        orders: [],
        applications: [],
        emailLogs: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.products || parsed.products.length === 0) {
      parsed.products = DEFAULT_PRODUCTS;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB file, returning fallback:', err);
    return {
      products: DEFAULT_PRODUCTS,
      orders: [],
      applications: [],
      emailLogs: []
    };
  }
}

function writeDB(data: DatabaseSchema): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

// Order ID generator
function generateOrderId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GSS-${year}-${random}`;
}

function getValidBusinessEmail(): string {
  const envEmail = process.env.BUSINESS_EMAIL;
  if (envEmail && envEmail.includes('@') && envEmail.includes('.')) {
    return envEmail.trim();
  }
  return 'pandeysudhanshu413@gmail.com';
}

// Gmail Notification Dispatcher
async function sendOrderNotificationEmail(order: Order, db: DatabaseSchema): Promise<{ sent: boolean; message: string }> {
  const businessEmail = getValidBusinessEmail();
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  const subject = `[GS Setu New Order] #${order.id} - ₹${order.totalAmount} from ${order.customerName}`;
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const adminUrl = `${appUrl}?admin=true`;

  const itemsListText = order.items
    .map((item) => `- ${item.name} x ${item.quantity} (₹${item.price} each = ₹${item.price * item.quantity})`)
    .join('\n');

  const textContent = `
NEW ORDER RECEIVED ON GS SETU
===================================
Order ID: ${order.id}
Status: ${order.status}
Order Time: ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

CUSTOMER DETAILS:
- Name: ${order.customerName}
- Phone: ${order.customerPhone}
- Village / Town / City: ${order.location}
- Delivery Address: ${order.deliveryAddress}
${order.deliveryInstructions ? `- Instructions: ${order.deliveryInstructions}` : ''}

ORDER SUMMARY:
${itemsListText}

Subtotal: ₹${order.subtotal}
Delivery Fee: ₹${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
TOTAL AMOUNT: ₹${order.totalAmount}

ADMIN DASHBOARD ACTION:
Manage, Accept, or Dispatch this order in the GS Setu Admin Dashboard:
${adminUrl}

--
GS Setu - Connecting Local Needs with Local Opportunities
Founder: Sudhanshu Pandey
  `.trim();

  // If real Gmail credentials are provided in env
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
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

      const log: EmailLog = {
        id: `email-${Date.now()}`,
        orderId: order.id,
        recipient: businessEmail,
        subject,
        status: 'Sent',
        timestamp: new Date().toISOString(),
        details: `Successfully sent via Gmail SMTP to ${businessEmail}`
      };
      db.emailLogs.unshift(log);
      writeDB(db);

      return { sent: true, message: `Email delivered to ${businessEmail}` };
    } catch (err: any) {
      console.error('Failed to send email via SMTP:', err);
      const log: EmailLog = {
        id: `email-${Date.now()}`,
        orderId: order.id,
        recipient: businessEmail,
        subject,
        status: 'Failed',
        timestamp: new Date().toISOString(),
        details: `SMTP error: ${err.message || String(err)}`
      };
      db.emailLogs.unshift(log);
      writeDB(db);

      return { sent: false, message: `SMTP error: ${err.message}` };
    }
  } else {
    // Record into outbox log
    const log: EmailLog = {
      id: `email-${Date.now()}`,
      orderId: order.id,
      recipient: businessEmail,
      subject,
      status: 'Logged',
      timestamp: new Date().toISOString(),
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

// ==========================================
// API ROUTES
// ==========================================

// 1. Get all products
app.get('/api/products', (_req: Request, res: Response) => {
  const db = readDB();
  res.json({ success: true, products: db.products });
});

// 2. Add product (Admin)
app.post('/api/products', (req: Request, res: Response) => {
  const db = readDB();
  const { name, description, price, originalPrice, category, image, isVeg, sellerName, sellerLocation, preparationTimeMinutes, tags } = req.body;

  if (!name || price === undefined || !category) {
    res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    return;
  }

  const newProduct: FoodProduct = {
    id: `prod-${Date.now()}`,
    name: String(name).trim(),
    description: String(description || '').trim(),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    category: String(category).trim(),
    image: String(image || 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80'),
    isAvailable: true,
    isVeg: isVeg !== false,
    preparationTimeMinutes: preparationTimeMinutes ? Number(preparationTimeMinutes) : 15,
    sellerName: String(sellerName || 'Local Village Kitchen').trim(),
    sellerLocation: String(sellerLocation || 'Local Town').trim(),
    rating: 5.0,
    reviewCount: 1,
    tags: Array.isArray(tags) ? tags : ['Fresh', 'Locally Made']
  };

  db.products.push(newProduct);
  writeDB(db);

  res.status(201).json({ success: true, product: newProduct });
});

// 3. Edit product (Admin)
app.put('/api/products/:id', (req: Request, res: Response) => {
  const db = readDB();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const existing = db.products[index];
  const updated: FoodProduct = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : existing.originalPrice,
    isAvailable: req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : existing.isAvailable
  };

  db.products[index] = updated;
  writeDB(db);

  res.json({ success: true, product: updated });
});

// 4. Delete product (Admin)
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = readDB();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const removed = db.products.splice(index, 1)[0];
  writeDB(db);
  res.json({ success: true, removed });
});

// 5. Place order (Customer)
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, deliveryAddress, location, deliveryInstructions, items } = req.body;

    if (!customerName || !String(customerName).trim()) {
      res.status(400).json({ success: false, message: 'Customer name is required' });
      return;
    }

    const cleanPhone = String(customerPhone || '').replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      res.status(400).json({ success: false, message: 'Please provide a valid 10-digit Indian mobile number' });
      return;
    }

    if (!deliveryAddress || !String(deliveryAddress).trim()) {
      res.status(400).json({ success: false, message: 'Delivery address is required' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart cannot be empty' });
      return;
    }

    const db = readDB();

    // Calculate subtotal from database prices to prevent client-side tampering
    let subtotal = 0;
    const validatedItems: OrderItem[] = [];

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

    // Delivery fee policy: Free over ₹150, else ₹20
    const deliveryFee = subtotal >= 150 ? 0 : 20;
    const totalAmount = subtotal + deliveryFee;

    const newOrder: Order = {
      id: generateOrderId(),
      customerName: String(customerName).trim(),
      customerPhone: cleanPhone,
      deliveryAddress: String(deliveryAddress).trim(),
      location: String(location || 'Local Area').trim(),
      deliveryInstructions: deliveryInstructions ? String(deliveryInstructions).trim() : undefined,
      items: validatedItems,
      subtotal,
      deliveryFee,
      totalAmount,
      status: 'New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'New',
          timestamp: new Date().toISOString(),
          note: 'Order successfully placed by customer on GS Setu'
        }
      ]
    };

    db.orders.unshift(newOrder);
    writeDB(db);

    // Trigger Gmail notification asynchronously or synchronously
    const emailResult = await sendOrderNotificationEmail(newOrder, db);

    res.status(201).json({
      success: true,
      order: newOrder,
      notification: emailResult
    });
  } catch (err: any) {
    console.error('Error in POST /api/orders:', err);
    res.status(500).json({ success: false, message: 'Failed to place order. Please try again.' });
  }
});

// 6. Get orders (Admin or Customer tracking)
app.get('/api/orders', (req: Request, res: Response) => {
  const db = readDB();
  const { status, phone, search } = req.query;

  let results = [...db.orders];

  if (phone) {
    const cleanPhone = String(phone).replace(/\D/g, '');
    results = results.filter((o) => o.customerPhone === cleanPhone);
  }

  if (status && status !== 'all') {
    results = results.filter((o) => o.status.toLowerCase() === String(status).toLowerCase());
  }

  if (search) {
    const term = String(search).toLowerCase();
    results = results.filter(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.customerPhone.includes(term) ||
        o.location.toLowerCase().includes(term)
    );
  }

  res.json({ success: true, orders: results });
});

// 7. Get single order details (for tracking)
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const db = readDB();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found with the specified ID' });
    return;
  }
  res.json({ success: true, order });
});

// 8. Update order status (Admin)
app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
  const db = readDB();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const { status, reason } = req.body;
  const validStatuses: OrderStatus[] = ['New', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid order status' });
    return;
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (reason) {
    order.statusReason = String(reason);
  }

  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    note: reason ? String(reason) : `Status updated to ${status} by GS Setu Admin`
  });

  writeDB(db);

  res.json({ success: true, order });
});

// 9. Partner Application (Seller, Delivery, Worker)
app.post('/api/partners/apply', (req: Request, res: Response) => {
  const { type, fullName, phone, villageTown, serviceCategory, experienceDescription } = req.body;

  if (!fullName || !phone || !type) {
    res.status(400).json({ success: false, message: 'Full name, phone, and type are required' });
    return;
  }

  const db = readDB();
  const application: PartnerApplication = {
    id: `app-${Date.now()}`,
    type,
    fullName: String(fullName).trim(),
    phone: String(phone).replace(/\D/g, ''),
    villageTown: String(villageTown || '').trim(),
    serviceCategory: String(serviceCategory || '').trim(),
    experienceDescription: String(experienceDescription || '').trim(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.applications.unshift(application);
  writeDB(db);

  res.status(201).json({ success: true, application });
});

// 10. Get applications (Admin)
app.get('/api/partners', (_req: Request, res: Response) => {
  const db = readDB();
  res.json({ success: true, applications: db.applications });
});

// 11. Email logs and diagnostics
app.get('/api/notifications', (_req: Request, res: Response) => {
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

// 12. Test email dispatch trigger (Admin)
app.post('/api/notifications/test-email', async (req: Request, res: Response) => {
  const businessEmail = req.body.email || getValidBusinessEmail();
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  const db = readDB();

  if (!gmailUser || !gmailPass) {
    const log: EmailLog = {
      id: `email-${Date.now()}`,
      orderId: 'TEST-PING',
      recipient: businessEmail,
      subject: `[GS Setu Test] System Notification Dispatcher`,
      status: 'Logged',
      timestamp: new Date().toISOString(),
      details: `Test dispatch logged. To connect live Gmail SMTP, set GMAIL_USER and GMAIL_APP_PASSWORD in environment.`
    };
    db.emailLogs.unshift(log);
    writeDB(db);

    res.json({
      success: false,
      isLogged: true,
      message: 'SMTP credentials (GMAIL_USER & GMAIL_APP_PASSWORD) not yet set in environment. Test email logged to internal server outbox.'
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    await transporter.sendMail({
      from: `"GS Setu System" <${gmailUser}>`,
      to: businessEmail,
      subject: `[GS Setu Verified] Live Email Test for Founder Sudhanshu Pandey`,
      text: `Hello Sudhanshu Pandey,\n\nThis is a live test notification from your GS Setu platform backend.\nEmail dispatcher is functioning properly.\n\nTime: ${new Date().toISOString()}`
    });

    const log: EmailLog = {
      id: `email-${Date.now()}`,
      orderId: 'TEST-LIVE',
      recipient: businessEmail,
      subject: `[GS Setu Verified] Live Email Test`,
      status: 'Sent',
      timestamp: new Date().toISOString(),
      details: `Live test email successfully delivered via Gmail SMTP to ${businessEmail}`
    };
    db.emailLogs.unshift(log);
    writeDB(db);

    res.json({ success: true, message: `Live test email successfully sent to ${businessEmail}!` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: `SMTP verification failed: ${err.message}` });
  }
});

// 13. System health & database readiness
app.get('/api/system/status', (_req: Request, res: Response) => {
  const db = readDB();
  res.json({
    status: 'online',
    appName: 'GS Setu',
    founder: 'Sudhanshu Pandey',
    database: {
      type: 'Persistent JSON Store (Atomic)',
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

// Setup Vite or Static Serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GS Setu full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
