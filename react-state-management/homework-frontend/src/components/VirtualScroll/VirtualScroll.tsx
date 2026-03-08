import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import styles from "./VirtualScroll.module.css";

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  autoScrollToBottom?: boolean;
  newMessageStartIndex?: number;
  newMessageCount?: number;
  onReachBottom?: () => void;
}

const SHOW_BUTTON_THRESHOLD = 300;
const DIVIDER_HEIGHT = 30;

function VirtualScroll<T>({
  items,
  itemHeight,
  overscan = 5,
  renderItem,
  autoScrollToBottom = true,
  newMessageStartIndex = -1,
  newMessageCount = 0,
  onReachBottom,
}: VirtualScrollProps<T>): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const prevItemCountRef = useRef(items.length);
  const onReachBottomRef = useRef(onReachBottom);

  onReachBottomRef.current = onReachBottom;

  const hasDivider = newMessageCount > 0 && newMessageStartIndex >= 0;

  const getItemTop = useCallback(
    (index: number): number => {
      const base = index * itemHeight;
      if (hasDivider && index >= newMessageStartIndex) {
        return base + DIVIDER_HEIGHT;
      }
      return base;
    },
    [itemHeight, hasDivider, newMessageStartIndex],
  );

  const totalHeight = useMemo(() => {
    const base = items.length * itemHeight;
    return hasDivider ? base + DIVIDER_HEIGHT : base;
  }, [items.length, itemHeight, hasDivider]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    setContainerHeight(container.clientHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (autoScrollToBottom && items.length > prevItemCountRef.current) {
      const container = containerRef.current;
      if (container) {
        const isFirstLoad = prevItemCountRef.current === 0;
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        const isNearBottom = distanceFromBottom < SHOW_BUTTON_THRESHOLD;

        if (isFirstLoad || isNearBottom) {
          container.scrollTo({
            top: totalHeight,
            behavior: "smooth",
          });
          onReachBottomRef.current?.();
        }
      }
    }
    prevItemCountRef.current = items.length;
  }, [items.length, totalHeight, autoScrollToBottom]);

  const handleScroll = useCallback((): void => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    setScrollTop(container.scrollTop);
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const isNearBottom = distanceFromBottom <= SHOW_BUTTON_THRESHOLD;
    setShowScrollButton(!isNearBottom);
    if (isNearBottom) {
      onReachBottomRef.current?.();
    }
  }, []);

  const handleScrollToTarget = useCallback((): void => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const targetTop = hasDivider
      ? newMessageStartIndex * itemHeight
      : container.scrollHeight;

    container.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  }, [hasDivider, newMessageStartIndex, itemHeight]);

  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + 2 * overscan);
    return { startIndex: start, endIndex: end };
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push(
        <div
          key={i}
          className={styles.item}
          style={{
            top: getItemTop(i),
            height: itemHeight,
          }}
        >
          {renderItem(items[i], i)}
        </div>,
      );
    }
    return result;
  }, [startIndex, endIndex, items, itemHeight, renderItem, getItemTop]);

  const dividerElement = hasDivider ? (
    <div
      className={styles.divider}
      style={{
        top: newMessageStartIndex * itemHeight,
        height: DIVIDER_HEIGHT,
      }}
    >
      <div className={styles.dividerLine} />
      <span className={styles.dividerText}>Новые сообщения</span>
      <div className={styles.dividerLine} />
    </div>
  ) : null;

  return (
    <div className={styles.wrapper}>
      <div
        ref={containerRef}
        className={styles.container}
        onScroll={handleScroll}
      >
        <div className={styles.content} style={{ height: totalHeight }}>
          {visibleItems}
          {dividerElement}
        </div>
      </div>
      {showScrollButton && (
        <button
          className={styles.scrollButton}
          type="button"
          onClick={handleScrollToTarget}
          aria-label="Прокрутить вниз"
        >
          ↓
          {newMessageCount > 0 && (
            <span className={styles.badge}>{newMessageCount}</span>
          )}
        </button>
      )}
    </div>
  );
}

export default VirtualScroll;
