// shared/constants.js
// Shared constants between backend and frontend

var ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
};

var CHANNEL_TYPES = {
  TEXT: 'text',
  VOICE: 'voice'
};

var PRESENCE = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away'
};

var LIMITS = {
  MESSAGE_MAX_LENGTH: 2000,
  USERNAME_MIN: 3,
  USERNAME_MAX: 32,
  PASSWORD_MIN: 6,
  SERVER_NAME_MAX: 100,
  CHANNEL_NAME_MAX: 50,
  FILE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MESSAGES_PER_PAGE: 50
};

var ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp',
  '.txt', '.pdf', '.zip', '.7z', '.rar',
  '.mp3', '.wav', '.ogg', '.mp4'
];

var SOCKET_EVENTS = {
  // Client -> Server
  JOIN_SERVER: 'join-server',
  JOIN_CHANNEL: 'join-channel',
  LEAVE_CHANNEL: 'leave-channel',
  SEND_MESSAGE: 'send-message',
  TYPING: 'typing',
  JOIN_VOICE: 'join-voice',
  LEAVE_VOICE: 'leave-voice',
  // Server -> Client
  NEW_MESSAGE: 'new-message',
  MESSAGE_DELETED: 'message-deleted',
  USER_TYPING: 'user-typing',
  PRESENCE_UPDATE: 'presence-update',
  MEMBER_JOINED: 'member-joined',
  MEMBER_LEFT: 'member-left',
  VOICE_STATE: 'voice-state',
  SERVER_UPDATED: 'server-updated'
};

// CommonJS + browser compat
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROLES, CHANNEL_TYPES, PRESENCE, LIMITS, ALLOWED_EXTENSIONS, SOCKET_EVENTS };
}
