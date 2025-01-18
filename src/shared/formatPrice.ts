export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // Opcional: si no quieres mostrar decimales
  }).format(price);
};
