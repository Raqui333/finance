'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';
import formatCurrency from '@/utils/currency-formatter';

import { LineChart } from '@mui/x-charts';
import { Box } from '@mui/material';

const mainColor = '#318ede';
const secondaryColor = '#ffffff40';

export default function Chart() {
  const currency = useAppSelector((state) => state.currency.value);
  const entries = useAppSelector((state) => state.user.entries);

  const data = useMemo(() => {
    let sum = 0;
    return entries.map((row) => {
      // Creates a clone of 'entries', but updates the 'price' field
      // to be a cumulative sum of previous prices.
      sum += row.price;
      return { ...row, price: sum };
    });
  }, [entries]);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <LineChart
        dataset={data}
        xAxis={[
          {
            scaleType: 'time',
            dataKey: 'date',
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: { fill: `${mainColor}75` },
            hideTooltip: true,
          },
        ]}
        yAxis={[
          {
            tickMinStep: 4,
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: { fill: secondaryColor },
          },
        ]}
        series={[
          {
            dataKey: 'price',
            showMark: false,
            area: true,
            color: mainColor,
            valueFormatter: (v) => formatCurrency(v, currency),
          },
        ]}
        grid={{ horizontal: true }}
        width={undefined}
        height={undefined}
        sx={{
          '.MuiAreaElement-root': {
            fill: 'url(#chart-gradient)',
          },

          '.MuiChartsGrid-horizontalLine, .MuiChartsAxisHighlight-root': {
            stroke: secondaryColor,
          },

          '.MuiChartsLegend-root': {
            color: 'red',
          },
        }}
      >
        <defs>
          <linearGradient id="chart-gradient" gradientTransform="rotate(90)">
            <stop offset="50%" stopColor={`${mainColor}40`} />
            <stop offset="75%" stopColor={`${mainColor}20`} />
            <stop offset="90%" stopColor={`${mainColor}15`} />
            <stop offset="95%" stopColor={`${mainColor}00`} />
          </linearGradient>
        </defs>
      </LineChart>
    </Box>
  );
}
