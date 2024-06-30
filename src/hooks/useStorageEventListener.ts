import { useState, useEffect, useCallback } from "react";

// https://stackoverflow.com/a/71410902
// https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent
// StorageEvent only trigger in different window
const useStorageEventListener = (key: string) => {
  const [isKeySet, setIsKeySet] = useState(() =>
    Boolean(localStorage.getItem(key) !== null)
  );

  const checkKey = useCallback(() => {
    setIsKeySet(Boolean(localStorage.getItem(key) !== null));
  }, [key]);

  useEffect(() => {
    // no StorageEvent type and i dont know ways to create one
    const storageHandler = (event) => {
      if (event.key === key) {
        checkKey();
      }
    };
    window.addEventListener("storage", storageHandler);

    checkKey();

    return () => {
      window.removeEventListener("storage", storageHandler);
    };
  }, [checkKey, key]);

  return { isKeySet, checkKey };
};

export default useStorageEventListener;
