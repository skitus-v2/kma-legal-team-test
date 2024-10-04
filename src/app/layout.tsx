/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationProvider } from './components/Notification';
import { ReactQueryClientProvider } from './components/ReactQueryClientProvider';
import { Box } from '@mui/material';
import { PLASMIC } from '../../plasmic-init';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryClientProvider>
          <NotificationProvider/>
          <Box sx={{ flexGrow: 1, padding: '20px' }}>
            {children}
          </Box>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
