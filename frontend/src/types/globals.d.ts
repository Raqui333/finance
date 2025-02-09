// global.d.ts
declare global {
  type CurrencyType = 'BRL' | 'USD';

  type UserEntry = {
    id?: number;
    createdAt?: number;
    date: string;
    name: string;
    description: string;
    price: number;
  };
}

// Esse arquivo pode ser importado automaticamente, não precisa usar 'import' explicitamente.
export {};
