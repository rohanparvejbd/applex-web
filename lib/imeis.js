/** IMEIs that can be sold on ecommerce (in stock + ecommerce stock). */
export function getSellableImeis(imeis) {
  return (Array.isArray(imeis) ? imeis : []).filter(
    (i) => Number(i?.in_stock) === 1 && Number(i?.ecommerce_stock) === 1
  );
}
