// global.d.ts
declare global {
  type CurrencyType = 'BRL' | 'USD';

  type User = {
    id: number;
    name: string;
    username: string;
    email: string;
  };

  type UserEntry = {
    id: number;
    date: string;
    name: string;
    description: string;
    price: number;
    holder_id: number;
  };

  type UserEntryForPost = Omit<UserEntry, 'id'>;
}

export {};
