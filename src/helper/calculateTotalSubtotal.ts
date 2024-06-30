import { Node } from "@xyflow/react";
import { Connection } from "@xyflow/react";
import { NodeProductInfo } from "../nodes/ProductInfoNode";

const calculateTotalSubTotal = (
  connections: Connection[],
  nodes: NodeProductInfo[]
) => {
  return connections.reduce((total, connection) => {
    const sourceNode = nodes.find(
      (node: Node) => node.id === connection.source
    );
    if (sourceNode && sourceNode.data && sourceNode.data.productInfo) {
      const subTotal = parseFloat(sourceNode.data.productInfo.subTotal ?? "0");
      return total + (isNaN(subTotal) ? 0 : subTotal);
    }
    return total;
  }, 0);
};

export default calculateTotalSubTotal;
