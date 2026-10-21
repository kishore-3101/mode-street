import { useState, useEffect, useCallback, useRef } from 'react';

interface UseHeroSlideshowOptions {
  totalSlides: number;
  intervalMs?: number;
}

export function useHeroSlideshow({ totalSlides, intervalMs = 3000 }: UseHeroSlideshowOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isTabHidden, setIsTabHidden] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.visibilityState === 'hidden';
  });

  // Monitor prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Monitor document visibility (tab hidden)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibilityChange = () => {
      setIsTabHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Compute safe index
  const safeCurrentIndex = totalSlides > 0 && currentIndex >= totalSlides ? 0 : currentIndex;

  // Reset active index to 0 when slide count updates (e.g. data arrives from API)
  const prevTotalRef = useRef(totalSlides);
  useEffect(() => {
    if (prevTotalRef.current !== totalSlides) {
      prevTotalRef.current = totalSlides;
      setCurrentIndex(0);
    }
  }, [totalSlides]);

  const goToSlide = useCallback(
    (index: number) => {
      if (totalSlides <= 0) return;
      const nextIdx = ((index % totalSlides) + totalSlides) % totalSlides;
      setCurrentIndex(nextIdx);
    },
    [totalSlides]
  );

  const nextSlide = useCallback(() => {
    goToSlide(safeCurrentIndex + 1);
  }, [goToSlide, safeCurrentIndex]);

  const prevSlide = useCallback(() => {
    goToSlide(safeCurrentIndex - 1);
  }, [goToSlide, safeCurrentIndex]);

  // Autoplay logic
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Disable autoplay if only 1 slide, motion reduced, hovered, focused, or tab hidden
    const shouldAutoplay =
      totalSlides > 1 &&
      !prefersReducedMotion &&
      !isHovered &&
      !isFocused &&
      !isTabHidden;

    if (!shouldAutoplay) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [totalSlides, prefersReducedMotion, isHovered, isFocused, isTabHidden, intervalMs]);

  return {
    currentIndex: safeCurrentIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    setIsHovered,
    setIsFocused,
    prefersReducedMotion,
    isPaused: totalSlides <= 1 || prefersReducedMotion || isHovered || isFocused || isTabHidden,
  };
}
