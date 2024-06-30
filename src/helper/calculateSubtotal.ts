import { ProductInfo } from "../nodes/ProductInfoNode";

const calculateSubTotal = (data: ProductInfo["productInfo"]) => {
  const effectivePrice = parseFloat(
    data.promotionPrice && data.promotionPrice !== "0"
      ? data.promotionPrice
      : data.actualPrice ?? "0"
  );
  const amount = parseFloat(data.amount ?? "0");
  const refundAmount = parseFloat(data.refundAmount ?? "0");
  const cancellationFee = parseFloat(data.cancellationFee ?? "0");

  const subTotal =
    effectivePrice * amount - refundAmount * effectivePrice - cancellationFee;

  return isNaN(subTotal) || subTotal < 0 ? "0" : subTotal.toString();
};

export default calculateSubTotal;
