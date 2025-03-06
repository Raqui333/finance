'use client';

import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import formatCurrency from '@/utils/currency-formatter';
import { getEntries, getProfile, logout } from '@/utils/actions';
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const closeMenuHandler = () => setAnchorEl(null);
  const openMenuHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

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
    getProfile()
      .then((res) => dispatch(setName(res.name)))
      .catch((err) => console.error(err));

    getEntries()
      .then((res) => dispatch(setEntry(res)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return LoadingProfile();

  return (
    <Box component={Paper} sx={{ ...mainBoxStyle }}>
      <Box sx={{ ...flexRow, justifyContent: 'space-between' }}>
        <Box sx={{ ...flexRow, gap: 1 }}>
          <AccountCircleIcon sx={{ fontSize: 50 }} />
          <Typography color="primary">Hello, </Typography>
          <Typography>{data.name}</Typography>
        </Box>
        <IconButton onClick={openMenuHandler}>
          <MoreHorizIcon fontSize="large" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenuHandler}
          slotProps={{
            paper: {
              sx: {
                p: 0,
              },
            },
          }}
        >
          <MenuItem onClick={logoutHandler}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Log Out
          </MenuItem>
        </Menu>
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
      <Button
        size="small"
        variant="contained"
        onClick={addClickHandler}
        sx={{ flex: 1 }}
      >
        <AddIcon fontSize="small" sx={{ mr: 1 }} />
        New Entry
      </Button>
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
      <Skeleton width="100%" height={50} />
    </Box>
  );
}
