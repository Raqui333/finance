'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrency } from '@/redux/features/currency/currencySlice';
import { CurrencyType } from '@/redux/features/currency/currencySlice';

import { Box, IconButton } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import { keyframes } from '@emotion/react';

const flipAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
`;

export default function ChangeCurrency() {
  const [rotateState, setRotate] = useState(false);
  const dispatch = useAppDispatch();

  const handleFlagClick = (currency: CurrencyType) => {
    setRotate(true);
    dispatch(setCurrency(currency));
    setTimeout(() => setRotate(false), 500);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        color="primary"
        onClick={() => handleFlagClick('BRL')}
        sx={{ fontSize: '20px' }}
      >
        🇧🇷 BRL
      </IconButton>
      <CurrencyExchangeIcon
        sx={{
          animation: rotateState ? `${flipAnimation} 0.5s linear 1` : 'none',
        }}
      />
      <IconButton
        color="primary"
        onClick={() => handleFlagClick('USD')}
        sx={{ fontSize: '20px' }}
      >
        🇺🇸 USD
      </IconButton>
    </Box>
  );
}
