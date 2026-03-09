import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./EmojiPicker.module.css";

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

interface EmojiCategory {
  name: string;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: "😀",
    emojis: [
      "😀",
      "😂",
      "🤣",
      "😊",
      "😍",
      "🥰",
      "😘",
      "😎",
      "🤔",
      "😏",
      "😢",
      "😭",
      "😤",
      "🤯",
      "🥳",
      "😴",
      "🙄",
      "😬",
      "🤗",
      "🤩",
      "😇",
      "🥺",
      "😈",
      "💀",
    ],
  },
  {
    name: "👋",
    emojis: [
      "👍",
      "👎",
      "👋",
      "🤝",
      "👏",
      "🙌",
      "💪",
      "✌️",
      "🤞",
      "🤙",
      "👌",
      "🖐️",
      "✋",
      "🤚",
      "👊",
      "❤️",
    ],
  },
  {
    name: "🎉",
    emojis: [
      "🎉",
      "🔥",
      "⭐",
      "💫",
      "✨",
      "🌟",
      "💯",
      "🎯",
      "🚀",
      "💎",
      "🏆",
      "🎮",
      "🎵",
      "📱",
      "💻",
      "🌍",
    ],
  },
  {
    name: "🐱",
    emojis: [
      "🐱",
      "🐶",
      "🐸",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🦁",
      "🐯",
      "🐮",
      "🐷",
      "🐵",
      "🐙",
      "🦄",
      "🐲",
      "🐾",
    ],
  },
];

function EmojiPicker({ onSelectEmoji }: EmojiPickerProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleEmojiClick = useCallback(
    (emoji: string): void => {
      onSelectEmoji(emoji);
    },
    [onSelectEmoji],
  );

  const handleCategoryClick = useCallback((index: number): void => {
    setActiveCategory(index);
  }, []);

  return (
    <div className={styles.container} ref={pickerRef}>
      <button
        className={styles.trigger}
        type="button"
        onClick={handleToggle}
        aria-label="Выбрать эмодзи"
      >
        😊
      </button>
      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.categories}>
            {EMOJI_CATEGORIES.map((category, index) => (
              <button
                key={category.name}
                className={
                  index === activeCategory
                    ? `${styles.categoryButton} ${styles.categoryButtonActive}`
                    : styles.categoryButton
                }
                type="button"
                onClick={() => handleCategoryClick(index)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className={styles.emojiGrid}>
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
              <button
                key={emoji}
                className={styles.emojiButton}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
