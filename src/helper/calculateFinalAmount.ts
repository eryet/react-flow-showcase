import { Connection } from "@xyflow/react";
import { NodeExtraCharge } from "../nodes/ExtraChargeNode";

const calculateFinalAmount = (
  connections: Connection[],
  nodes: NodeExtraCharge[],
  productTotal: string
): number => {
  let finalAmount = parseFloat(productTotal);

  connections.forEach((connection) => {
    const sourceNode = nodes.find((node) => node.id === connection.source);
    if (sourceNode) {
      const { serviceTax, coupon, pointAmount, pointDetuction } =
        sourceNode.data.extraCharge;
      let amount = finalAmount;

      if (serviceTax) {
        amount *= 1 + parseFloat(serviceTax) / 100;
      }

      if (pointAmount && pointDetuction) {
        const points = parseFloat(pointAmount) * parseFloat(pointDetuction);
        amount -= Math.round(points);
      }

      if (coupon) {
        amount -= parseFloat(coupon);
      }

      finalAmount = amount;
    }
  });

  return Math.max(Math.round(finalAmount), 0);
};

export default calculateFinalAmount;
