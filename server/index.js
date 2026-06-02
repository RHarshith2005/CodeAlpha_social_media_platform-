import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { commentShape, openDatabase, postShape, userShape } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const reset = process.argv.includes("--reset-db");
const db = openDatabase({ reset });
const app = express();
const port = Number(process.env.PORT || 4000);

if (reset) {
  console.log("Database reset complete.");
  db.close();
  process.exit(0);
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ONLINE", database: "SQLite" });
});

app.get("/api/users", (_req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        u.*,
        (SELECT COUNT(*) FROM followers f WHERE f.following_id = u.id) AS follower_count,
        (SELECT COUNT(*) FROM followers f WHERE f.follower_id = u.id) AS following_count
      FROM users u
      ORDER BY u.id
    `
    )
    .all();

  res.json(rows.map(userShape));
});

app.post("/api/users", (req, res) => {
  const { username, displayName, role = "USER_NODE", bio = "", location = "", avatarUrl = "" } = req.body;
  if (!username || !displayName) {
    return res.status(400).json({ error: "username and displayName are required" });
  }

  const result = db
    .prepare(
      `
      INSERT INTO users (username, display_name, role, bio, location, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    )
    .run(username, displayName, role, bio, location, avatarUrl);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(userShape(user));
});

app.get("/api/users/:id", (req, res) => {
  const row = db
    .prepare(
      `
      SELECT
        u.*,
        (SELECT COUNT(*) FROM followers f WHERE f.following_id = u.id) AS follower_count,
        (SELECT COUNT(*) FROM followers f WHERE f.follower_id = u.id) AS following_count
      FROM users u
      WHERE u.id = ?
    `
    )
    .get(req.params.id);

  if (!row) return res.status(404).json({ error: "user not found" });
  res.json(userShape(row));
});

app.get("/api/posts", (req, res) => {
  const userFilter = req.query.userId ? "WHERE p.user_id = @userId" : "";
  const rows = db
    .prepare(
      `
      SELECT
        p.*,
        strftime('%H:%M:%S', p.created_at) AS timestamp_label,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
        u.username,
        u.display_name,
        u.role,
        u.bio,
        u.location,
        u.avatar_url
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ${userFilter}
      ORDER BY p.created_at DESC, p.id DESC
    `
    )
    .all({ userId: req.query.userId });

  res.json(rows.map(postShape));
});

app.post("/api/posts", (req, res) => {
  const { userId, title, body, imageUrl = "", kind = "image" } = req.body;
  if (!userId || !title || !body) {
    return res.status(400).json({ error: "userId, title and body are required" });
  }

  const result = db
    .prepare(
      `
      INSERT INTO posts (user_id, title, body, image_url, kind)
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .run(userId, title, body, imageUrl, kind);

  const post = db
    .prepare(
      `
      SELECT
        p.*,
        strftime('%H:%M:%S', p.created_at) AS timestamp_label,
        0 AS comment_count,
        u.username,
        u.display_name,
        u.role,
        u.bio,
        u.location,
        u.avatar_url
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
    `
    )
    .get(result.lastInsertRowid);

  res.status(201).json(postShape(post));
});

app.get("/api/posts/:id", (req, res) => {
  const row = db
    .prepare(
      `
      SELECT
        p.*,
        strftime('%H:%M:%S', p.created_at) AS timestamp_label,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
        u.username,
        u.display_name,
        u.role,
        u.bio,
        u.location,
        u.avatar_url
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
    `
    )
    .get(req.params.id);

  if (!row) return res.status(404).json({ error: "post not found" });
  res.json(postShape(row));
});

app.get("/api/posts/:id/comments", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        c.*,
        strftime('%H:%M:%S', c.created_at) AS timestamp_label,
        u.username,
        u.display_name,
        u.avatar_url
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at, c.id
    `
    )
    .all(req.params.id);

  res.json(rows.map(commentShape));
});

app.post("/api/posts/:id/comments", (req, res) => {
  const { userId, body } = req.body;
  if (!userId || !body) {
    return res.status(400).json({ error: "userId and body are required" });
  }

  const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "post not found" });

  const result = db
    .prepare(
      `
      INSERT INTO comments (post_id, user_id, body)
      VALUES (?, ?, ?)
    `
    )
    .run(req.params.id, userId, body);

  const row = db
    .prepare(
      `
      SELECT
        c.*,
        strftime('%H:%M:%S', c.created_at) AS timestamp_label,
        u.username,
        u.display_name,
        u.avatar_url
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
    `
    )
    .get(result.lastInsertRowid);

  res.status(201).json(commentShape(row));
});

app.get("/api/users/:id/followers", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT u.*
      FROM followers f
      JOIN users u ON u.id = f.follower_id
      WHERE f.following_id = ?
      ORDER BY f.created_at DESC
    `
    )
    .all(req.params.id);

  res.json(rows.map(userShape));
});

app.get("/api/users/:id/following", (req, res) => {
  const rows = db
    .prepare(
      `
      SELECT u.*
      FROM followers f
      JOIN users u ON u.id = f.following_id
      WHERE f.follower_id = ?
      ORDER BY f.created_at DESC
    `
    )
    .all(req.params.id);

  res.json(rows.map(userShape));
});

app.post("/api/followers", (req, res) => {
  const { followerId, followingId } = req.body;
  if (!followerId || !followingId) {
    return res.status(400).json({ error: "followerId and followingId are required" });
  }

  try {
    db.prepare("INSERT OR IGNORE INTO followers (follower_id, following_id) VALUES (?, ?)").run(followerId, followingId);
    res.status(201).json({ followerId, followingId, following: true });
  } catch {
    res.status(400).json({ error: "invalid follower relationship" });
  }
});

app.delete("/api/followers", (req, res) => {
  const { followerId, followingId } = req.body;
  if (!followerId || !followingId) {
    return res.status(400).json({ error: "followerId and followingId are required" });
  }

  db.prepare("DELETE FROM followers WHERE follower_id = ? AND following_id = ?").run(followerId, followingId);
  res.json({ followerId, followingId, following: false });
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`NEO_SOCIAL API running on http://127.0.0.1:${port}`);
});
