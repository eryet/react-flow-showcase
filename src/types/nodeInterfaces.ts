import { ProductInfo } from "../nodes/ProductInfoNode";
import { TotalPrice } from "../nodes/TotalPriceNode";
import { ExtraCharge } from "../nodes/ExtraChargeNode";

export interface IProductInfoNode
  extends Record<string, ProductInfo["productInfo"]> {
  productInfo: ProductInfo["productInfo"];
}

export interface ITotalPriceNodeNode
  extends Record<string, TotalPrice["totalPrice"]> {
  totalPrice: TotalPrice["totalPrice"];
}

export interface IExtraChargeNode
  extends Record<string, ExtraCharge["extraCharge"]> {
  extraCharge: ExtraCharge["extraCharge"];
}

export type NodeData =
  | IProductInfoNode
  | ITotalPriceNodeNode
  | IExtraChargeNode;
