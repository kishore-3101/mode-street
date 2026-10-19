import { useEffect } from 'react';

/**
 * Updates document.title and restores the previous title on unmount.
 */
export function useDocumentTitle(title: string | undefined | null) {
  useEffect(() => {
    if (!title) return;
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
