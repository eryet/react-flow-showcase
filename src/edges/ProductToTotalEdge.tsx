import { BaseEdge, getStraightPath } from "@xyflow/react";

export default function ProductToTotal({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
      />
    </>
  );
}
