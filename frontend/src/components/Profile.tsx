'use client';

import { Box, Paper, Typography, IconButton, Skeleton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import formatCurrency from '@/utils/currency-formatter';
import { getEntriesFromUser, getUserProfile } from '@/utils/actions';
import { useAppSelector } from '@/redux/hooks';

import { useEffect, useState } from 'react';

import NewEntryModal from './modals/NewEntryModal';

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
  gap: 1,
  '&:hover': {
    filter: 'brightness(1.2)',
  },
};

export default function Profile({ userId }: { userId: number }) {
  const currency = useAppSelector((state) => state.currency.value);

  const [isModalOpen, setModalOpen] = useState(false);

  const addClickHandler = () => setModalOpen(true);
  const closeModalHandler = () => setModalOpen(false);

  const [data, setData] = useState<User>();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    getUserProfile(userId)
      .then(async (res) => {
        setData(res);
      })
      .catch((err) => console.error(err));

    getEntriesFromUser(userId)
      .then(async (res) => {
        setBalance(
          // set balance to the sum of user's assets prices
          res.reduce((acc: number, curr: UserEntry) => acc + curr.price, 0)
        );
      })
      .catch((err) => console.error(err));
  }, [userId]);

  if (!data) return LoadingProfile();

  return (
    <Box component={Paper} sx={{ ...mainBoxStyle }}>
      <Box sx={{ ...flexRow, gap: 1 }}>
        <AccountCircleIcon sx={{ fontSize: 50 }} />
        <Typography>Hello, {data.name}</Typography>
      </Box>
      <Box sx={{ ...flexColumn }}>
        <Typography sx={{ fontSize: 15 }}>Balance</Typography>
        <Typography sx={{ fontSize: 35 }}>
          {formatCurrency(balance, currency)}
        </Typography>
      </Box>
      <Box sx={{ ...flexRow, justifyContent: 'center', gap: 10 }}>
        <IconButton onClick={addClickHandler}>
          <AddCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </IconButton>
        <IconButton>
          <RemoveCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        </IconButton>
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
