import { useCallback, useEffect } from "react";
import { Connection, useHandleConnections, useStoreApi } from "@xyflow/react";
import { Node } from "@xyflow/react";
import { NodeTotalPrice } from "../nodes/TotalPriceNode";
import { NodeExtraCharge } from "../nodes/ExtraChargeNode";
import { produce } from "immer";
import calculateFinalAmount from "../helper/calculateFinalAmount";

const useExtraChargeConnections = (
  id: string,
  getNode: (id: string) => Node | undefined,
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void,
  productTotal: string
) => {
  const { subscribe } = useStoreApi();

  const onConnect = useCallback((connections: Connection[]) => {
    return connections;
  }, []);

  const onDisconnect = useCallback((connections: Connection[]) => {
    return connections;
  }, []);

  // life changing hook from v12 thanks react flow
  const extraChargeConnections = useHandleConnections({
    type: "target",
    id: `ec-${id}`,
    onConnect,
    onDisconnect,
  });

  const updateFinal = useCallback(() => {
    setNodes((nodes) => {
      if (extraChargeConnections.length > 0) {
        const finalAmount = calculateFinalAmount(
          extraChargeConnections,
          nodes as NodeExtraCharge[],
          productTotal
        );
        return produce(nodes as NodeTotalPrice[], (draft) => {
          const node = draft.find((node) => node.id === id);
          if (node && node.data?.totalPrice) {
            node.data.totalPrice.finalAmount = finalAmount.toString();
          }
        });
      }
      return produce(nodes as NodeTotalPrice[], (draft) => {
        const node = draft.find((node) => node.id === id);
        if (node && node.data?.totalPrice) {
          node.data.totalPrice.finalAmount = "0";
        }
      });
    });
  }, [extraChargeConnections, id, productTotal, setNodes]);

  useEffect(() => {
    if (extraChargeConnections.length === 0) return;

    const latestConnection =
      extraChargeConnections[extraChargeConnections.length - 1];
    const latestNode = getNode(latestConnection.source);

    if (!latestNode || latestNode.type !== "extra-charge-node") return;

    const unsubscribe = subscribe((state, prevState) => {
      // ! prevState.nodes might be undefined on first load if data is recover from localStroge
      // ! there is no "prevState" on first load
      if (prevState.nodes.length === 0) return;
      const nodes = state.nodes as Node[];
      const prevNodes = prevState.nodes as Node[];
      const relevantSources = extraChargeConnections.map((edge) => edge.source);
      const relevantNodes = nodes.filter((node) =>
        relevantSources.includes(node.id)
      );
      const prevRelevantNodes = prevNodes.filter((node) =>
        relevantSources.includes(node.id)
      );

      relevantNodes.forEach((node, index) => {
        if (prevRelevantNodes[index] === undefined) return;
        const prevNode = prevRelevantNodes[index];
        if (node.data.extraCharge !== prevNode.data.extraCharge) {
          updateFinal();
        }
      });
      return () => {
        unsubscribe();
      };
    });
  }, [extraChargeConnections, getNode, subscribe, updateFinal]);

  return { extraChargeConnections, updateFinal };
};

export default useExtraChargeConnections;
