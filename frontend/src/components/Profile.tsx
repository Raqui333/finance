'use client';

import { Box, Paper, Typography, IconButton, Skeleton } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import formatCurrency from '@/utils/currency-formatter';
import { getUserProfile } from '@/utils/actions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setName } from '@/redux/features/user/userSlice';

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
  const dispatch = useAppDispatch();

  const currency = useAppSelector((state) => state.currency.value);
  const data = useAppSelector((state) => state.user);
  const balance = data.entries.reduce(
    (acc: number, curr: UserEntry) => acc + curr.price,
    0
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const addClickHandler = () => setModalOpen(true);
  const closeModalHandler = () => setModalOpen(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserProfile()
      .then((res) => {
        dispatch(setName(res.name));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return LoadingProfile();

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
        <NewEntryModal
          userId={userId}
          isOpen={isModalOpen}
          onClose={closeModalHandler}
        />
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
