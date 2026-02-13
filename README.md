# RetroCord Communicator

A self-hosted, Discord-like web communicator with a retro XP-era aesthetic.
Designed to run on low-spec hardware (Windows XP ThinkPad) and work in legacy browsers (Mypal).

---

## Architecture Overview

### Why These Choices?

| Component | Choice | Reasoning |
|-----------|--------|-----------|
| **Runtime** | Node.js 10.x | Last version with unofficial XP support. Newer versions require Win7+. |
| **Backend** | Express.js | Minimal, stable, works on Node 10. No heavy framework overhead. |
| **Database** | SQLite via better-sqlite3 | Zero config, single-file DB, perfect for XP. No MySQL/Postgres install needed. |
| **Real-time** | Socket.io 2.x | Built-in reconnection, rooms, namespaces. v2 works with older browsers. |
| **Auth** | JWT + bcrypt | Stateless tokens, no session store needed. bcrypt for password hashing. |
| **Frontend** | Vanilla JS + Preact | Preact is 3KB, API-compatible with React. Tiny bundle for Mypal. |
| **Bundler** | Webpack 4 | Outputs ES5, works with Node 10, battle-tested legacy support. |
| **Voice/Video** | Optional WebRTC | Won't work in Mypal — graceful fallback to text-only voice room presence. |
| **Language** | Plain JavaScript | TypeScript adds build complexity; for XP/Node 10 compat, plain JS is safer. |

### Three-Column Layout
```
┌──────┬────────────┬──────────────────────────┬──────────┐
│Servers│  Channels  │       Chat Pane           │ Members  │
│ Bar   │   List     │  Messages + Input          │  List    │
│ 64px  │  200px     │  flex-grow                 │  200px   │
└──────┴────────────┴──────────────────────────┴──────────┘
```

### Security
- JWT tokens stored in httpOnly cookies (with localStorage fallback for XP)
- bcrypt password hashing (cost factor 10)
- Input sanitization via DOMPurify on client + escape on server
- Rate limiting: 30 messages/minute, 5 login attempts/15min
- File uploads: whitelist extensions, 5MB limit, stored outside public dir
- CORS restricted to configured origin

---

## Setup Instructions (Windows XP)

### Prerequisites
1. **Node.js 10.24.1** — last version with XP support
   - Download: `https://nodejs.org/dist/v10.24.1/node-v10.24.1-x86.msi`
   - Install with default settings
2. **Python 2.7** (for building native modules like better-sqlite3)
   - Download: `https://www.python.org/ftp/python/2.7.18/python-2.7.18.msi`
3. **Visual C++ Build Tools 2015** or Visual Studio 2015 Express

### Installation
```batch
REM Clone or copy the retrocord folder to C:\retrocord
cd C:\retrocord

REM Install backend dependencies
cd backend
npm install

REM Install frontend dependencies  
cd ..\frontend
npm install

REM Build frontend for production
npm run build
```

### Running
```batch
REM Start backend (serves API + static frontend)
cd C:\retrocord\backend
node src\index.js

REM Visit http://localhost:3001 in Mypal
```

### Offline-Friendly Install
If the XP machine has no internet:
1. On a modern machine, run `npm install` in both backend/ and frontend/
2. Run `npm run build` in frontend/
3. Copy the entire retrocord/ folder (including node_modules) to the XP machine
4. Just run `node src\index.js` in backend/

---

## Mypal Compatibility Notes

| Feature | Status | Notes |
|---------|--------|-------|
| Text chat | ✅ Works | Socket.io 2.x with XHR-polling fallback |
| Login/Register | ✅ Works | Standard forms + fetch polyfill |
| File upload | ✅ Works | Basic multipart upload |
| Presence indicators | ✅ Works | Socket.io events |
| Voice/Video | ❌ No WebRTC | Falls back to text-only room presence |
| CSS Gradients | ⚠️ Partial | Uses simple fallback colors |
| Flexbox | ⚠️ Partial | Prefixed, with float fallbacks |

---

## API Routes

### Auth
- `POST /api/auth/register` — { username, email, password } → { token, user }
- `POST /api/auth/login` — { email, password } → { token, user }
- `POST /api/auth/logout` — Clears cookie
- `GET /api/auth/me` — Returns current user

### Servers (Guilds)
- `POST /api/servers` — { name, icon? } → { server }
- `GET /api/servers` — List user's servers
- `POST /api/servers/:id/join` — { inviteCode } → { server }
- `POST /api/servers/:id/invite` — Generates invite code
- `DELETE /api/servers/:id` — Delete server (owner only)
- `GET /api/servers/:id/members` — List members

### Channels
- `POST /api/servers/:serverId/channels` — { name, type } → { channel }
- `GET /api/servers/:serverId/channels` — List channels
- `DELETE /api/channels/:id` — Delete channel (owner/admin)

### Messages
- `GET /api/channels/:channelId/messages?before=&limit=50` — Paginated history
- `DELETE /api/messages/:id` — Delete message (author/owner/admin)

### Files
- `POST /api/upload` — multipart file → { url, filename, size }

### Moderation
- `POST /api/servers/:id/kick` — { userId } → Kicks user
- `POST /api/servers/:id/role` — { userId, role } → Sets role

### Socket.io Events

**Client → Server:**
- `join-server` { serverId }
- `join-channel` { channelId }
- `leave-channel` { channelId }
- `send-message` { channelId, content, attachments? }
- `typing` { channelId }
- `join-voice` { channelId }
- `leave-voice` { channelId }

**Server → Client:**
- `new-message` { message }
- `message-deleted` { messageId, channelId }
- `user-typing` { channelId, user }
- `presence-update` { userId, status }
- `member-joined` { serverId, user }
- `member-left` { serverId, userId }
- `voice-state` { channelId, users[] }
- `server-updated` { server }
