const DUMMY_MESSAGES = [
  { from: 'Sarah Chen', avatar: '👩‍💼', message: 'Your booking is confirmed! Let me know if you need anything.', time: '2 hours ago', unread: true },
  { from: 'Marcus Rivera', avatar: '👨‍🎨', message: 'Thanks for your interest! The villa is available for those dates.', time: '1 day ago', unread: true },
  { from: 'xRentz Support', avatar: '🛡️', message: 'Welcome to xRentz! Check out our guide for new users.', time: '3 days ago', unread: false },
];

export default function MessageList() {
  return (
    <div className="dashboard-messages">
      {DUMMY_MESSAGES.map((msg, i) => (
        <div key={i} className={`message-item ${msg.unread ? 'message-item--unread' : ''}`}>
          <div className="message-item__avatar">{msg.avatar}</div>
          <div className="message-item__content">
            <div className="message-item__header">
              <strong>{msg.from}</strong>
              <span className="message-item__time">{msg.time}</span>
            </div>
            <p className="message-item__text">{msg.message}</p>
          </div>
          {msg.unread && <div className="message-item__dot" />}
        </div>
      ))}
    </div>
  );
}
