import type { ChatMessage as ChatMessageType } from "../../types";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
}

function ChatMessage({ message, isOwn }: ChatMessageProps): React.ReactElement {
  const containerClass = isOwn
    ? `${styles.message} ${styles.own}`
    : styles.message;

  const displayName = isOwn ? `${message.username} (Вы)` : message.username;

  return (
    <div className={containerClass}>
      <span className={styles.username}>{displayName}</span>
      <span className={styles.body}>{message.body}</span>
    </div>
  );
}

export default ChatMessage;
