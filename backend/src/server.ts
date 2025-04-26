import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { LessonProgress, User, Lesson } from "./models";
import Razorpay from "razorpay";
import cors from "cors";
import http from 'http';
import { WebSocketServer , WebSocket } from 'ws';
import { FluvioService } from'./config/fluvio';
import { parse } from 'url';
import { Stock } from './models/Stock';

dotenv.config();

if (!process.env.Razorpay_Key || !process.env.Razorpay_Secret) {
  throw new Error("Razorpay Key and Secret are required");
}

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key!,
  key_secret: process.env.Razorpay_Secret!
});

//websocket-client-meta
interface ClientMeta {
  socket: WebSocket;
  type: 'news' | 'stocks';
}


const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set<ClientMeta>();

// Helper to add timeout to promises
function withTimeout<T>(promise: Promise<T>, ms: number, taskName: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`❌ ${taskName} timed out after ${ms}ms`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timeout);
        reject(err);
      });
  });
}

//configureable-variables
const MAX_TASK_TIME = Number(process.env.TASK_TIMEOUT) || 15000;
const MAX_STOCK_HISTORY = Number(process.env.STOCK_HISTORY_FETCH_LIMIT) || 60;
const CYCLE_INTERVAL = Number(process.env.CYCLE_INTERVAL) || 30000;
const STOCK_POLL_TO_DB = 600000;
const MAX_CYCLE_SKIPS = Number(process.env.MAX_CYCLE_SKIPS) || 2;

app.use(express.json());
const allowedOrigins = [
  "https://edufinance-bytegg.netlify.app",
  "http://localhost:5173", // 
  "https://another-domain.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));


app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user";
import courseRoutes from "./routes/course";
import adminRoutes from "./routes/admin";
import qroq from "./controllers/qroq"
import aigroqRoutes from "./routes/aigroq";
// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api",aigroqRoutes)

// REST API for static stock data
app.get('/api/stocks', async (_req, res) => {
  try {
    const stocks = await Stock.find().sort({ timestamp: -1 }).limit(MAX_STOCK_HISTORY);
    res.json(stocks);
  } catch (err) {
    console.error('Error fetching stocks:', err);
    res.status(500).json({ error: 'Failed to fetch stocks from DB' });
  }
});

app.post("/api/test/progress", async (req:any, res:any) => {
  try {
    
    const user = await User.create({
      name: "Test User",
      email: `testuser${Date.now()}@mail.com`,
      passwordHash: "hashedpassword",
    });


    const lesson = await Lesson.create({
      title: "Intro to Money",
      slug: `money-${Date.now()}`,
      content: { text: "What is money?" },
      level: "Beginner",
      topic: "Finance Basics",
    });

    const progress = await LessonProgress.create({
      user_id: user._id,
      lesson_id: lesson._id,
      completed: false,
      score: 0,
      attempts: 1,
    });

    res.status(201).json({
      message: "Test progress created successfully",
      user,
      lesson,
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/", (req:any, res:any) => {
  res.send("EduFinance API up & running 🪙");
});

// WebSocket connection handling for live data
wss.on('connection', (ws:any, req:any) => {
  const parsedUrl = parse(req.url || '', true);
  const type = parsedUrl.query.type;

  if (type !== 'news' && type !== 'stocks') {
    console.log('❌ Unknown type, closing socket');
    ws.close();
    return;
  }

  const clientMeta: ClientMeta = { socket: ws, type: type as 'news' | 'stocks'};
  clients.add(clientMeta);

  // ✅ Reset skip counter and optionally trigger cycle
  console.log(`🆕 New WebSocket (${type}) connection - BACKEND. Resetting skip counter.`);
  skipCounter = 0;

  if (!isProcessing) {
    console.log("✅ Triggering immediate cycle due to new client connection...");
    runCycle(); // Trigger fetch immediately if not already running
  }

  ws.on('close', () => {
    clients.delete(clientMeta);
    console.log(`🔌 WebSocket (${type}) closed - BACKEND`);
  });
});

let isProcessing = false;
let skipCounter = 0;

// interval logic as a function
async function runCycle() {
  if (isProcessing) {
    console.log("⏰ Skipping this cycle as the previous cycle is still running...");
    return;
  }

  // 🧹 Clean up closed or broken sockets
  for (const client of Array.from(clients)) {
    if (
      client.socket.readyState === WebSocket.CLOSING ||
      client.socket.readyState === WebSocket.CLOSED
    ) {
      console.log(`🧹 Cleaning up stale socket (${client.type})`);
      clients.delete(client);
    }
  }

  isProcessing = true;

  const hasNewsClients = Array.from(clients).some((client) => client.type === 'news');
  const hasStockClients = Array.from(clients).some((client) => client.type === 'stocks');


  console.log(`⏰ Checking clients at ${new Date().toISOString()}: News=${hasNewsClients}, Stocks=${hasStockClients}`);

  if (!hasNewsClients && !hasStockClients) {
    console.log('🚫 No connected clients. Skipping fetch & produce.');
    skipCounter++;

    if (skipCounter > MAX_CYCLE_SKIPS) {
      console.log("❗ More than 2 cycle skips. Restarting the cycle...");
      isProcessing = false;
      skipCounter = 0;
      return;
    }

    isProcessing = false;
    return;
  }

  skipCounter = 0;

  if (hasStockClients) {
    console.log('📈 Starting to fetch and produce stocks...');
    try {
      await withTimeout(FluvioService.fetchAndProduceStocks(), MAX_TASK_TIME, "fetchAndProduceStocks");
      const stocks = await withTimeout(FluvioService.consumeStocks(), MAX_TASK_TIME, "consumeStocks");
  
      for (const client of clients) {
        if (client.type === 'stocks' && client.socket.readyState === WebSocket.OPEN) {
          console.log('📈 Sending stocks to client');
          client.socket.send(JSON.stringify(stocks));
        }
      }
    } catch (err) {
      const error = err as Error;
      console.error(`⚠️ Error during stock cycle:`, error.message);
    }
  }
  
  if (hasNewsClients) {
    console.log('📰 Starting to fetch and produce news...');
    try {
      await withTimeout(FluvioService.fetchAndProduceNews(), MAX_TASK_TIME, "fetchAndProduceNews");
      const news = await withTimeout(FluvioService.consumeNews(), MAX_TASK_TIME, "consumeNews");
  
      for (const client of clients) {
        if (client.type === 'news' && client.socket.readyState === WebSocket.OPEN) {
          console.log('📰 Sending news to client');
          client.socket.send(JSON.stringify(news));
        }
      }
    } catch (err) {
      const error = err as Error;
      console.error(`⚠️ Error during news cycle:`, error.message);
    }
  }

  isProcessing = false;
}

// 🔁 Run the cycle every 30 seconds
setInterval(runCycle, CYCLE_INTERVAL);
FluvioService.startStockPolling(STOCK_POLL_TO_DB);


// Start the server
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
});
