export default function formatCurrency(
  value: number = 0,
  currency: CurrencyType
) {
  if (value === null) value = 0;

  const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';

  return value.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
  });
}
