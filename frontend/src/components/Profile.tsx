'use client';

import { Box, Paper, Typography, IconButton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import formatCurrency from '@/utils/currency-formatter';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { addEntry, setBalance } from '@/redux/features/user/userSlice';

function createData(date: number, name: string, desc: string, price: number) {
  console.log(date);
  return { date, name, desc, price };
}

export default function Profile() {
  const dispatch = useAppDispatch();

  const currency = useAppSelector((state) => state.currency.value);
  const user = useAppSelector((state) => state.user);

  const companies = [
    'Tesla',
    'Google',
    'Apple',
    'Amazon',
    'Space X',
    'Samsung',
    'Petrobras',
    'Microsoft',
    'Meta',
    'Nvidia',
    'IBM',
    'Intel',
    'Sony',
    'Netflix',
    'Oracle',
    'Uber',
    'Airbnb',
    'Coca-Cola',
    'Disney',
    'Nike',
    'Ford',
    'BMW',
    'Honda',
    'Siemens',
    'Adobe',
    'Dell',
    'Huawei',
  ];

  const addClickHandler = () => {
    // generate random for now
    const randomCompany =
      companies[Math.floor(Math.random() * companies.length)];
    const new_data = createData(
      Date.now(),
      randomCompany,
      `Stock of ${randomCompany}`,
      50
    );
    dispatch(addEntry(new_data));
    dispatch(setBalance(new_data.price));
  };

  return (
    <Box
      component={Paper}
      sx={{
        '&:hover': {
          filter: 'brightness(1.1)',
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 50 }} />
        <Typography>Hello, {user.name}</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography sx={{ fontSize: 15 }}>Balance</Typography>
        <Typography sx={{ fontSize: 35 }}>
          {formatCurrency(user.balance, currency)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <IconButton>
          <AddCircleIcon
            sx={{ fontSize: 40, color: 'primary.main' }}
            onClick={() => addClickHandler()}
          />
        </IconButton>
        <IconButton>
          <RemoveCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
