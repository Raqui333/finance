'use client';

import {
  alpha,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import formatCurrency from '@/utils/currency-formatter';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeEntry } from '@/redux/features/user/userSlice';

import { useCallback, useState } from 'react';
import { removeUserEntry } from '@/utils/actions';

const LOGO_SIZE = 16;

function getIcon(logo_name: string) {
  const normalized_logo_name = logo_name
    .normalize('NFD')
    .replace(/\s|[^\w\-]/g, '')
    .toLocaleLowerCase();

  return `https://logo.clearbit.com/${normalized_logo_name}.com`;
}

export default function FinanceEntries() {
  const dispatch = useAppDispatch();

  const currency = useAppSelector((state) => state.currency.value);
  const data = useAppSelector((state) => state.user.entries);

  const theme = useTheme();
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));

  const handleRemoveEntry = useCallback(
    (id: number) => {
      removeUserEntry(id)
        .then(() => {
          dispatch(removeEntry(id));
        })
        .catch((err) => console.error(err));
    },
    [data]
  );

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Typography color="primary.main">Recently Entries</Typography>
      {data.length ? (
        <Table>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                sx={(theme) => ({
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  transition: 'background-color 0.3s ease',
                })}
              >
                {isMediumOrLarger && (
                  <TableCell>{row.date.slice(0, 10)}</TableCell>
                )}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageWithFallback src={getIcon(row.name)} />
                    {row.name}
                  </Box>
                </TableCell>
                {isMediumOrLarger && (
                  <TableCell>{row.description || 'N/A'}</TableCell>
                )}
                <TableCell
                  align="right"
                  sx={{
                    color: row.price < 0 ? 'error.main' : 'success.main',
                  }}
                >
                  {formatCurrency(row.price, currency)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleRemoveEntry(row.id)}
                    sx={{
                      '&:hover': {
                        color: 'error.main',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography color="divide" align="center">
          No Entries Found
        </Typography>
      )}
    </TableContainer>
  );
}

function ImageWithFallback({ src }: { src: string }) {
  const [imgNotFound, setImgNotFound] = useState(false);
  return (
    <Image
      src={imgNotFound ? '/globe.svg' : src}
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      alt="logo icon"
      onError={() => setImgNotFound(true)}
    />
  );
}
