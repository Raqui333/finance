import { Box, Container } from '@mui/material';

import ChangeCurrency from '@/components/ChangeCurrency';
import Chart from '@/components/Chart';
import PerformanceCard from '@/components/PerformanceCard';
import FinanceEntries from '@/components/FinanceEntries';

// start mock
function createData(date: number, name: string, desc: string, price: number) {
  return { date, name, desc, price };
}
// date, name, description, Amount
const timestamp = Date.now();
const mock_data: FinanceEntriesType[] = [
  createData(timestamp + 1, 'Space X', 'Stock of Space X Corp.', 50),
  createData(timestamp + 2, 'Tesla', 'Stock of Tesla Inc.', 120),
  createData(timestamp + 3, 'Apple', 'Stock of Apple Inc.', 180),
  createData(timestamp + 4, 'Amazon', 'Stock of Amazon Inc.', 95),
  createData(timestamp + 5, 'Microsoft', 'Stock of Microsoft Corp.', 210),
  createData(timestamp + 6, 'Google', 'Stock of Alphabet Inc.', 300),
  createData(timestamp + 7, 'Netflix', 'Stock of Netflix Inc.', 400),
  createData(timestamp + 8, 'Meta', 'Stock of Meta Platforms', 150),
  createData(timestamp + 9, 'Nvidia', 'Stock of Nvidia Corp.', 500),
  createData(timestamp + 10, 'AMD', 'Stock of AMD Inc.', 75),
  createData(timestamp + 11, 'Intel', 'Stock of Intel Corp.', 95),
  createData(timestamp + 12, 'Samsung', 'Stock of Samsung Electronics', 85),
  createData(timestamp + 13, 'Sony', 'Stock of Sony Corp.', 110),
  createData(timestamp + 14, 'Disney', 'Stock of Walt Disney Company', 130),
  createData(timestamp + 15, 'BMW', 'Stock of BMW Group', 140),
];
// end mock

export default function Home() {
  let sum = 0;
  const progression = mock_data.map((row) => {
    sum += row.price;
    return sum;
  });

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <ChangeCurrency />
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start' }}>
        <Chart data={mock_data} />
        <PerformanceCard name="Performace" data={progression} />
      </Box>
      <FinanceEntries data={mock_data} />
    </Container>
  );
}
