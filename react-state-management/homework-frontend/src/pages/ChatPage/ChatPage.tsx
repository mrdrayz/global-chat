import { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loadMessages,
  postMessage,
  clearChatError,
} from "../../features/chat/chatSlice";
import { logout } from "../../features/auth/authSlice";
import ChatMessage from "../../components/ChatMessage/ChatMessage";
import ChatInput from "../../components/ChatInput/ChatInput";
import VirtualScroll from "../../components/VirtualScroll/VirtualScroll";
import type { ChatMessage as ChatMessageType } from "../../types";
import styles from "./ChatPage.module.css";

const POLLING_INTERVAL_MS = 3000;
const MESSAGE_ITEM_HEIGHT = 100;
const DIVIDER_DISPLAY_MS = 6000;

function ChatPage(): React.ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { messages, isLoading, error, isSending } = useAppSelector(
    (state) => state.chat,
  );
  const user = useAppSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastSeenCount, setLastSeenCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);
  const dividerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(loadMessages());

    const intervalId = setInterval(() => {
      dispatch(loadMessages());
    }, POLLING_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  useEffect(() => {
    if (isInitialLoadRef.current && messages.length > 0) {
      setLastSeenCount(messages.length);
      isInitialLoadRef.current = false;
    }
  }, [messages.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dividerTimerRef.current) {
        clearTimeout(dividerTimerRef.current);
      }
    };
  }, []);

  const newMessageCount = Math.max(0, messages.length - lastSeenCount);
  const newMessageStartIndex = newMessageCount > 0 ? lastSeenCount : -1;

  const handleReachBottom = useCallback((): void => {
    if (dividerTimerRef.current) {
      clearTimeout(dividerTimerRef.current);
    }

    dividerTimerRef.current = setTimeout(() => {
      setLastSeenCount(messages.length);
      dividerTimerRef.current = null;
    }, DIVIDER_DISPLAY_MS);
  }, [messages.length]);

  const handleSendMessage = useCallback(
    async (text: string): Promise<void> => {
      const result = await dispatch(postMessage(text));
      if (postMessage.fulfilled.match(result)) {
        dispatch(loadMessages());
      }
    },
    [dispatch],
  );

  const handleLogout = useCallback((): void => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const handleDismissError = useCallback((): void => {
    dispatch(clearChatError());
  }, [dispatch]);

  const handleToggleMenu = useCallback((): void => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const renderMessage = useCallback(
    (message: ChatMessageType, index: number): React.ReactElement => (
      <ChatMessage
        key={`${message.username}-${index}`}
        message={message}
        isOwn={message.username === user?.username}
      />
    ),
    [user?.username],
  );

  const renderContent = (): React.ReactElement => {
    if (isLoading && messages.length === 0) {
      return <div className={styles.loading}>Загрузка сообщений...</div>;
    }

    if (messages.length === 0) {
      return (
        <div className={styles.empty}>Сообщений пока нет. Напишите первое!</div>
      );
    }

    return (
      <VirtualScroll
        items={messages}
        itemHeight={MESSAGE_ITEM_HEIGHT}
        renderItem={renderMessage}
        autoScrollToBottom
        newMessageCount={newMessageCount}
        newMessageStartIndex={newMessageStartIndex}
        onReachBottom={handleReachBottom}
      />
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img
          className={styles.headerLogo}
          src="/Logo2.png"
          alt="Глобальный чат"
        />
        <div className={styles.profileWrapper} ref={menuRef}>
          <button
            className={styles.profileButton}
            type="button"
            onClick={handleToggleMenu}
          >
            <img
              className={styles.headerAvatar}
              src="/Favicon.ico"
              alt="User avatar"
            />
            <span className={styles.headerUser}>{user?.username}</span>
          </button>
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <button
                className={styles.dropdownItem}
                type="button"
                onClick={handleLogout}
              >
                Покинуть чат
              </button>
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className={styles.error} onClick={handleDismissError}>
          {error} (нажмите, чтобы скрыть)
        </div>
      )}

      {renderContent()}

      <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
}

export default ChatPage;
