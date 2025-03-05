'use client';

import { useMemo, useRef } from 'react';

import { useAppSelector } from '@/redux/hooks';
import formatCurrency from '@/utils/currency-formatter';
import { ByDateTimeAlgorithm } from '@/utils/algorithms';

import { LineChart } from '@mui/x-charts';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const mainColor = '#318ede';
const secondaryColor = '#ffffff40';

export default function Chart() {
  const currency = useAppSelector((state) => state.currency.value);
  const data = useAppSelector((state) => state.user.entries);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const sorted_data = useMemo(() => {
    let sum = 0;
    return data.toSorted(ByDateTimeAlgorithm).map((row, index) => {
      sum += row.price;
      return { ...row, price: sum, date: new Date(row.date).getTime() + index };
    });
  }, [data]);

  const price_array = sorted_data.map((e) => e.price);
  const max = Math.max(...price_array);
  const mid = Math.floor(max / 2);

  if (!sorted_data.length) {
    return <ChartSkeleton isSmallScreen={isSmallScreen} />;
  }

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <LineChart
        grid={{ horizontal: true }}
        margin={isSmallScreen ? { right: 0 } : undefined}
        dataset={sorted_data}
        xAxis={[
          {
            scaleType: 'point',
            dataKey: 'date',
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: { display: 'none' },
            valueFormatter: (v) => {
              // find index where the item is equal to tooltip value
              // tooltip value is based on data of the entry
              const index = sorted_data.findIndex((i) => i.date === v);

              const formattedDate = new Date(
                sorted_data[index].date
              ).toLocaleDateString('pt-BR');

              return `${sorted_data[index].name} (${formattedDate})`;
            },
          },
        ]}
        yAxis={[
          {
            tickInterval: [0, mid, max],
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
            valueFormatter: (v) => formatCurrency(v as number, currency),
          },
        ]}
        sx={{
          '.MuiAreaElement-root': {
            fill: 'url(#chart-gradient)',
          },

          '.MuiChartsGrid-horizontalLine, .MuiChartsAxisHighlight-root': {
            stroke: secondaryColor,
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

function ChartSkeleton({ isSmallScreen }: { isSmallScreen: boolean }) {
  const area_color = '#808080';

  const xAxi = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const data = [24, 15, 24, 27, 14, 23, 10, 29, 20, 27, 13, 24];

  return (
    <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
      <LineChart
        grid={isSmallScreen ? undefined : { horizontal: true }}
        margin={isSmallScreen ? { right: 0, left: 0 } : undefined}
        xAxis={[
          {
            data: xAxi,
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: { display: 'none' },
          },
        ]}
        yAxis={[
          {
            tickInterval: [0, 25, 50],
            disableLine: true,
            disableTicks: true,
            tickLabelStyle: { fill: secondaryColor },
          },
        ]}
        series={[
          {
            data: data,
            showMark: false,
            area: true,
          },
          {
            data: [0, 50],
            showMark: false,
          },
        ]}
        sx={{
          '.MuiAreaElement-root': {
            fill: 'url(#chart-gradient)',
          },

          '.MuiChartsGrid-horizontalLine, .MuiChartsAxisHighlight-root': {
            stroke: secondaryColor,
          },

          pointerEvents: 'none',
          '.MuiLineElement-root': {
            display: 'none',
          },
        }}
      >
        <defs>
          <linearGradient id="chart-gradient" gradientTransform="rotate(90)">
            <stop offset="50%" stopColor={`${area_color}30`} />
            <stop offset="75%" stopColor={`${area_color}20`} />
            <stop offset="90%" stopColor={`${area_color}15`} />
            <stop offset="95%" stopColor={`${area_color}00`} />
          </linearGradient>
        </defs>
      </LineChart>
      <Typography
        sx={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'text.secondary',
        }}
      >
        No data found
      </Typography>
    </Box>
  );
}
