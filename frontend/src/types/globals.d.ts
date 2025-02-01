// global.d.ts
declare global {
  type CurrencyType = 'BRL' | 'USD';

  type UserEntry = {
    date: number;
    name: string;
    desc: string;
    price: number;
  };
}

// Esse arquivo pode ser importado automaticamente, não precisa usar 'import' explicitamente.
export {};
