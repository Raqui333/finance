export default function formatCurrency(
  value: number | null,
  currency: CurrencyType
) {
  if (value === null) return 'none';

  const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';

  return value.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
  });
}
