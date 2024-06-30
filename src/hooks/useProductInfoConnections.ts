import { useEffect, useCallback } from "react";
import {
  useStoreApi,
  useHandleConnections,
  Connection,
  Node,
} from "@xyflow/react";
import calculateTotalSubTotal from "../helper/calculateTotalSubtotal";
import { NodeProductInfo } from "../nodes/ProductInfoNode";
import { NodeData } from "../types/nodeInterfaces";
import { produce } from "immer";
import { NodeTotalPrice } from "../nodes/TotalPriceNode";

export const useProductInfoConnections = (
  id: string,
  getNode: (id: string) => Node | undefined,
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void
) => {
  const { subscribe } = useStoreApi();

  // connection for side effect
  const onConnect = useCallback((connections: Connection[]) => {
    return connections;
  }, []);

  // connection for side effect
  const onDisconnect = useCallback((connections: Connection[]) => {
    return connections;
  }, []);

  // life changing hook from v12 thanks react flow
  const productInfoConnections = useHandleConnections({
    type: "target",
    id: `tp-${id}`,
    onConnect,
    onDisconnect,
  });

  const updateTotal = useCallback(() => {
    setNodes((nodes) => {
      if (productInfoConnections.length > 0) {
        const totalSubTotal = calculateTotalSubTotal(
          productInfoConnections,
          nodes as NodeProductInfo[]
        );
        return produce(nodes as NodeTotalPrice[], (draft) => {
          const node = draft.find((node) => node.id === id);
          if (node && node.data?.totalPrice) {
            node.data.totalPrice.productTotal = totalSubTotal.toString();
          }
        });
      }
      return produce(nodes as NodeTotalPrice[], (draft) => {
        const node = draft.find((node) => node.id === id);
        if (node && node.data?.totalPrice) {
          node.data.totalPrice.productTotal = "0";
        }
      });
    });
  }, [productInfoConnections, id, setNodes]);

  // side effect that will run when there is any connection from product-info-node
  useEffect(() => {
    if (productInfoConnections.length === 0) return;

    const latestConnection =
      productInfoConnections[productInfoConnections.length - 1];
    const latestNode = getNode(latestConnection.source);

    if (!latestNode || latestNode.type !== "product-info-node") return;

    const unsubscribe = subscribe((state, prevState) => {
      // ! prevState.nodes might be undefined on first load if data is recover from localStroge
      // ! there is no "prevState" on first load
      if (prevState.nodes.length === 0) return;
      const nodes = state.nodes as Node<NodeData>[];
      const prevNodes = prevState.nodes as Node<NodeData>[];
      const relevantSources = productInfoConnections.map((edge) => edge.source);

      const relevantNodes = nodes.filter((node) =>
        relevantSources.includes(node.id)
      );
      const prevRelevantNodes = prevNodes.filter((node) =>
        relevantSources.includes(node.id)
      );

      // https://stackoverflow.com/a/74134370
      // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-in-operator-narrowing
      // 'in' can use as type guard for union types
      relevantNodes.forEach((node, index) => {
        const prevNode = prevRelevantNodes[index];

        if (
          "subTotal" in node.data.productInfo &&
          "subTotal" in prevNode.data.productInfo
        ) {
          const currentHasSubtotal = node.data.productInfo.subTotal;
          const prevHasSubtotal = prevNode.data.productInfo.subTotal;

          if (currentHasSubtotal !== prevHasSubtotal) {
            updateTotal();
          }
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, [getNode, productInfoConnections, subscribe, updateTotal]);

  return { productInfoConnections, updateTotal };
};
