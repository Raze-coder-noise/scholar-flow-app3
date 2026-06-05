'use client';

import { AuthGuard } from '../guard';
import DashboardPage from './page';

export default function DashboardLayout() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
