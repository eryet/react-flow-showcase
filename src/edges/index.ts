import type { Edge, EdgeTypes } from "@xyflow/react";
import DefaultEdge from "./DefaultEdge";

export const initialEdges = [
  // { id: "1->3", type: "product-to-total", source: "1", target: "3" },
] satisfies Edge[];

export const edgeTypes = {
  "default-edge": DefaultEdge,
} satisfies EdgeTypes;
