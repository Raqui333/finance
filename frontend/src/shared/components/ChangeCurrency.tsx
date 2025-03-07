'use client';

import React from 'react';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/shared/store/hooks';
import { setCurrency } from '@/shared/store/features/currency/currencySlice';

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

const CURRENCIES = {
  BRL: '🇧🇷 BRL',
  USD: '🇺🇸 USD',
};

export default function ChangeCurrency() {
  const [rotateState, setRotate] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Cleanup timeout on unmount or state change
    if (rotateState) {
      const timeout = setTimeout(() => setRotate(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [rotateState]);

  const handleFlagClick = (currency: CurrencyType) => {
    setRotate(true);
    dispatch(setCurrency(currency));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {Object.entries(CURRENCIES).map(([currency, flag], index) => (
        <React.Fragment key={currency}>
          <IconButton
            color="primary"
            onClick={() => handleFlagClick(currency as CurrencyType)}
            sx={{ fontSize: '20px' }}
          >
            {flag}
          </IconButton>
          {index === 0 ? (
            <CurrencyExchangeIcon
              sx={{
                animation: rotateState
                  ? `${flipAnimation} 0.5s linear 1`
                  : 'none',
              }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </Box>
  );
}
