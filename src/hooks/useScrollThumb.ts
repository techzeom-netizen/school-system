import { useCallback, useEffect, useRef, useState } from 'react';

type ScrollThumbState = {
  height: number;
  top: number;
  visible: boolean;
};

type UseScrollThumbOptions = {
  minThumbHeight?: number;
  trackPadding?: number;
};

const hiddenScrollThumb: ScrollThumbState = {
  height: 0,
  top: 0,
  visible: false,
};

const useScrollThumb = <TElement extends HTMLElement>(
  refreshKey?: unknown,
  { minThumbHeight = 72, trackPadding = 16 }: UseScrollThumbOptions = {}
) => {
  const scrollRef = useRef<TElement | null>(null);
  const [scrollThumb, setScrollThumb] =
    useState<ScrollThumbState>(hiddenScrollThumb);

  const updateScrollThumb = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    const { clientHeight, scrollHeight, scrollTop } = element;

    if (scrollHeight <= clientHeight) {
      setScrollThumb(current =>
        current.visible ? hiddenScrollThumb : current
      );
      return;
    }

    const trackHeight = clientHeight - trackPadding * 2;
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * trackHeight,
      minThumbHeight
    );
    const maxScrollTop = scrollHeight - clientHeight;
    const maxThumbTop = trackHeight - thumbHeight;
    const thumbTop =
      trackPadding + (scrollTop / maxScrollTop) * Math.max(maxThumbTop, 0);

    setScrollThumb({
      height: thumbHeight,
      top: thumbTop,
      visible: true,
    });
  }, [minThumbHeight, trackPadding]);

  useEffect(() => {
    updateScrollThumb();

    window.addEventListener('resize', updateScrollThumb);

    return () => {
      window.removeEventListener('resize', updateScrollThumb);
    };
  }, [updateScrollThumb, refreshKey]);

  return {
    scrollRef,
    scrollThumb,
    updateScrollThumb,
  };
};

export default useScrollThumb;
