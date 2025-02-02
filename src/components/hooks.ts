import { useRef } from "react";

export const useDebouncedCallback = <T>(
  callback: (params: T) => void,
  delay: number,
) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  return (params: T) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback(params);
    }, delay);
  };
};
