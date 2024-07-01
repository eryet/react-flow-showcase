/**
 * Takes an array of keys and checks if each key exists in the localStorage.
 * Returns an object with each key as a property and a boolean value indicating if the key exists in the localStorage.
 *
 * @param keys An array of strings representing the keys to check in the localStorage.
 * @returns An object with keys as properties and boolean values indicating if they exist in the localStorage.
 */

export const checkMultipleKeys = (keys: string[]) => {
  return keys.reduce((acc, key) => {
    acc[key] = Boolean(localStorage.getItem(key) !== null);
    return acc;
  }, {});
};
