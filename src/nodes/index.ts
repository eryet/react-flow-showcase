import type { Node, NodeTypes } from "@xyflow/react";
import TotalPriceNode from "./TotalPriceNode";
import ProductInfoNode from "./ProductInfoNode";
import ExtraChargeNode from "./ExtraChargeNode";
import { OptionalNodeData } from "../types/initialDataTypes";

export const initialNodes: Node<OptionalNodeData>[] = [
  {
    id: "1",
    type: "total-price-node",
    data: {
      totalPrice: {
        id: "1",
        productTotal: "0",
        finalAmount: "0",
      },
    },
    position: { x: 250, y: 900 },
  },
  {
    id: "2",
    type: "product-info-node",
    data: {
      productInfo: {
        id: "1",
        activityName: "test測試",
        itemName: "test測試",
        actualPrice: "1000",
        promotionPrice: "0",
        amount: "3",
        refundAmount: "1",
        cancellationFee: "1",
        subTotal: "0",
      },
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    type: "product-info-node",
    data: {
      productInfo: {
        id: "2",
        activityName: "test測試",
        itemName: "test測試",
        actualPrice: "1000",
        promotionPrice: "0",
        amount: "3",
        refundAmount: "1",
        cancellationFee: "1",
        subTotal: "0",
      },
    },
    position: { x: 400, y: 100 },
  },
];

export const nodeTypes = {
  "product-info-node": ProductInfoNode,
  "total-price-node": TotalPriceNode,
  "extra-charge-node": ExtraChargeNode,
} satisfies NodeTypes;
