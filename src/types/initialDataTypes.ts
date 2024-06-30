import { AllOptional } from "./genericTypes";
import {
  IProductInfoNode,
  IExtraChargeNode,
  ITotalPriceNodeNode,
} from "./nodeInterfaces";

// type NodeData = {
//   [key: string]: string | undefined;
// };

// https://stackoverflow.com/a/70981559
// export type NodeData =
//   | { productInfo: ProductInfo["productInfo"]; totalPrice?: never }
//   | { totalPrice: TotalPrice["totalPrice"]; productInfo?: never };

type ProductInfoInitialNode = AllOptional<IProductInfoNode>;

type TotalPriceInitialNode = AllOptional<ITotalPriceNodeNode>;

type ExtraChargeInitialNode = AllOptional<IExtraChargeNode>;

export type OptionalNodeData =
  | ProductInfoInitialNode
  | TotalPriceInitialNode
  | ExtraChargeInitialNode;
