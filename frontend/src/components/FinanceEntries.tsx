'use client';

import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  alpha,
} from '@mui/material';

import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import formatCurrency from '@/utils/currency-formatter';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeEntry } from '@/redux/features/user/userSlice';
import { useState } from 'react';

const LOGO_SIZE = 16;

export default function FinanceEntries() {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.currency.value);
  const data = useAppSelector((state) => state.user.entries);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Typography color="primary.main">Recently Entries</Typography>
      {data.length ? (
        <Table>
          <TableBody>
            {data.map((row, index) => {
              const logo_name = row.name
                .normalize('NFD')
                .replace(/\s|[^\w\-]/g, '')
                .toLocaleLowerCase();

              const url = `https://logo.clearbit.com/${logo_name}.com`;

              return (
                <TableRow
                  key={index}
                  sx={(theme) => ({
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                    transition: 'background-color 0.3s ease',
                  })}
                >
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ImageWithFallback src={url} />
                      {row.name}
                    </Box>
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
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
                      onClick={() => dispatch(removeEntry(row.id))}
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
              );
            })}
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
