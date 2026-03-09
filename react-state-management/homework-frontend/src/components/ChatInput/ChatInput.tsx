import { type FormEvent, useState, useCallback } from "react";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import styles from "./ChatInput.module.css";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isSending: boolean;
}

const MAX_MESSAGE_LENGTH = 150;
const WARNING_THRESHOLD = 100;
const DANGER_THRESHOLD = 130;

function ChatInput({
  onSendMessage,
  isSending,
}: ChatInputProps): React.ReactElement {
  const [text, setText] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_MESSAGE_LENGTH) {
      return;
    }
    onSendMessage(trimmed);
    setText("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value);
  };

  const handleEmojiSelect = useCallback((emoji: string): void => {
    setText((prev) => {
      const newText = prev + emoji;
      return newText.length <= MAX_MESSAGE_LENGTH ? newText : prev;
    });
  }, []);

  const getCounterClass = (): string => {
    if (text.length > DANGER_THRESHOLD) {
      return `${styles.counter} ${styles.counterDanger}`;
    }
    if (text.length > WARNING_THRESHOLD) {
      return `${styles.counter} ${styles.counterWarning}`;
    }
    return styles.counter;
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          type="text"
          placeholder="Введите сообщение..."
          value={text}
          onChange={handleChange}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={isSending}
        />
        <span className={getCounterClass()}>
          {text.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </div>
      <EmojiPicker onSelectEmoji={handleEmojiSelect} />
      <button
        className={styles.button}
        type="submit"
        disabled={isSending || text.trim().length === 0}
      >
        {isSending ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default ChatInput;
