import { Node } from "@xyflow/react";

/**
 * Counts the number of nodes in an array that have a specific key-value pair.
 *
 * @param key The key to match against.
 * @param value The value to match against.
 * @param nodes An array of nodes to search through.
 * @param initialValues The initial value to start counting from.
 * @returns The total count of nodes that match the given key-value pair.
 */
const countMatchingNodesTypes = (
  key: string,
  value: string,
  nodes: Node[],
  initialValues: number
) => {
  return nodes.reduce((count, obj) => {
    if (obj[key] === value) {
      count += 1;
    }
    return count;
  }, initialValues);
};

export default countMatchingNodesTypes;
