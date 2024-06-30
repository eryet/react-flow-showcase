import { OptionalNodeData } from "../types/initialDataTypes";

/**
 * Creates node data based on the provided type and assignId.
 *
 * @param type - The type of node data to create.
 * @param assignId - The ID to assign to the node data.
 * @returns OptionalNodeData - The created node data based on the type.
 * @throws Error - If the provided type is unknown.
 */
const createNodeData = (type: string, assignId: number): OptionalNodeData => {
  switch (type) {
    case "product-info-node":
      return {
        productInfo: {
          id: (assignId + 1).toString(),
          activityName: "",
          itemName: "",
          actualPrice: "0",
          promotionPrice: "0",
          amount: "0",
          refundAmount: "0",
          cancellationFee: "0",
          subTotal: "0",
        },
      };
    case "total-price-node":
      return {
        totalPrice: {
          id: (assignId + 1).toString(),
          productTotal: "0",
          finalAmount: "0",
        },
      };
    case "extra-charge-node":
      return {
        extraCharge: {
          id: (assignId + 1).toString(),
          serviceTax: "5",
          coupon: "0",
          pointAmount: "0",
          pointDetuction: "1",
        },
      };
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
};

export default createNodeData;
