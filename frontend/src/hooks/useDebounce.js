import { useEffect, useState } from "react";

/**
 * Returns `value`, but only after it has stopped changing for `delay` ms.
 * Used so the search box does not call the API on every keystroke.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // restart the wait if the user types again
  }, [value, delay]);

  return debounced;
}
