'use client';

import { Box, Paper, Typography, IconButton, alpha } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import formatCurrency from '@/utils/currency-formatter';
import { useAppSelector } from '@/redux/hooks';

import InsertNewEntry from './modals/InsertNewEntry';
import { useState } from 'react';

export default function Profile() {
  const currency = useAppSelector((state) => state.currency.value);
  const user = useAppSelector((state) => state.user);

  const [isModalOpen, setModalOpen] = useState(false);

  const addClickHandler = () => setModalOpen(true);
  const closeModalHandler = () => setModalOpen(false);

  return (
    <Box
      component={Paper}
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.01),
        },
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      })}
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
        <IconButton onClick={addClickHandler}>
          <AddCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </IconButton>
        <IconButton>
          <RemoveCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </IconButton>
      </Box>
      {isModalOpen ? (
        <InsertNewEntry isOpen={isModalOpen} onClose={closeModalHandler} />
      ) : null}
    </Box>
  );
}
