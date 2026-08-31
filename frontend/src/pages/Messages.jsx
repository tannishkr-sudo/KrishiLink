import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Mic, MoreHorizontal, Play, Plus, Send, Square, Trash2 } from "lucide-react";
import { Field, Menu, Modal, PageHeader } from "@/components/UIKit";
import { useApp } from "@/store/AppStore";

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function Messages() {
  const { conversations, sendMessage, readConversation, startConversation, toast } = useApp();
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [text, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const [newChat, setNewChat] = useState({ name: "", role: "Buyer", note: "" });
  const [newChatError, setNewChatError] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const recorder = useRef(null);
  const stream = useRef(null);
  const timer = useRef(null);
  const bodyRef = useRef(null);

  const active = useMemo(() => conversations.find((c) => c.id === activeId) ?? conversations[0], [conversations, activeId]);

  useEffect(() => { if (active?.unread) readConversation(active.id); }, [active, readConversation]);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [active?.messages.length]);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error("Voice recording is not supported in this browser.");
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      recorder.current = new MediaRecorder(stream.current);
      recorder.current.ondataavailable = (event) => chunks.push(event.data);
      recorder.current.onstop = () => {
        setAudioUrl(URL.createObjectURL(new Blob(chunks, { type: "audio/webm" })));
        stream.current?.getTracks().forEach((track) => track.stop());
      };
      recorder.current.start();
      setSeconds(0); setRecording(true); setError("");
      timer.current = window.setInterval(() => setSeconds((v) => v + 1), 1000);
    } catch (e) { setError(e.message); }
  };
  const stopRecording = () => { recorder.current?.stop(); window.clearInterval(timer.current); setRecording(false); };
  const discard = () => { if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(""); setSeconds(0); setError(""); };
  const sendVoice = () => {
    if (!audioUrl) return;
    sendMessage(active.id, { type: "voice", duration: fmt(seconds), url: audioUrl });
    setAudioUrl(""); setSeconds(0);
    toast("Voice message sent");
  };
  const sendText = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(active.id, { type: "text", text: text.trim() });
    setText("");
  };
  const createChat = () => {
    if (!newChat.name.trim()) { setNewChatError("Who do you want to message?"); return; }
    const id = startConversation(newChat.name.trim(), `${newChat.role} · New contact`);
    if (newChat.note.trim()) sendMessage(id, { type: "text", text: newChat.note.trim() });
    setActiveId(id); setCreating(false); setNewChat({ name: "", role: "Buyer", note: "" }); setNewChatError("");
  };

  return (
    <>
      <PageHeader eyebrow="Connections / 09" title="Messages"
        description="Stay close to the people who move your produce — by text or by voice."
        action={<button type="button" className="btn btn-primary" data-testid="messages-new-button" onClick={() => { setNewChatError(""); setCreating(true); }}><Plus size={17} /> New message</button>} />

      <div className="chat-layout">
        <aside className="chat-list" data-testid="conversation-list">
          {conversations.map((c) => (
            <button type="button" key={c.id} className={c.id === active?.id ? "chat-item active" : "chat-item"} data-testid={`conversation-${c.id}`} onClick={() => setActiveId(c.id)}>
              <span className="avatar">{c.initials}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <strong>{c.name}</strong>
                <span>{c.messages.at(-1)?.text ?? (c.messages.at(-1)?.type === "voice" ? "Voice message" : "No messages yet")}</span>
              </span>
              {c.unread ? <em data-testid={`unread-${c.id}`}>{c.unread}</em> : null}
            </button>
          ))}
        </aside>

        <section className="chat-main" data-testid="conversation-panel">
          <header className="chat-head">
            <span className="avatar">{active?.initials}</span>
            <div style={{ flex: 1 }}><strong>{active?.name}</strong><span>{active?.online ? "Active now" : "Offline"} · {active?.role}</span></div>
            <Menu testId="conversation-menu" trigger={(t) => <button type="button" className="icon-btn" onClick={t} data-testid="conversation-menu-button" aria-label="Conversation options"><MoreHorizontal size={18} /></button>}>
              <button type="button" className="menu-item" data-testid="conversation-share-button" onClick={() => toast("Produce catalogue shared")}>Share produce catalogue</button>
              <button type="button" className="menu-item" data-testid="conversation-mute-button" onClick={() => toast("Conversation muted")}>Mute notifications</button>
              <button type="button" className="menu-item danger" data-testid="conversation-report-button" onClick={() => toast("Buyer reported to support", "error")}>Report buyer</button>
            </Menu>
          </header>

          <div className="chat-body" ref={bodyRef} data-testid="message-history">
            {active?.messages.length === 0 && <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "auto" }}>No messages yet. Say hello or send a voice note.</p>}
            {active?.messages.map((m) => (
              <div className={`bubble ${m.from === "me" ? "me" : "them"} ${m.type === "voice" ? "voice" : ""}`} key={m.id} data-testid={`message-${m.id}`}>
                {m.type === "voice" ? (
                  <>
                    <Play size={15} />
                    <div><span>Voice message · {m.duration}</span>{m.url && <audio controls src={m.url} data-testid={`voice-audio-${m.id}`} />}<small>{m.time}</small></div>
                  </>
                ) : (<><span>{m.text}</span><small>{m.time}</small></>)}
              </div>
            ))}
          </div>

          <div className="composer" data-testid="voice-message-composer">
            <form className="composer-row" onSubmit={sendText}>
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" data-testid="message-text-input" />
              <button type="submit" className="btn btn-primary" data-testid="send-text-message-button" disabled={!text.trim()}><Send size={15} /> Send</button>
            </form>

            {error && <p className="field-error" data-testid="voice-error-message">{error}</p>}

            <div className="rec-strip">
              <div className="rec-label" style={{ flex: 1 }}>
                <strong>{recording ? "Recording voice message" : audioUrl ? "Voice message preview" : "Send a voice message"}</strong>
                <small>{recording ? "Speak clearly, then stop when done" : audioUrl ? "Listen before you send" : "Tap record to begin"}</small>
              </div>
              {recording && <><span className="wave" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />)}</span><span className="rec-time" data-testid="recording-timer">{fmt(seconds)}</span></>}
              {audioUrl && <audio controls src={audioUrl} data-testid="voice-message-audio" />}
              {recording ? (
                <button type="button" className="btn btn-danger" data-testid="stop-recording-button" onClick={stopRecording}><Square size={15} fill="currentColor" /> Stop</button>
              ) : audioUrl ? (
                <>
                  <button type="button" className="row-btn" data-testid="discard-voice-message-button" aria-label="Discard voice message" onClick={discard}><Trash2 size={15} /></button>
                  <button type="button" className="btn btn-primary" data-testid="send-voice-message-button" onClick={sendVoice}><Send size={15} /> Send voice</button>
                </>
              ) : (
                <button type="button" className="btn btn-accent" data-testid="start-recording-button" onClick={startRecording}><Mic size={16} /> Record</button>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="aside-card mt" data-testid="voice-tips-card">
        <div className="aside-icon"><Mic size={20} /></div>
        <p className="eyebrow">Voice messages</p>
        <h3>Talk through the details</h3>
        <p>Use your voice when a delivery or quality note is easier to explain out loud.</p>
        <div className="tick"><Check size={14} /> Clear, natural conversations</div>
        <div className="tick"><Check size={14} /> Preview before sending</div>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} testId="new-message-modal"
        title="Start a new conversation" subtitle="Message a buyer, seller or transporter directly."
        footer={<>
          <button type="button" className="btn btn-ghost" onClick={() => setCreating(false)} data-testid="cancel-new-message-button">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={createChat} data-testid="create-conversation-button"><Send size={15} /> Start conversation</button>
        </>}>
        <div className="form-grid">
          <Field label="Contact name" error={newChatError}>
            <input className="input" value={newChat.name} onChange={(e) => setNewChat({ ...newChat, name: e.target.value })} placeholder="e.g. Green Basket Co." data-testid="new-message-name-input" />
          </Field>
          <Field label="They are a">
            <select className="select" value={newChat.role} onChange={(e) => setNewChat({ ...newChat, role: e.target.value })} data-testid="new-message-role-select">
              <option>Buyer</option><option>Seller</option><option>Transporter</option>
            </select>
          </Field>
          <div className="full">
            <Field label="First message" hint="Optional">
              <textarea className="textarea" value={newChat.note} onChange={(e) => setNewChat({ ...newChat, note: e.target.value })} placeholder="Hello, I have 500 kg Grade A tomato ready this week." data-testid="new-message-body-input" />
            </Field>
          </div>
        </div>
      </Modal>
    </>
  );
}
