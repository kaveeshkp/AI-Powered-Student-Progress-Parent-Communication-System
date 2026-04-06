import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,600;9..144,0,700;9..144,1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #040810;
  --surface:     #080e1a;
  --surface2:    #0d1526;
  --border:      rgba(255,255,255,0.07);
  --text:        #dde4f0;
  --muted:       #5a6480;
  --muted2:      #8892aa;
  --cyan:        #22d3ee;
  --cyan-dim:    rgba(34,211,238,0.1);
  --cyan-glow:   rgba(34,211,238,0.22);
  --emerald:     #34d399;
  --amber:       #fbbf24;
  --red:         #f87171;
  --ease:        cubic-bezier(0.16,1,0.3,1);
}

body { font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text); }

.msg-root { display: flex; min-height: 100vh; flex-direction: column; }
.msg-header {
  height: 64px; background: var(--surface); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 1.75rem; gap: 1.5rem;
  position: sticky; top: 0; z-index: 30;
}
.msg-header-back { width: 36px; height: 36px; border-radius: 9px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted2); cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; }
.msg-header-back:hover { background: var(--cyan-dim); color: var(--cyan); }
.msg-title { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 600; color: #fff; }

.msg-container { flex: 1; display: flex; overflow: hidden; }

/* Sidebar - Conversations */
.msg-sidebar { width: 320px; border-right: 1px solid var(--border); display: flex; flex-direction: column; background: var(--surface); }
.msg-sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--border); }
.msg-search { display: flex; align-items: center; gap: 0.5rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 0.4rem 0.75rem; }
.msg-search input { background: none; border: none; outline: none; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.8rem; flex: 1; }
.msg-search input::placeholder { color: var(--muted); }

.msg-conv-list { flex: 1; overflow-y: auto; }
.msg-conv-list::-webkit-scrollbar { width: 4px; }
.msg-conv-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

.msg-conv-item {
  padding: 0.9rem 1rem; border-bottom: 1px solid var(--border);
  cursor: pointer; transition: background 0.15s;
  display: flex; gap: 0.75rem; align-items: flex-start;
}
.msg-conv-item:hover { background: rgba(34,211,238,0.03); }
.msg-conv-item.active { background: var(--cyan-dim); border-left: 3px solid var(--cyan); padding-left: calc(1rem - 3px); }

.msg-conv-avatar {
  width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(34,211,238,0.2), rgba(8,145,178,0.15));
  border: 1px solid rgba(34,211,238,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700; color: var(--cyan);
  position: relative;
}
.msg-conv-avatar.unread { border-color: var(--cyan); box-shadow: 0 0 10px rgba(34,211,238,0.3); }
.msg-conv-avatar::after { content: ''; position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--emerald); border: 2px solid var(--surface); }

.msg-conv-info { flex: 1; min-width: 0; }
.msg-conv-name { font-size: 0.85rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.msg-conv-preview { font-size: 0.75rem; color: var(--muted); margin-top: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.msg-conv-time { font-size: 0.7rem; color: var(--muted); flex-shrink: 0; white-space: nowrap; }
.msg-conv-item.unread .msg-conv-name { color: var(--cyan); font-weight: 700; }

/* Main Chat Area */
.msg-main { flex: 1; display: flex; flex-direction: column; background: var(--bg); }

.msg-chat-header {
  padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.msg-chat-info { display: flex; align-items: center; gap: 0.75rem; }
.msg-chat-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, rgba(34,211,238,0.2), rgba(8,145,178,0.15)); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--cyan); }
.msg-chat-details { display: flex; flex-direction: column; }
.msg-chat-name { font-size: 0.9rem; font-weight: 600; color: #fff; }
.msg-chat-status { font-size: 0.7rem; color: var(--muted); margin-top: 0.1rem; }
.msg-chat-actions { display: flex; gap: 0.5rem; }
.msg-action-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface2); color: var(--muted2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; transition: background 0.2s, color 0.2s; }
.msg-action-btn:hover { background: var(--cyan-dim); color: var(--cyan); }

.msg-chat-area { flex: 1; overflow-y: auto; padding: 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.msg-chat-area::-webkit-scrollbar { width: 4px; }
.msg-chat-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

.msg-group { display: flex; flex-direction: column; gap: 0.5rem; }
.msg-timestamp { text-align: center; font-size: 0.7rem; color: var(--muted); padding: 0.5rem 0; }

.msg-bubble { display: flex; gap: 0.75rem; align-items: flex-end; }
.msg-bubble.sent { justify-content: flex-end; }

.msg-content {
  padding: 0.8rem 1rem; border-radius: 12px; max-width: 60%;
  word-wrap: break-word;
}
.msg-bubble.received .msg-content { background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
.msg-bubble.sent .msg-content { background: var(--cyan); color: #040810; border: none; }

.msg-send-area { padding: 1.5rem; border-top: 1px solid var(--border); display: flex; gap: 0.75rem; align-items: flex-end; }
.msg-input-wrapper { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
.msg-input { width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid var(--border); background: var(--surface2); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.85rem; resize: none; max-height: 100px; }
.msg-input:focus { outline: none; border-color: var(--cyan); box-shadow: 0 0 0 3px var(--cyan-dim); }
.msg-input::placeholder { color: var(--muted); }

.msg-send-btn { width: 44px; height: 44px; border-radius: 10px; background: var(--cyan); color: #040810; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: background 0.2s, transform 0.2s; }
.msg-send-btn:hover { background: #67e8f9; transform: translateY(-2px); }
.msg-send-btn:active { transform: translateY(0); }

.msg-attachment-btn { width: 44px; height: 44px; border-radius: 10px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: background 0.2s, color 0.2s; }
.msg-attachment-btn:hover { background: var(--cyan-dim); color: var(--cyan); }

.empty-chat {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem;
}
.empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 600; color: var(--text); }
.empty-sub { font-size: 0.85rem; color: var(--muted); margin-top: 0.5rem; }

@media (max-width: 768px) {
  .msg-sidebar { width: 0; overflow: hidden; }
  .msg-sidebar.open { width: 280px; }
  .msg-content { max-width: 85%; }
}
`;

function MessageConversation({ name, preview, time, unread, selected, onClick }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);
  return (
    <div
      className={`msg-conv-item ${selected ? "active" : ""} ${unread ? "unread" : ""}`}
      onClick={onClick}
    >
      <div className={`msg-conv-avatar ${unread ? "unread" : ""}`}>{initials}</div>
      <div className="msg-conv-info">
        <div className="msg-conv-name">{name}</div>
        <div className="msg-conv-preview">{preview}</div>
      </div>
      <div className="msg-conv-time">{time}</div>
    </div>
  );
}

function MessageBubble({ message, isSent }) {
  return (
    <div className={`msg-bubble ${isSent ? "sent" : "received"}`}>
      <div className="msg-content">{message}</div>
    </div>
  );
}

function MessagesSection() {
  const { user } = useAuth();
  const [selectedConv, setSelectedConv] = useState(0);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState({
    0: [
      { text: "Hi! How are the students progressing this week?", sent: false },
      { text: "They're doing well. Most are on track with the curriculum.", sent: true },
      { text: "That's great to hear. Any concerns I should be aware of?", sent: false },
      { text: "A couple of students need extra support in math. Can we schedule a call?", sent: true },
    ],
    1: [
      { text: "Thank you for the grade report!", sent: false },
      { text: "You're welcome. Please check the comments on the assignments.", sent: true },
    ],
    2: [
      { text: "Looking forward to the parent-teacher meeting tomorrow.", sent: false },
    ],
  });

  const conversations = [
    { id: 0, name: "Sarah's Parent", preview: "A couple of students need extra support in math. Can we schedule a call?", time: "2h", unread: false },
    { id: 1, name: "John's Parent", preview: "You're welcome. Please check the comments on the assignments.", time: "4h", unread: false },
    { id: 2, name: "Mike's Parent", preview: "Looking forward to the parent-teacher meeting tomorrow.", time: "1d", unread: true },
    { id: 3, name: "Emma's Parent", preview: "When will the grade sheets be available?", time: "2d", unread: false },
    { id: 4, name: "David's Parent", preview: "Thanks for the update on David's progress.", time: "3d", unread: false },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages(prev => ({
        ...prev,
        [selectedConv]: [...(prev[selectedConv] || []), { text: messageInput, sent: true }]
      }));
      setMessageInput("");
    }
  };

  const currentMessages = messages[selectedConv] || [];
  const selectedConvData = conversations[selectedConv];

  return (
    <>
      <style>{CSS}</style>
      <div className="msg-root">
        <header className="msg-header">
          <Link to="/teacher" className="msg-header-back">←</Link>
          <h1 className="msg-title">Messages & Communication</h1>
        </header>

        <div className="msg-container">
          {/* Sidebar - Conversations */}
          <aside className="msg-sidebar">
            <div className="msg-sidebar-header">
              <div className="msg-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--muted)" }}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input placeholder="Search conversations…" />
              </div>
            </div>

            <div className="msg-conv-list">
              {conversations.map((conv) => (
                <MessageConversation
                  key={conv.id}
                  name={conv.name}
                  preview={conv.preview}
                  time={conv.time}
                  unread={conv.unread}
                  selected={selectedConv === conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                />
              ))}
            </div>
          </aside>

          {/* Main Chat */}
          <main className="msg-main">
            {selectedConvData ? (
              <>
                {/* Chat Header */}
                <div className="msg-chat-header">
                  <div className="msg-chat-info">
                    <div className="msg-chat-avatar">{selectedConvData.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                    <div className="msg-chat-details">
                      <div className="msg-chat-name">{selectedConvData.name}</div>
                      <div className="msg-chat-status">🟢 Active now</div>
                    </div>
                  </div>
                  <div className="msg-chat-actions">
                    <button className="msg-action-btn" title="Call">☎️</button>
                    <button className="msg-action-btn" title="Video">📹</button>
                    <button className="msg-action-btn" title="Info">ℹ️</button>
                  </div>
                </div>

                {/* Messages */}
                <div className="msg-chat-area">
                  <>
                    <div className="msg-timestamp">Today</div>
                    {currentMessages.map((msg, i) => (
                      <MessageBubble key={i} message={msg.text} isSent={msg.sent} />
                    ))}
                  </>
                </div>

                {/* Send Area */}
                <div className="msg-send-area">
                  <button className="msg-attachment-btn">📎</button>
                  <div className="msg-input-wrapper">
                    <textarea
                      className="msg-input"
                      placeholder="Type your message…"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      rows="1"
                    />
                  </div>
                  <button className="msg-send-btn" onClick={handleSendMessage}>✈️</button>
                </div>
              </>
            ) : (
              <div className="empty-chat">
                <div className="empty-icon">💬</div>
                <div className="empty-title">No Conversation Selected</div>
                <div className="empty-sub">Select a conversation to start messaging.</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default MessagesSection;
