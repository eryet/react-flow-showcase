import React from "react";
import { useCallback } from "react";
import { ReactFlowInstance } from "@xyflow/react";
import { Node, Edge } from "@xyflow/react";
import { Viewport, ViewportHelperFunctionOptions } from "@xyflow/react";

type SetViewport = (
  viewport: Viewport,
  options?: ViewportHelperFunctionOptions
) => void;

type UseLocalNodesHandlersProps = {
  reactFlowInstance: ReactFlowInstance | null;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setViewport: SetViewport;
};

// Note: The storage event is only triggered when a window other than itself makes the changes.
// manual send storage event into current tab
// https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.storageeventinit.html
// https://stackoverflow.com/a/65348883
// RaenonX 大佬解答 https://media.discordapp.net/attachments/760344458238885931/1254757854330486784/image.png?ex=667aa7d0&is=66795650&hm=fe31d0d63873f31d7a65c1ebaf6077c1d741c955c7791ea80d49d2e2edf23ec2&=&format=webp&quality=lossless&width=923&height=910
/**
 * Custom hook that provides functions for saving, restoring, and deleting data related to nodes in a React Flow instance.
 * @param reactFlowInstance The React Flow instance to interact with
 * @param setNodes Function to set the nodes in the React Flow instance
 * @param setEdges Function to set the edges in the React Flow instance
 * @param setViewport Function to set the viewport in the React Flow instance
 * @returns Object containing functions for saving, restoring, and deleting node data
 */
const useLocalNodesHandlers = ({
  reactFlowInstance,
  setNodes,
  setEdges,
  setViewport,
}: UseLocalNodesHandlersProps) => {
  const onSave = useCallback(
    (key: string) => {
      if (reactFlowInstance) {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(key, JSON.stringify(flow));
        window.dispatchEvent(new StorageEvent("storage", { key: key }));
        // window.dispatchEvent(
        //   new CustomEvent("localstorage-update", { detail: { key } })
        // );
      }
    },
    [reactFlowInstance]
  );

  const onInitialSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem("initial-node", JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onInitialRestore = useCallback(() => {
    const restoreFlow = async () => {
      if (!localStorage.getItem("initial-node")) {
        return;
      }
      const initialState = localStorage.getItem("initial-node");

      const flow = JSON.parse(initialState!);

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setEdges, setNodes, setViewport]);

  const onRestore = useCallback(
    (key: string) => {
      const restoreFlow = async () => {
        if (!localStorage.getItem(key)) {
          return;
        }
        const initialState = localStorage.getItem(key);

        const flow = JSON.parse(initialState!);

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });
        }
      };

      restoreFlow();
    },
    [setEdges, setNodes, setViewport]
  );

  const onDelete = useCallback((key: string) => {
    if (!localStorage.getItem(key)) {
      return;
    }
    localStorage.removeItem(key);
    window.dispatchEvent(new StorageEvent("storage", { key: key }));
    // window.dispatchEvent(
    //   new CustomEvent("localstorage-update", { detail: { key } })
    // );
  }, []);

  return { onSave, onInitialSave, onRestore, onInitialRestore, onDelete };
};

export default useLocalNodesHandlers;
