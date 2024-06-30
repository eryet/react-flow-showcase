/**
 * Function to create a unique node ID based on the input ID.
 *
 * @param id - The input ID to generate the node ID from.
 * @returns A string representing the unique node ID.
 */
const createNodeId = (id: number) => {
  return (id + 1).toString();
};

export default createNodeId;
