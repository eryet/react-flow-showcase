import { useCallback, useRef, useState, DragEvent, useEffect } from "react";
import {
  addEdge,
  Background,
  Controls,
  Edge,
  MiniMap,
  OnConnect,
  Panel,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
  useReactFlow,
  BackgroundVariant,
  Node,
  MarkerType,
  ConnectionMode,
} from "@xyflow/react";
import clsx from "clsx";
import { produce } from "immer";
import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import countMatchingNodesTypes from "./utils/countMatchingNodesTypes";
import createNodeId from "./utils/createNodeId";
import createNodeData from "./utils/createNodeData";
import useLocalNodesHandlers from "./hooks/useLocalNodesHandlers";
import useCustomNodesChanges from "./hooks/useCustomNodesChange";
import Sidebar from "./component/Sidebar";
import GithubLink from "./component/GithubLink";
import { GITHUB_LINK } from "./const/links";

export default function Flow() {
  const reactFlowWrapper = useRef(null);
  const [variant, setVariant] = useState<BackgroundVariant>(
    BackgroundVariant.Dots
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [nodes, setNodes] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const { setViewport } = useReactFlow();
  const { onSave, onInitialSave, onRestore, onInitialRestore, onDelete } =
    useLocalNodesHandlers({
      reactFlowInstance,
      setNodes,
      setEdges,
      setViewport,
    });

  const { customOnNodesChange } = useCustomNodesChanges(setNodes);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const edge = { ...connection, type: "default-edge" };
      setEdges((edges) => addEdge(edge, edges));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance!.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const assignId = countMatchingNodesTypes("type", type, nodes, 0);
      const assignNodeId = createNodeId(nodes.length);
      const nodeData = createNodeData(type, assignId);

      const newNode: Node = {
        id: assignNodeId,
        type,
        data: nodeData,
        position,
      };

      setNodes((nds) =>
        produce(nds, (draft) => {
          draft.push(newNode);
        })
      );
    },
    [nodes, reactFlowInstance, setNodes]
  );

  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVariant = event.target.value as BackgroundVariant;
    setVariant(selectedVariant);
  };

  useEffect(() => {
    onInitialSave();
  }, [onInitialSave]);

  return (
    <>
      <div className='flex-grow h-full' ref={reactFlowWrapper}>
        <GithubLink repoLink={GITHUB_LINK} />
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={customOnNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          connectionMode={ConnectionMode.Strict}
          defaultMarkerColor='#7d7deb'
          defaultEdgeOptions={{
            markerEnd: {
              type: MarkerType.Arrow,
              width: 36,
              height: 36,
            },
          }}
          fitView
        >
          <Background variant={variant} />
          <MiniMap />
          <Controls />
          <Panel position='top-right' className='flex gap-2 items-end'>
            <div>
              <label
                htmlFor='background-variant'
                className='block mb-2 text-sm font-medium text-gray-90'
              >
                選擇背景樣式
              </label>
              <select
                id='background-variant'
                className={clsx(
                  "bg-white border border-gray-800 font-bold",
                  "block w-full p-2.5 text-sm rounded-lg"
                )}
                onChange={handleVariantChange}
              >
                <option value={BackgroundVariant.Lines}>線條</option>
                <option value={BackgroundVariant.Dots}>點狀</option>
                <option value={BackgroundVariant.Cross}>十字</option>
              </select>
            </div>
            <button
              className={clsx(
                "p-2.5 bg-white rounded border border-gray-800",
                "hover:bg-gray-100 text-sm whitespace-nowrap"
              )}
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            >
              {isSidebarVisible ? "✕" : "☰"}
            </button>
          </Panel>
        </ReactFlow>
      </div>
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        onInitialRestore={onInitialRestore}
        onSave={onSave}
        onRestore={onRestore}
        onDelete={onDelete}
      />
    </>
  );
}
