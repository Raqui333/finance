import { Box, Container } from '@mui/material';

import ChangeCurrency from '@/components/ChangeCurrency';
import Chart from '@/components/Chart';
import PerformanceCard from '@/components/PerformanceCard';

const dataset = [
  { value: 10, label: 'Jan' },
  { value: 8, label: 'Feb' },
  { value: 1, label: 'Mar' },
  { value: 1, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 10, label: 'Jun' },
  { value: 9, label: 'Jul' },
  { value: 11, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 5, label: 'Oct' },
  { value: 10, label: 'Nov' },
  { value: 12.5, label: 'Dec' },
];

export default function Home() {
  const values = dataset.map((e) => e.value);
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
        <Chart data={dataset} />
        <PerformanceCard name="Performace" data={values} />
      </Box>
    </Container>
  );
}
