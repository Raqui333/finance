'use client';

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';

import Image from 'next/image';

import formatCurrency from '@/utils/currency-formatter';
import { useAppSelector } from '@/redux/hooks';

type FinanceEntriesPros = {
  data: FinanceEntriesType[];
};

export default function FinanceEntries({ data }: FinanceEntriesPros) {
  const currency = useAppSelector((state) => state.currency.value);

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: 'background.paper',
        maxHeight: 440,
        scrollbarColor: 'red',
      }}
    >
      <Typography color="primary.main">Recently Entries</Typography>
      <Table>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(row.date).toDateString()}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Image
                    src={`https://logo.clearbit.com/${row.name
                      .replaceAll(/\s/g, '')
                      .toLocaleLowerCase()}.com`}
                    width={16}
                    height={16}
                    alt="logo icon"
                  ></Image>
                  {row.name}
                </Box>
              </TableCell>
              <TableCell>{row.desc}</TableCell>
              <TableCell>{formatCurrency(row.price, currency)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
