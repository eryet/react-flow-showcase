import { NodeChange, Node } from "@xyflow/react";
import { produce } from "immer";
import { WritableDraft } from "immer";

// ! onNodesChange from react flow dint make dimensionm immutable

/**
 * Custom hook for managing changes to an array of Node objects. onNodesChange from useNodesState dint cover dimension usage well
 *
 * @param setNodes A function to update the array of Node objects.
 *
 * @returns An object with a function 'customOnNodesChange' that applies changes to the array of Node objects based on an array of NodeChange objects.
 */
const useCustomNodesChanges = (
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void
) => {
  const applyNodeChange = (
    change: NodeChange,
    draft: WritableDraft<Node> | WritableDraft<Node>[]
  ): WritableDraft<Node> | null => {
    switch (change.type) {
      case "select":
        (draft as WritableDraft<Node>).selected = change.selected;
        break;
      case "position":
        if (typeof change.position !== "undefined") {
          (draft as WritableDraft<Node>).position = change.position;
        }
        if (typeof change.dragging !== "undefined") {
          (draft as WritableDraft<Node>).dragging = change.dragging;
        }
        break;
      case "dimensions":
        if (typeof change.dimensions !== "undefined") {
          (draft as WritableDraft<Node>).measured = produce(
            (draft as WritableDraft<Node>).measured ?? {},
            (measuredDraft) => {
              measuredDraft.width = change.dimensions!.width;
              measuredDraft.height = change.dimensions!.height;
            }
          );
          if (change.setAttributes) {
            (draft as WritableDraft<Node>).width = change.dimensions.width;
            (draft as WritableDraft<Node>).height = change.dimensions.height;
          }
        }
        if (typeof change.resizing === "boolean") {
          (draft as WritableDraft<Node>).resizing = change.resizing;
        }
        break;
      case "remove":
        return null;
      case "add":
        (draft as WritableDraft<Node>[]).push(change.item);
        break;
      case "replace":
        return change.item;
      default:
        break;
    }
    return draft as WritableDraft<Node>;
  };

  const customOnNodesChange = (changes: NodeChange[]) => {
    setNodes((currentNodes) =>
      produce(currentNodes, (draft) => {
        changes.forEach((change) => {
          if (change.type === "add") {
            const index = draft.findIndex((n) => n.id === change.item.id);
            if (index === -1) {
              draft.push(change.item);
            }
          } else if (change.id) {
            const index = draft.findIndex((n) => n.id === change.id);
            if (index !== -1) {
              if (change.type === "remove") {
                draft.splice(index, 1);
              } else {
                const updatedNode = applyNodeChange(change, draft[index]);
                if (updatedNode) {
                  draft[index] = updatedNode;
                } else {
                  draft.splice(index, 1);
                }
              }
            }
          }
        });
      })
    );
  };

  return { customOnNodesChange };
};

export default useCustomNodesChanges;
