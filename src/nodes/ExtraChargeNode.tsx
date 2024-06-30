import { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Node, NodeProps } from "@xyflow/react";
import InputField from "../component/InputField";
import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";

export type ExtraCharge = {
  extraCharge: {
    id: string;
    serviceTax: string;
    coupon: string;
    pointAmount: string;
    pointDetuction: string;
  };
};

export type NodeExtraCharge = Node<ExtraCharge>;

const ExtraChargeNode = memo((props: NodeProps<NodeExtraCharge>) => {
  const { id, data } = props;
  const { setNodes } = useReactFlow();

  const extraChargeData = data?.extraCharge;

  const updateNodeData = (
    nodes: Node<ExtraCharge>[],
    id: string,
    field: keyof ExtraCharge["extraCharge"],
    value: string
  ) => {
    return produce(nodes, (draft) => {
      const node = draft.find((node) => node.id === id);
      if (node && node.data?.extraCharge) {
        node.data.extraCharge[field] = value;
      }
    });
  };

  const createOnChangeHandler = useCallback(
    (field: keyof ExtraCharge["extraCharge"]) =>
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setNodes((nodes) =>
          updateNodeData(nodes as Node<ExtraCharge>[], id, field, value)
        );
      },
    [id, setNodes]
  );

  const createOnChangeHandlerWithValidation = (
    field: keyof ExtraCharge["extraCharge"]
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const regex = /^([0-9]|[1-9][0-9]|100)$/;
      const newValue = e.target.value;

      // If the value is empty, set it to "0"
      if (newValue === "") {
        e.target.value = "0";
        createOnChangeHandler(field)(e);
      } else if (regex.test(newValue)) {
        createOnChangeHandler(field)(e);
      }
    };
  };

  return (
    <>
      <div className='bg-white shadow-xl rounded-lg p-4 w-60 border-2 border-neutral-900'>
        <Handle
          type='source'
          position={Position.Left}
          id={`${id}`}
          className='w-4 h-8 bg-green-500 border-none rounded-md'
        />
        <div className='mb-3'>
          <h1 className='text-xl font-bold text-center text-gray-800'>
            {`💲 額外費用計算 ${extraChargeData?.id}`}
          </h1>
        </div>
        <InputField
          label='平臺服務費(%)'
          type='number'
          value={extraChargeData?.serviceTax ?? ""}
          subfix={"%"}
          onChange={createOnChangeHandlerWithValidation("serviceTax")}
          min={"0"}
          max={"100"}
          className={"text-right"}
        />
        <InputField
          label='折價卷'
          value={extraChargeData?.coupon ?? ""}
          prefix={"NT$"}
          onChange={createOnChangeHandler("coupon")}
        />
        <InputField
          label='點數數量'
          value={extraChargeData?.pointAmount ?? ""}
          prefix={"Point"}
          onChange={createOnChangeHandler("pointAmount")}
        />
        <InputField
          label='點數折抵比例(*點數值多少現金)'
          value={extraChargeData?.pointDetuction ?? ""}
          prefix={"1:"}
          onChange={createOnChangeHandler("pointDetuction")}
        />
      </div>
    </>
  );
});

export default ExtraChargeNode;
