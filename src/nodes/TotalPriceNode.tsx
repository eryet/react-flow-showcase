import { memo, useEffect } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import InputField from "../component/InputField";
import { useProductInfoConnections } from "../hooks/useProductInfoConnections";
import useExtraChargeConnections from "../hooks/useExtraChargeConnections";

export type TotalPrice = {
  totalPrice: {
    id: string;
    productTotal: string;
    finalAmount: string;
  };
};

export type NodeTotalPrice = Node<TotalPrice>;

// * sourcee should handle validation check from target whether id is matched or not
const TotalPriceNode = memo((props: NodeProps<NodeTotalPrice>) => {
  const { id, data } = props;
  const { getNode, setNodes } = useReactFlow();

  const { productInfoConnections, updateTotal } = useProductInfoConnections(
    id,
    getNode,
    setNodes
  );
  const { extraChargeConnections, updateFinal } = useExtraChargeConnections(
    id,
    getNode,
    setNodes,
    data.totalPrice.productTotal
  );

  useEffect(() => {
    updateTotal();
  }, [productInfoConnections, id, setNodes, updateTotal]);

  useEffect(() => {
    updateFinal();
  }, [extraChargeConnections, id, setNodes, updateFinal]);

  const totalPriceData = data?.totalPrice;

  return (
    <div className='bg-white shadow-xl rounded-lg p-4 w-60 border-2 border-neutral-900'>
      <div className='mb-3'>
        <h1 className='text-xl font-bold text-center text-gray-800'>
          {"💳 總計"}
        </h1>
      </div>
      <InputField
        label='金額小計'
        prefix='NT$'
        type={"number"}
        value={totalPriceData.productTotal ?? ""}
        disabled
      />
      <InputField
        label='最後金額'
        prefix='NT$'
        type={"number"}
        value={totalPriceData.finalAmount ?? ""}
        disabled
      />
      <Handle
        type='target'
        id={`tp-${id}`}
        position={Position.Top}
        isValidConnection={(connection) => {
          const node = getNode(connection.source);
          return node?.type === "product-info-node";
        }}
        className='w-8 h-4 bg-blue-500 border-none rounded-md'
      />
      <Handle
        type='target'
        id={`ec-${id}`}
        isConnectable={extraChargeConnections.length === 0}
        isValidConnection={(connection) => {
          const node = getNode(connection.source);
          return node?.type === "extra-charge-node";
        }}
        position={Position.Right}
        className='w-4 h-8 bg-green-500 border-none rounded-md'
      />
    </div>
  );
});

export default TotalPriceNode;
