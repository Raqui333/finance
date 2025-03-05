'use client';

import { Box, Paper, Typography, Skeleton, Button } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import formatCurrency from '@/utils/currency-formatter';
import { getEntriesFromUser, getUserProfile, logout } from '@/utils/actions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setEntry, setName } from '@/redux/features/user/userSlice';

import { useEffect, useState } from 'react';

import NewEntryModal from './modals/NewEntryModal';
import { useRouter } from 'next/navigation';

const flexColumn = {
  display: 'flex',
  flexDirection: 'column',
};

const flexRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const mainBoxStyle = {
  ...flexColumn,
  width: '100%',
  gap: 2,
  '&:hover': {
    filter: 'brightness(1.2)',
  },
};

function calculateTotalBalance(total: number, entry: UserEntry) {
  return total + entry.price;
}

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currency = useAppSelector((state) => state.currency.value);
  const data = useAppSelector((state) => state.user);
  const balance = data.entries.reduce(calculateTotalBalance, 0);

  const [isModalOpen, setModalOpen] = useState(false);
  const addClickHandler = () => setModalOpen(true);
  const closeModalHandler = () => setModalOpen(false);

  const logoutHandler = () => {
    logout()
      .then(() => {
        router.push('/auth/login');
      })
      .catch((err) => console.error(err));
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserProfile()
      .then((res) => {
        dispatch(setName(res.name));
      })
      .catch((err) => console.error(err));

    getEntriesFromUser()
      .then((res) => {
        dispatch(setEntry(res));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [data.name]);

  if (loading) return LoadingProfile();

  return (
    <Box component={Paper} sx={{ ...mainBoxStyle }}>
      <Box sx={{ ...flexRow, gap: 1 }}>
        <AccountCircleIcon sx={{ fontSize: 50 }} />
        <Typography color="primary">Hello, </Typography>
        <Typography>{data.name}</Typography>
      </Box>
      <Box sx={{ ...flexColumn }}>
        <Typography sx={{ fontSize: 15 }}>Account balance</Typography>
        <Typography
          sx={{ fontSize: 35, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AccountBalanceWalletOutlinedIcon color="primary" />
          {formatCurrency(balance, currency)}
        </Typography>
      </Box>
      <Box sx={{ ...flexRow, justifyContent: 'center', gap: 1 }}>
        <Button
          size="small"
          variant="contained"
          onClick={addClickHandler}
          sx={{ flex: 1 }}
        >
          <AddIcon fontSize="small" sx={{ mr: 1 }} />
          New Entry
        </Button>
        <Button size="small" variant="outlined" onClick={logoutHandler}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Log Out
        </Button>
      </Box>
      {isModalOpen ? (
        <NewEntryModal isOpen={isModalOpen} onClose={closeModalHandler} />
      ) : null}
    </Box>
  );
}

function LoadingProfile() {
  return (
    <Box component={Paper} sx={{ ...mainBoxStyle }}>
      <Box sx={{ ...flexRow, gap: 1 }}>
        <Skeleton variant="circular" width={50} height={50} />
        <Skeleton variant="text" width={150} />
      </Box>
      <Box sx={{ ...flexColumn }}>
        <Skeleton variant="text" width={70} />
        <Typography sx={{ fontSize: 35 }}>
          <Skeleton variant="text" width="100%" />
        </Typography>
      </Box>
      <Box sx={{ ...flexRow, justifyContent: 'center', gap: 10 }}>
        <Skeleton variant="circular" width={50} height={50} />
        <Skeleton variant="circular" width={50} height={50} />
      </Box>
    </Box>
  );
}
