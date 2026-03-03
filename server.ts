import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import db from "./src/lib/db.ts";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import { MatchingService } from "./src/services/MatchingService.ts";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  app.use(express.json());

  // --- MICROSERVICE SIMULATION: AUTH ---
  app.post("/api/auth/login", (req, res) => {
    // Production: JWT issuance, MFA check
    res.json({ token: "simulated-jwt-token", user: { id: "c1", role: "client" } });
  });

  // --- MICROSERVICE SIMULATION: USER ---
  app.get("/api/users/taskers", (req, res) => {
    const taskers = db.prepare("SELECT * FROM users WHERE role = 'tasker'").all();
    res.json(taskers.map((t: any) => ({ ...t, skills: JSON.parse(t.skills || '[]') })));
  });

  app.get("/api/users/:userId", (req, res) => {
    const { userId } = req.params;
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
    if (user) {
      user.skills = JSON.parse(user.skills || '[]');
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.patch("/api/users/:userId", (req, res) => {
    const { userId } = req.params;
    const { name, bio, hourly_rate, skills } = req.body;
    db.prepare("UPDATE users SET name = ?, bio = ?, hourly_rate = ?, skills = ? WHERE id = ?")
      .run(name, bio, hourly_rate, JSON.stringify(skills), userId);
    res.json({ success: true });
  });

  // --- MICROSERVICE SIMULATION: TASK ---
  app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const { client_id, title, description, category, price_type, price, location, is_recurring, recurrence_pattern } = req.body;
    const id = Math.random().toString(36).substring(2, 11);
    
    // AI Dynamic Surge Pricing
    const pricing = await MatchingService.suggestPricing(description, category);
    const finalPrice = Math.round(price * pricing.surgeMultiplier);

    db.prepare('INSERT INTO tasks (id, client_id, title, description, category, price_type, price, location, is_recurring, recurrence_pattern, surge_multiplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, client_id, title, description, category, price_type, finalPrice, location, is_recurring ? 1 : 0, recurrence_pattern, pricing.surgeMultiplier);
    
    res.json({ id, status: "open", price: finalPrice, surgeMultiplier: pricing.surgeMultiplier });
  });

  app.patch("/api/tasks/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(status, id);
    
    // If completed, notify client
    if (status === 'completed') {
      const task = db.prepare("SELECT client_id, title FROM tasks WHERE id = ?").get(id) as any;
      db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
        .run(task.client_id, "Task Completed", `The tasker has marked "${task.title}" as completed. Please review and approve.`, 'success');
    }
    
    res.json({ success: true });
  });

  app.post("/api/tasks/:id/approve", (req, res) => {
    const { id } = req.params;
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as any;
    const booking = db.prepare("SELECT * FROM bookings WHERE task_id = ? AND status = 'confirmed'").get(id) as any;
    
    if (!booking) return res.status(400).json({ error: "No active booking found" });

    // 1. Update tasker stats
    db.prepare("UPDATE users SET completed_tasks = completed_tasks + 1, balance = balance + ? WHERE id = ?")
      .run(task.price, booking.tasker_id);

    // 2. Create transaction for tasker
    const transId = Math.random().toString(36).substring(2, 11);
    db.prepare("INSERT INTO transactions (id, user_id, amount, type, description) VALUES (?, ?, ?, ?, ?)")
      .run(transId, booking.tasker_id, task.price, 'earnings', `Earnings from task: ${task.title}`);

    // 3. Update booking status
    db.prepare("UPDATE bookings SET status = 'completed' WHERE id = ?").run(booking.id);
    
    // 4. Notify tasker
    db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
      .run(booking.tasker_id, "Payment Received", `You have received payment for "${task.title}".`, 'success');

    res.json({ success: true });
  });

  // --- MICROSERVICE SIMULATION: BOOKING ---
  app.get("/api/bookings/:userId", (req, res) => {
    const { userId } = req.params;
    const user = db.prepare("SELECT role FROM users WHERE id = ?").get(userId) as any;
    
    if (!user) return res.status(404).json({ error: "User not found" });

    let bookings;
    if (user.role === 'client') {
      bookings = db.prepare(`
        SELECT b.*, t.title as task_title, u.name as other_party_name, u.avatar as other_party_avatar
        FROM bookings b
        JOIN tasks t ON b.task_id = t.id
        JOIN users u ON b.tasker_id = u.id
        WHERE b.client_id = ?
      `).all(userId);
    } else {
      bookings = db.prepare(`
        SELECT b.*, t.title as task_title, u.name as other_party_name, u.avatar as other_party_avatar
        FROM bookings b
        JOIN tasks t ON b.task_id = t.id
        JOIN users u ON b.client_id = u.id
        WHERE b.tasker_id = ?
      `).all(userId);
    }
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { task_id, tasker_id, client_id, scheduled_at } = req.body;
    const id = Math.random().toString(36).substring(2, 11);
    db.prepare('INSERT INTO bookings (id, task_id, tasker_id, client_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, task_id, tasker_id, client_id, scheduled_at, 'pending');
    res.json({ id, status: "pending" });
  });

  app.patch("/api/bookings/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  // --- MICROSERVICE SIMULATION: BIDS ---
  app.get("/api/tasks/:taskId/bids", (req, res) => {
    const { taskId } = req.params;
    const bids = db.prepare(`
      SELECT b.*, u.name as tasker_name, u.avatar as tasker_avatar, u.rating as tasker_rating
      FROM bids b
      JOIN users u ON b.tasker_id = u.id
      WHERE b.task_id = ?
    `).all(taskId);
    res.json(bids);
  });

  app.post("/api/bids", (req, res) => {
    const { task_id, tasker_id, amount, message } = req.body;
    const id = Math.random().toString(36).substring(2, 11);
    db.prepare('INSERT INTO bids (id, task_id, tasker_id, amount, message) VALUES (?, ?, ?, ?, ?)')
      .run(id, task_id, tasker_id, amount, message);
    
    // Notify client
    const task = db.prepare("SELECT client_id, title FROM tasks WHERE id = ?").get(task_id) as any;
    db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
      .run(task.client_id, "New Bid Received", `A tasker has bid on your task: ${task.title}`, 'info');

    res.json({ id, status: "pending" });
  });

  app.post("/api/bids/:bidId/accept", (req, res) => {
    const { bidId } = req.params;
    const bid = db.prepare("SELECT * FROM bids WHERE id = ?").get(bidId) as any;
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(bid.task_id) as any;

    // 1. Update bid status
    db.prepare("UPDATE bids SET status = 'accepted' WHERE id = ?").run(bidId);
    db.prepare("UPDATE bids SET status = 'rejected' WHERE id != ? AND task_id = ?").run(bidId, bid.task_id);

    // 2. Update task status
    db.prepare("UPDATE tasks SET status = 'assigned' WHERE id = ?").run(bid.task_id);

    // 3. Create booking
    const bookingId = Math.random().toString(36).substring(2, 11);
    db.prepare('INSERT INTO bookings (id, task_id, tasker_id, client_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(bookingId, bid.task_id, bid.tasker_id, task.client_id, new Date(Date.now() + 86400000).toISOString(), 'confirmed');

    // 4. Notify tasker
    db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)')
      .run(bid.tasker_id, "Bid Accepted!", `Your bid for "${task.title}" has been accepted!`, 'success');

    res.json({ success: true, bookingId });
  });

  // --- MICROSERVICE SIMULATION: REVIEWS ---
  app.get("/api/users/:userId/reviews", (req, res) => {
    const { userId } = req.params;
    const reviews = db.prepare(`
      SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewee_id = ?
      ORDER BY r.created_at DESC
    `).all(userId);
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { task_id, reviewer_id, reviewee_id, rating, comment } = req.body;
    const id = Math.random().toString(36).substring(2, 11);
    db.prepare('INSERT INTO reviews (id, task_id, reviewer_id, reviewee_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, task_id, reviewer_id, reviewee_id, rating, comment);
    
    // Update reviewee rating
    const avgRating = db.prepare("SELECT AVG(rating) as avg FROM reviews WHERE reviewee_id = ?").get(reviewee_id) as any;
    db.prepare("UPDATE users SET rating = ? WHERE id = ?").run(avgRating.avg, reviewee_id);

    res.json({ id });
  });

  // --- MICROSERVICE SIMULATION: WALLET ---
  app.get("/api/users/:userId/wallet", (req, res) => {
    const { userId } = req.params;
    const user = db.prepare("SELECT balance FROM users WHERE id = ?").get(userId) as any;
    const transactions = db.prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    res.json({ balance: user.balance, transactions });
  });

  app.post("/api/wallet/withdraw", (req, res) => {
    const { userId, amount } = req.body;
    const user = db.prepare("SELECT balance FROM users WHERE id = ?").get(userId) as any;
    
    if (user.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

    db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").run(amount, userId);
    
    const transId = Math.random().toString(36).substring(2, 11);
    db.prepare("INSERT INTO transactions (id, user_id, amount, type, description) VALUES (?, ?, ?, ?, ?)")
      .run(transId, userId, -amount, 'withdrawal', 'Withdrawal to bank account');

    res.json({ success: true });
  });

  app.patch("/api/notifications/:id/read", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // --- MICROSERVICE SIMULATION: MATCHING (AI POWERED) ---
  app.get("/api/tasks/:taskId/matches", async (req, res) => {
    const { taskId } = req.params;
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as any;
    const taskers = db.prepare("SELECT * FROM users WHERE role = 'tasker'").all();
    
    const matches = await MatchingService.calculateMatch(task.description, taskers);
    res.json(matches);
  });

  // --- MICROSERVICE SIMULATION: AI INTELLIGENCE ---
  app.post("/api/ai/analyze", async (req, res) => {
    const { text } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze: ${text}. Return JSON with category, sentiment, and risk_score (0-1).`,
      config: { responseMimeType: "application/json" }
    });
    res.json(JSON.parse(response.text || "{}"));
  });

  // --- ENTERPRISE & ADVANCED FEATURES ---
  app.post("/api/tasks/:id/instant-match", async (req, res) => {
    const { id } = req.params;
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as any;
    const taskers = db.prepare("SELECT * FROM users WHERE role = 'tasker'").all();
    
    const matches = await MatchingService.calculateMatch(task.description, taskers);
    if (matches.length > 0) {
      const bestMatch = matches[0];
      // Automatically accept the best match
      const bidId = Math.random().toString(36).substring(2, 11);
      db.prepare('INSERT INTO bids (id, task_id, tasker_id, amount, message, status) VALUES (?, ?, ?, ?, ?, ?)')
        .run(bidId, id, bestMatch.taskerId, task.price, "AI Instant Match Assignment", 'accepted');
      
      // Create booking
      const bookingId = Math.random().toString(36).substring(2, 11);
      db.prepare('INSERT INTO bookings (id, task_id, tasker_id, client_id, scheduled_at, status) VALUES (?, ?, ?, ?, ?, ?)')
        .run(bookingId, id, bestMatch.taskerId, task.client_id, new Date(Date.now() + 86400000).toISOString(), 'confirmed');
      
      db.prepare("UPDATE tasks SET status = 'assigned' WHERE id = ?").run(id);

      res.json({ success: true, bookingId, taskerId: bestMatch.taskerId });
    } else {
      res.status(404).json({ error: "No suitable taskers found for instant match" });
    }
  });

  app.get("/api/users/:userId/suggestions", async (req, res) => {
    const { userId } = req.params;
    const history = db.prepare(`
      SELECT t.category 
      FROM tasks t 
      WHERE t.client_id = ? 
      ORDER BY t.created_at DESC 
      LIMIT 10
    `).all(userId);
    
    const suggestions = await MatchingService.predictNeeds(history);
    res.json(suggestions);
  });

  app.post("/api/users/:userId/subscription", (req, res) => {
    const { userId } = req.params;
    const { plan } = req.body; // 'basic', 'premium', 'enterprise'
    db.prepare("UPDATE users SET subscription_plan = ? WHERE id = ?").run(plan, userId);
    res.json({ success: true, plan });
  });

  app.patch("/api/tasks/:id/insurance", (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'active', 'claimed'
    db.prepare("UPDATE tasks SET insurance_status = ? WHERE id = ?").run(status, id);
    res.json({ success: true, insurance_status: status });
  });

  // Enterprise API Middleware
  const enterpriseAuth = (req: any, res: any, next: any) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ error: "API Key required" });
    const user = db.prepare("SELECT * FROM users WHERE api_key = ?").get(apiKey);
    if (!user) return res.status(403).json({ error: "Invalid API Key" });
    req.user = user;
    next();
  };

  app.get("/api/v1/tasks", enterpriseAuth, (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
  });

  // --- MICROSERVICE SIMULATION: MESSAGES ---
  app.get("/api/messages/:bookingId", (req, res) => {
    const { bookingId } = req.params;
    const messages = db.prepare("SELECT * FROM messages WHERE booking_id = ? ORDER BY created_at ASC").all(bookingId);
    res.json(messages);
  });

  app.post("/api/messages", (req, res) => {
    const { booking_id, sender_id, content } = req.body;
    const result = db.prepare("INSERT INTO messages (booking_id, sender_id, content) VALUES (?, ?, ?)")
      .run(booking_id, sender_id, content);
    res.json({ id: result.lastInsertRowid, success: true });
  });

  // --- REAL-TIME MESSAGING (WEBSOCKETS) ---
  io.on("connection", (socket) => {
    socket.on("join_room", (roomId) => socket.join(roomId));
    socket.on("message", (data) => {
      const { roomId, senderId, content } = data;
      // Save to DB
      db.prepare("INSERT INTO messages (booking_id, sender_id, content) VALUES (?, ?, ?)")
        .run(roomId, senderId, content);
      
      // Broadcast to room
      io.to(roomId).emit("message", {
        id: Math.random().toString(36).substring(2, 11),
        sender_id: senderId,
        content,
        created_at: new Date().toISOString()
      });
    });
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => res.sendFile(path.resolve("dist/index.html")));
  }

  httpServer.listen(3000, "0.0.0.0", () => {
    console.log("TaskFlow Master Build running on port 3000");
  });
}

startServer();
