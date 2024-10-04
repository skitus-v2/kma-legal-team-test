import Link from 'next/link';
import { Button, Typography } from '@mui/material';

export default function Home() {
  return (
    <div>
      <Typography variant="h4">Добро пожаловать в KMA Legal Team</Typography>
      <div>
        <Link href="/admin">
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Войти как Администратор
          </Button>
        </Link>
        <Link href="/lawyer">
          <Button variant="contained" color="secondary">
            Войти как Юрист
          </Button>
        </Link>
      </div>
    </div>
  );
}
