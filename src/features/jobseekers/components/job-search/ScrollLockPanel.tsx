import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type ScrollLockPanelProps = {
  children: ReactNode;
  className?: string;
  minWidth: number;
  boundaryId?: string;
};

const ScrollLockPanel = ({
  children,
  className = '',
  minWidth,
  boundaryId,
}: ScrollLockPanelProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedStyle, setLockedStyle] = useState<CSSProperties>({});
  const [placeholderHeight, setPlaceholderHeight] = useState<number>();

  const updateLockPosition = useCallback(() => {
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;

    if (!wrapper || !panel) return;

    if (window.innerWidth < minWidth) {
      setIsLocked(false);
      setLockedStyle({});
      setPlaceholderHeight(undefined);
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const shouldLock = wrapperRect.top <= 3;
    const boundary = boundaryId ? document.getElementById(boundaryId) : null;
    const lockedTop = boundary
      ? Math.min(
          3,
          boundary.getBoundingClientRect().bottom - panel.offsetHeight
        )
      : 3;

    setPlaceholderHeight(panel.offsetHeight);
    setIsLocked(shouldLock);
    setLockedStyle(
      shouldLock
        ? {
            left: wrapperRect.left,
            position: 'fixed',
            top: lockedTop,
            width: wrapperRect.width,
            zIndex: 20,
          }
        : {}
    );
  }, [minWidth, boundaryId]);

  useEffect(() => {
    updateLockPosition();
    window.addEventListener('scroll', updateLockPosition, { passive: true });
    window.addEventListener('resize', updateLockPosition);

    return () => {
      window.removeEventListener('scroll', updateLockPosition);
      window.removeEventListener('resize', updateLockPosition);
    };
  }, [updateLockPosition]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={isLocked ? { height: placeholderHeight } : undefined}
    >
      <div ref={panelRef} style={lockedStyle}>
        {children}
      </div>
    </div>
  );
};

export default ScrollLockPanel;
