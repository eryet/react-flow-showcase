import {
  BaseEdge,
  getStraightPath,
  EdgeLabelRenderer,
  useReactFlow,
} from "@xyflow/react";

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <button
          className={
            "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-2 rounded nodrag nopan"
          }
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        >
          ❌ 刪除
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
