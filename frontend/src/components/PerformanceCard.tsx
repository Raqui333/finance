'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import formatCurrency from '@/utils/currency-formatter';
import { ByDateTimeAlgorithm } from '@/utils/algorithms';

import { Box, Paper, Typography } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface PerformanceCardProps {
  name: string;
}

function calculateDelta(start_value: number, last_value: number) {
  if (isNaN(start_value) || start_value === 0) return 0;

  return ((last_value - start_value) * 100) / start_value;
}

function getSequencialSumArray(data: UserEntry[]) {
  // get the sum of the prices of the entries sequencially
  // eg: [1, 2, 3] => [1, 3, 6]
  let sum = 0;
  return data.map((row) => {
    sum += row.price;
    return sum;
  });
}

const mainBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '&:hover': {
    filter: 'brightness(1.2)',
  },
};

export default function PerformanceCard({ name }: PerformanceCardProps) {
  const currency = useAppSelector((state) => state.currency.value);
  const entries = useAppSelector((state) => state.user.entries);

  const data = useMemo(
    () => getSequencialSumArray(entries.toSorted(ByDateTimeAlgorithm)),
    [entries]
  );
  const total = data.length > 0 ? data[data.length - 1] : 0;
  const delta = calculateDelta(data[0], total);

  return (
    <Box component={Paper} sx={{ ...mainBoxStyle }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography fontSize={20}>{name}</Typography>
        <AttachMoneyIcon
          color="primary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'secondary.main',
            borderRadius: '100%',
            fontSize: 40,
            p: 1,
          }}
        />
      </Box>
      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
          fontSize: 20,
          color: total >= 0 ? 'success.main' : 'error.main',
          gap: 1,
        }}
      >
        {total >= 0 ? (
          <TrendingUpIcon sx={{ fontSize: 20 }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 20 }} />
        )}

        {`${delta.toFixed(2)}%`}
      </Typography>
      <SparkLineChart
        data={data}
        width={300}
        height={100}
        colors={[total >= 0 ? '#318ede' : '#d05574']}
        curve="catmullRom"
        showHighlight={true}
        showTooltip={true}
        valueFormatter={(value) => formatCurrency(value as number, currency)}
      />
    </Box>
  );
}
