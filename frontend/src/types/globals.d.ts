// global.d.ts
declare global {
  type FinanceEntriesType = {
    date: number;
    name: string;
    desc: string;
    price: number;
  };

  type DatasetType = {
    date: number;
    name: string;
    desc: string;
    price: number;
  };

  type CurrencyType = 'BRL' | 'USD';
}

// Esse arquivo pode ser importado automaticamente, não precisa usar 'import' explicitamente.
export {};
