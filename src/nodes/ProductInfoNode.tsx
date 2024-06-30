import React, { memo, useEffect, useCallback } from "react";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import InputField from "../component/InputField";
import calculateSubTotal from "../helper/calculateSubtotal";
import { Node } from "@xyflow/react";
import { produce } from "immer";

export type input = string | number | undefined | null;

export type ProductInfo = {
  productInfo: {
    id: string;
    activityName: string;
    itemName: string;
    actualPrice: string;
    amount: string;
    promotionPrice: string;
    refundAmount: string;
    cancellationFee: string;
    subTotal: string;
  };
};

export type NodeProductInfo = Node<ProductInfo>;

const ProductInfoNode = memo(({ id, data }: NodeProps<NodeProductInfo>) => {
  const { setNodes, getNode } = useReactFlow();

  useEffect(() => {
    setNodes((nodes) => {
      return produce(nodes as NodeProductInfo[], (draft) => {
        const node = draft.find((node) => node.id === id);
        if (node && node.data?.productInfo) {
          node.data.productInfo.subTotal = calculateSubTotal(
            node.data.productInfo
          );
        }
      });
    });
  }, [id, setNodes]);

  const updateNodeData = useCallback(
    (id: string, field: keyof ProductInfo["productInfo"], value: string) => {
      setNodes((nodes) =>
        produce(nodes as NodeProductInfo[], (draft) => {
          const node = draft.find((node) => node.id === id);
          if (node && node.data?.productInfo) {
            node.data.productInfo[field] = value;
            node.data.productInfo.subTotal = calculateSubTotal(
              node.data.productInfo
            );
          }
        })
      );
    },
    [setNodes]
  );

  const createOnChangeHandler = useCallback(
    (field: keyof ProductInfo["productInfo"]) =>
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        updateNodeData(id, field, value);
      },
    [id, updateNodeData]
  );

  const productData = data?.productInfo;

  return (
    <div className='bg-white shadow-xl rounded-lg p-4 w-60 border-2 border-neutral-900'>
      <div className='mb-3'>
        <h1 className='text-xl font-bold text-center text-gray-800'>
          {`🏷️ 商品 ${productData?.id}`}
        </h1>
      </div>
      <InputField
        label='活動名稱'
        value={productData?.activityName ?? ""}
        onChange={createOnChangeHandler("activityName")}
      />
      <InputField
        label='方案項目'
        value={productData?.itemName ?? ""}
        onChange={createOnChangeHandler("itemName")}
      />
      <InputField
        label='市售價'
        type='number'
        prefix='NT$'
        min={"0"}
        value={productData?.actualPrice ?? ""}
        onChange={createOnChangeHandler("actualPrice")}
      />
      <InputField
        label='優惠價'
        type='number'
        prefix='NT$'
        min={"0"}
        value={productData?.promotionPrice ?? ""}
        onChange={createOnChangeHandler("promotionPrice")}
      />
      <InputField
        label='數量'
        type='number'
        min={"0"}
        value={productData?.amount ?? ""}
        onChange={createOnChangeHandler("amount")}
      />
      <InputField
        label='退款數量'
        type='number'
        min={"0"}
        value={productData?.refundAmount ?? ""}
        onChange={createOnChangeHandler("refundAmount")}
      />
      <InputField
        label='取消行政費用'
        type='number'
        min={"0"}
        prefix='NT$'
        value={productData?.cancellationFee ?? ""}
        onChange={createOnChangeHandler("cancellationFee")}
      />
      <InputField
        label='金額小計'
        prefix='NT$'
        min={"0"}
        value={productData?.subTotal ?? ""}
        disabled
      />
      <Handle
        type='source'
        isValidConnection={(connection) => {
          const node = getNode(connection.target);
          return node?.type === "total-price-node";
        }}
        position={Position.Bottom}
        id={`${id}`}
        className='w-8 h-4 bg-blue-500 border-none rounded-md'
      />
    </div>
  );
});

export default ProductInfoNode;
