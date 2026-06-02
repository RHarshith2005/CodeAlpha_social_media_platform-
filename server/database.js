import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultPath = path.join(__dirname, "data", "social.db");

export function openDatabase({ reset = false } = {}) {
  const databasePath = path.resolve(process.env.DATABASE_PATH || defaultPath);
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });

  if (reset && fs.existsSync(databasePath)) {
    fs.unlinkSync(databasePath);
  }

  const db = new Database(databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seed(db);
  return db;
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER_NODE',
      bio TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      avatar_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      kind TEXT NOT NULL DEFAULT 'image',
      like_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS followers (
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (follower_id, following_id),
      FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
      CHECK (follower_id <> following_id)
    );
  `);
}

function seed(db) {
  const count = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;
  if (count > 0) return;

  const insertUser = db.prepare(`
    INSERT INTO users (username, display_name, role, bio, location, avatar_url)
    VALUES (@username, @displayName, @role, @bio, @location, @avatarUrl)
  `);

  const insertPost = db.prepare(`
    INSERT INTO posts (user_id, title, body, image_url, kind, like_count, created_at)
    VALUES (@userId, @title, @body, @imageUrl, @kind, @likeCount, @createdAt)
  `);

  const insertComment = db.prepare(`
    INSERT INTO comments (post_id, user_id, body, created_at)
    VALUES (@postId, @userId, @body, @createdAt)
  `);

  const insertFollower = db.prepare(`
    INSERT INTO followers (follower_id, following_id)
    VALUES (?, ?)
  `);

  const users = [
    {
      username: "ALEX_CHEN",
      displayName: "Alex Chen",
      role: "DIGITAL_ARCHIVIST",
      bio: "Documenting the collision of physical space and digital entropy. Obsessed with high-contrast architecture, obsolete hardware interfaces, and the stark beauty of unpolished data.",
      location: "TOKYO // NEO-SF",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCp0RXWV3pkK_1xGcuViBRwIPeH9cBbPgs07B3p24jUrqe15_GIkOHMMV5_4-hilWFvAzfgubzyBS_fWgvycsIgMLjlpQTkfZzIbITkjNLkuLFtRY-qknmLcHUU2wUSjAPu22noR_ZZZNIwc3tGKSulQCbKMkIQ645OmRmNH6M6YGTJTvyN9epnNGhWMi9BMUYNWU4UQUQlcHSwvSXx-MHaTqpg4CsOou5F5Kv5X0pXTxIvj81bFFNxF30oofxfLEM8TmHGOl2dYNE"
    },
    {
      username: "CYBER_JUNKIE",
      displayName: "Cyber Junkie",
      role: "DATA_RUNNER",
      bio: "Analyzing structural integrity of the latest data-stream and cataloging corrupted render artifacts.",
      location: "SECTOR 7G",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAKZkbc9aD2P9sctmxrCZOYHAFHNdS6wOaYn8k6VlTVTuO7_wGpb8r5tYXsmlMe_xrOkujbROtRALnBMOtwBHIwMpblEvAujXON24aktCkV5KEeaVpnoJsCj9qGIPUUtPKO4fxHWUg734HZqHX1LAtRnKYwMOwSftTdFpknCbXNtfQUSAnrHMtAmSsgIxa_zqwarsO7UFekhLLN0TtuvIlBP6mpe93A-ivG4-BWpgcNjEKScyfmqNfwJ8pXPwjUP18VAXGSH4R3070"
    },
    {
      username: "NET_RUNNER",
      displayName: "Net Runner",
      role: "NODE_OPERATOR",
      bio: "Rebooting unstable routes and watching for packet ghosts in dead channels.",
      location: "SUBNET_04",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop"
    }
  ];

  const transaction = db.transaction(() => {
    users.forEach((user) => insertUser.run(user));

    insertPost.run({
      userId: 2,
      title: "STRUCTURAL_DECAY.RAW",
      body: "INITIALIZING SEQUENCE. Rendering test environment alpha_0.9. Integrity checks complete.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAgO4nfbUGPHUlurGasaMjG5EVYBSjkl1iSc38otSi9DFZdDq8ER50F0L0bxDXCqowAKSuoFA6afXbqWpLrFwDgfA4tPKXY1LMkXERxG6WsYdfXspYnfqSWK_7MRQT3QdtkSUyEvUN4zwlEsat70mkoUhr8oK--YXxG62D69L0CvFwpB3Ed_-yWyDnW3MWhGd2kWQwrX1N1OJY_-OEwfaXh7XQEed_uHLWE5OkBngnL8nqrGlIPXiWA75Q2bPcTLTR_sLz8HFxtNMY",
      kind: "image",
      likeCount: 404,
      createdAt: "2026-06-02 12:04:01"
    });

    insertPost.run({
      userId: 1,
      title: "SYSTEM_BROADCAST",
      body: "NETWORK STABILITY COMPROMISED. RE-ROUTING TO SECONDARY NODES. EXPECT LATENCY FLUCTUATIONS.",
      imageUrl: "",
      kind: "broadcast",
      likeCount: 128,
      createdAt: "2026-06-02 09:12:44"
    });

    insertPost.run({
      userId: 1,
      title: "NODE_X9.LOG",
      body: "Analyzing structural integrity of the latest data-stream. Everything seems to be compiling correctly, but strange artifacts are visible in sector 7G.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBMXr1EbS1u7tyknGBeja8NrQgqV8yW2DJgJ1x5KV1MkLYYzbpfuCXwbmrkVMsr92aIyKbq8ImgUIUQGUmU1x95g0IXMZNQMxhO4elZaygEWqlF9h4yECRfIa1nmF_zH3yVbAw-0kB9OotMSpLoKvE85Iolpqk-1oL48R8Q4jSMaSuClgy9rTX7y23jFEJFJIa3P3Yqo9P-Y4xxExoVS-cH05js6YSWCc0btY-HCB-2MCyf00NPWke9Wx4ylKj2ZryZAa5aA3u1iXs",
      kind: "image",
      likeCount: 211,
      createdAt: "2026-06-02 14:02:59"
    });

    insertComment.run({
      postId: 1,
      userId: 3,
      body: "Confirmed. Sector 7G always throws null pointers after the last patch.",
      createdAt: "2026-06-02 13:00:00"
    });

    insertComment.run({
      postId: 1,
      userId: 1,
      body: "WARNING: UNAUTHORIZED ACCESS DETECTED IN RENDER PROTOCOL.",
      createdAt: "2026-06-02 13:20:00"
    });

    insertComment.run({
      postId: 3,
      userId: 2,
      body: "Look closely at the render output below. The signal breaks at the lower edge.",
      createdAt: "2026-06-02 14:12:00"
    });

    insertFollower.run(1, 2);
    insertFollower.run(3, 1);
    insertFollower.run(2, 1);
  });

  transaction();
}

export function userShape(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
    bio: row.bio,
    location: row.location,
    avatarUrl: row.avatar_url,
    followerCount: row.follower_count || 0,
    followingCount: row.following_count || 0,
    createdAt: row.created_at
  };
}

export function postShape(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    imageUrl: row.image_url,
    kind: row.kind,
    likeCount: row.like_count,
    createdAt: row.created_at,
    timestampLabel: row.timestamp_label,
    commentCount: row.comment_count || 0,
    user: {
      id: row.user_id,
      username: row.username,
      displayName: row.display_name,
      role: row.role,
      bio: row.bio,
      location: row.location,
      avatarUrl: row.avatar_url
    }
  };
}

export function commentShape(row) {
  return {
    id: row.id,
    postId: row.post_id,
    userId: row.user_id,
    body: row.body,
    createdAt: row.created_at,
    timestampLabel: row.timestamp_label,
    user: {
      id: row.user_id,
      username: row.username,
      displayName: row.display_name,
      avatarUrl: row.avatar_url
    }
  };
}
