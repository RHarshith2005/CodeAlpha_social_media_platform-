import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { api } from "./services/api.js";
import { fallbackPosts, fallbackUsers } from "./services/fallbackData.js";

const tabs = [
  { id: "feed", label: "FEED", icon: "grid_view" },
  { id: "discover", label: "SCAN", icon: "qr_code_scanner" },
  { id: "messages", label: "MAIL", icon: "alternate_email" },
  { id: "profile", label: "USER", icon: "account_circle" }
];

function Icon({ name, filled = false }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
    >
      {name}
    </span>
  );
}

function TopBar({ onSearch }) {
  return (
    <header className="top-bar">
      <button className="icon-btn" aria-label="Terminal">
        <Icon name="terminal" />
      </button>
      <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        NEO_SOCIAL
      </button>
      <button className="icon-btn" aria-label="Search" onClick={onSearch}>
        <Icon name="search" />
      </button>
    </header>
  );
}

function MobileNav({ active, onChange }) {
  return (
    <nav className="mobile-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={active === tab.id ? "nav-item active" : "nav-item"}
          onClick={() => onChange(tab.id)}
        >
          <Icon name={tab.icon} filled={active === tab.id} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

function DesktopRail({ active, onChange }) {
  return (
    <aside className="desktop-rail">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={active === tab.id ? "rail-item active" : "rail-item"}
          onClick={() => onChange(tab.id)}
          aria-label={tab.label}
        >
          <Icon name={tab.icon} filled={active === tab.id} />
          {active === tab.id && <span>{tab.label}</span>}
        </button>
      ))}
    </aside>
  );
}

function Window({ title, children, tone = "dark", className = "" }) {
  return (
    <section className={`neo-window ${className}`}>
      <div className={`title-bar ${tone}`}>
        <span>{title}</span>
        <div className="window-controls">
          <span />
          <span />
          <span />
        </div>
      </div>
      {children}
    </section>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="stat-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PostCard({ post, onOpen }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="post-card">
      <div className={post.kind === "broadcast" ? "post-title lime" : "post-title"}>
        <span>{post.user?.username || "SYS_USER"}</span>
        <time>{post.timestampLabel || "NOW"}</time>
      </div>
      <button className="post-content" onClick={() => onOpen(post.id)}>
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} />
        ) : (
          <p className="broadcast-copy">{post.body}</p>
        )}
      </button>
      {post.imageUrl && <p className="caption">{post.body}</p>}
      <div className="action-row">
        <div>
          <button className={liked ? "square-action active" : "square-action"} onClick={() => setLiked(!liked)}>
            <Icon name="favorite" filled={liked} />
          </button>
          <button className="square-action" onClick={() => onOpen(post.id)}>
            <Icon name="chat_bubble" />
          </button>
        </div>
        <button className="text-action">SHARE</button>
      </div>
    </article>
  );
}

function Feed({ posts, onOpenPost }) {
  return (
    <main className="screen feed-screen">
      <div className="section-heading">
        <h1>LIVE_SIGNAL</h1>
        <span>{posts.length.toString().padStart(2, "0")} NODES</span>
      </div>
      <div className="feed-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onOpen={onOpenPost} />
        ))}
      </div>
    </main>
  );
}

function Discover() {
  const categories = [
    {
      name: "SIGHTS",
      icon: "visibility",
      image:
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name: "SOUNDS",
      icon: "graphic_eq",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name: "VIBES",
      icon: "storm",
      image:
        "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  return (
    <main className="screen discover-screen">
      <section className="search-block">
        <h1>DISCOVER THE VOID</h1>
        <div className="search-shell">
          <Icon name="search" />
          <input placeholder="QUERY://..." />
          <button>EXECUTE</button>
        </div>
        <div className="chip-row">
          <button>#GLITCH_ART</button>
          <button>#LOFI_BEATS</button>
          <button>#CYBER_PUNK</button>
        </div>
      </section>
      <section className="category-grid">
        {categories.map((category) => (
          <button className="category-tile" key={category.name}>
            <img src={category.image} alt={category.name} />
            <span className="tile-dither" />
            <strong>{category.name}</strong>
            <Icon name={category.icon} />
          </button>
        ))}
      </section>
      <Window title="FEATURED_NODE.exe" className="featured-window">
        <div className="featured-canvas">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
            alt="The void state"
          />
          <div className="featured-panel">
            <h2>THE VOID STATE</h2>
            <p>Enter the sector of pure signal. Disconnect from the noise.</p>
            <button className="primary-action">
              INITIATE SEQUENCE <Icon name="arrow_forward" />
            </button>
          </div>
        </div>
      </Window>
    </main>
  );
}

function Profile({ user, posts, onFollow }) {
  const archive = posts.slice(0, 5);

  return (
    <main className="screen profile-screen">
      <section className="profile-grid">
        <Window title="SYS.AVATAR.OBJ" className="avatar-window">
          <img src={user.avatarUrl} alt={user.displayName} />
        </Window>
        <div className="profile-info">
          <section className="profile-name neo-panel">
            <h1>{user.displayName?.replace(" ", "_").toUpperCase()}</h1>
            <span>ROLE: {user.role || "DIGITAL_ARCHIVIST"} // STATUS: ONLINE</span>
            <div className="profile-actions">
              <button className="primary-action" onClick={onFollow}>
                <Icon name="add" /> FOLLOW_USER
              </button>
              <button className="secondary-action">
                <Icon name="mail" /> PING
              </button>
            </div>
          </section>
          <div className="stat-grid">
            <StatBox label="CURATIONS" value={posts.length * 71} />
            <StatBox label="VISIONARIES" value={user.followerCount || 0} />
          </div>
          <Window title="~bash/bio.sh" className="terminal-window">
            <p>&gt; executing query: SELECT bio FROM users WHERE id = '{user.username}'...</p>
            <p>&gt; result found.</p>
            <p className="terminal-result">{user.bio}</p>
            <p>&gt; LOC: {user.location || "TOKYO // NEO-SF"}</p>
          </Window>
        </div>
      </section>
      <section className="archive-section">
        <div className="section-heading">
          <h2>/DATA_ARCHIVE/</h2>
          <span>{archive.length} FILES</span>
        </div>
        <div className="archive-grid">
          {archive.map((post, index) => (
            <button className={index === 0 ? "archive-item wide" : "archive-item"} key={post.id}>
              {post.imageUrl ? <img src={post.imageUrl} alt={post.title} /> : <p>{post.body}</p>}
              <strong>{post.title || `POST_${post.id}.RAW`}</strong>
              <span>ERR_CODE: {index % 2 === 0 ? 200 : 404}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

function PostDetails({ post, comments, onBack, onAddComment }) {
  const [text, setText] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    await onAddComment(post.id, text.trim());
    setText("");
  };

  return (
    <main className="details-screen">
      <button className="back-action" onClick={onBack}>
        <Icon name="arrow_back" /> BACK_TO_FEED
      </button>
      <Window title="POST_VIEW.EXE" className="details-window">
        <div className="details-author">
          <img src={post.user?.avatarUrl} alt={post.user?.displayName || post.user?.username} />
          <div>
            <strong>@{post.user?.username}</strong>
            <span>SYS_TIME: {post.timestampLabel || "14:02:59"} // LOG_ID: {post.id}</span>
          </div>
          <button className="mini-action">
            <Icon name="add" /> FOLLOW
          </button>
        </div>
        <div className="details-content">
          <p>{post.body}</p>
          {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
        </div>
        <div className="details-actions">
          <button>
            <Icon name="favorite" filled /> LIKE [{post.likeCount || 0}]
          </button>
          <button className="active">
            <Icon name="chat_bubble" /> COMM [{comments.length}]
          </button>
          <button>
            <Icon name="share" /> SHARE
          </button>
        </div>
        <div className="comment-list">
          {comments.map((comment) => (
            <article key={comment.id} className="comment-card">
              <div>
                <strong>@{comment.user?.username || "GUEST_NODE"}</strong>
                <span>{comment.timestampLabel || "T-MINUS 1 HR"}</span>
              </div>
              <p>{comment.body}</p>
            </article>
          ))}
        </div>
        <form className="terminal-input" onSubmit={submit}>
          <span>&gt;</span>
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="ENTER_COMMAND_OR_COMMENT..." />
          <button>EXEC</button>
        </form>
      </Window>
    </main>
  );
}

function Messages() {
  return (
    <main className="screen">
      <Window title="MAIL_QUEUE.dat" className="mail-window">
        <div className="mail-row">
          <strong>@NET_RUNNER</strong>
          <span>Signal received. Awaiting packet confirmation.</span>
        </div>
        <div className="mail-row">
          <strong>@SYS_ADMIN_01</strong>
          <span>Render protocol updated. Restart recommended.</span>
        </div>
        <div className="mail-row">
          <strong>@VOID_STATE</strong>
          <span>Invitation token unlocked.</span>
        </div>
      </Window>
    </main>
  );
}

function App() {
  const [active, setActive] = useState("feed");
  const [posts, setPosts] = useState(fallbackPosts);
  const [users, setUsers] = useState(fallbackUsers);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [apiState, setApiState] = useState("BOOTING");

  useEffect(() => {
    async function load() {
      try {
        const [loadedPosts, loadedUsers] = await Promise.all([api.posts(), api.users()]);
        setPosts(loadedPosts);
        setUsers(loadedUsers);
        setApiState("ONLINE");
      } catch {
        setApiState("LOCAL_CACHE");
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!selectedPostId) return;

    async function loadComments() {
      try {
        const loadedComments = await api.comments(selectedPostId);
        setComments((current) => ({ ...current, [selectedPostId]: loadedComments }));
      } catch {
        setComments((current) => ({ ...current, [selectedPostId]: current[selectedPostId] || [] }));
      }
    }

    loadComments();
  }, [selectedPostId]);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) || posts[0],
    [posts, selectedPostId]
  );

  const profileUser = users[0] || fallbackUsers[0];

  const openPost = (postId) => {
    setSelectedPostId(postId);
    setActive("details");
    window.scrollTo({ top: 0 });
  };

  const addComment = async (postId, body) => {
    const created = await api.createComment(postId, {
      userId: profileUser.id,
      body
    });
    setComments((current) => ({
      ...current,
      [postId]: [...(current[postId] || []), created]
    }));
  };

  const followFirstUser = async () => {
    const target = users[1];
    if (!profileUser || !target) return;
    await api.follow(profileUser.id, target.id);
  };

  const renderScreen = () => {
    if (active === "details") {
      return (
        <PostDetails
          post={selectedPost}
          comments={comments[selectedPost?.id] || []}
          onBack={() => setActive("feed")}
          onAddComment={addComment}
        />
      );
    }

    if (active === "discover") return <Discover />;
    if (active === "messages") return <Messages />;
    if (active === "profile") return <Profile user={profileUser} posts={posts} onFollow={followFirstUser} />;
    return <Feed posts={posts} onOpenPost={openPost} />;
  };

  return (
    <div className="app-shell">
      <div className="dither-backdrop" />
      {active !== "details" && <TopBar onSearch={() => setActive("discover")} />}
      {active !== "details" && <DesktopRail active={active} onChange={setActive} />}
      <div className="api-status">API: {apiState}</div>
      {renderScreen()}
      {active !== "details" && <MobileNav active={active} onChange={setActive} />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
