import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getThreadMessages, getThreads, sendMessage } from "../services/messageService";

function MessagesPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadThreads = async () => {
      setLoadingThreads(true);
      setError("");
      try {
        const data = await getThreads();
        if (!mounted) return;
        const list = data || [];
        setThreads(list);
        if (list[0]?.id) {
          setSelectedId(list[0].id);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load conversations.");
      } finally {
        if (mounted) setLoadingThreads(false);
      }
    };
    loadThreads();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadMessages = async () => {
      if (!selectedId) return;
      setLoadingMessages(true);
      setError("");
      try {
        const data = await getThreadMessages(selectedId);
        if (!mounted) return;
        setMessages(data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load messages.");
      } finally {
        if (mounted) setLoadingMessages(false);
      }
    };
    loadMessages();
    return () => {
      mounted = false;
    };
  }, [selectedId]);

  const onSend = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !selectedId) return;
    setSending(true);
    setError("");
    try {
      await sendMessage(selectedId, { text: draft.trim() });
      const refreshed = await getThreadMessages(selectedId);
      setMessages(refreshed || []);
      setDraft("");
    } catch (err) {
      setError(err?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const activeThread = useMemo(() => threads.find((t) => t.id === selectedId) || null, [threads, selectedId]);
  const displayMessages = useMemo(
    () =>
      (messages || []).map((m, idx) => ({
        id: m.id ?? idx,
        sender: m.sender || (m.fromMe ? "me" : "them"),
        text: m.text || m.body || "",
        time: m.time || m.sentAt || m.createdAt || ""
      })),
    [messages]
  );

  return (
    <DashboardLayout title="Messages">
      <div className="grid gap-4 lg:grid-cols-3">
        <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
              <p className="text-sm text-slate-300">Secure messaging</p>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
              {user?.role || "User"}
            </span>
          </div>
          <div className="space-y-2">
            {loadingThreads ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : threads.length ? (
              threads.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition ${
                    conv.id === selectedId
                      ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-100"
                      : "border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <p className="font-semibold text-white">{conv.name || conv.title || "Conversation"}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{conv.preview || conv.lastMessage || ""}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-400">No conversations yet.</p>
            )}
          </div>
        </aside>

        <section className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
          {activeThread ? (
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">{activeThread.name || activeThread.title || "Conversation"}</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-200/70">Secure chat</p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                {loadingMessages ? (
                  <div className="space-y-2">
                    <SkeletonRow />
                    <SkeletonRow />
                  </div>
                ) : displayMessages.length ? (
                  displayMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs rounded-2xl px-4 py-3 text-sm shadow-md sm:max-w-sm ${
                          msg.sender === "me"
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-800 text-slate-100 border border-slate-700"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wide opacity-70">{msg.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No messages yet.</p>
                )}
              </div>

              <form onSubmit={onSend} className="mt-3 flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
              <p className="mt-2 text-xs text-slate-400">Powered by your messages API.</p>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-300">Select a conversation to view messages.</div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default MessagesPage;

function SkeletonRow() {
  return <div className="h-12 rounded-lg bg-slate-800/60 animate-pulse" />;
}
