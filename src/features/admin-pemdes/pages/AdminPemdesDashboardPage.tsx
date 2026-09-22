import React, { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useAdminDashboardStats, useAdminLaporan } from '../api/useAdminPemdesData';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardStats } from '../components/DashboardStats';
import { ReportTrendCard } from '../components/ReportTrendCard';
import { PriorityReportsCard } from '../components/PriorityReportsCard';
import { RecentReportsCard } from '../components/RecentReportsCard';

export function AdminPemdesDashboardPage(): React.JSX.Element {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('Bulan Ini');

  // Query verified backend endpoints (GET /api/admin/dashboard & GET /api/admin/laporan)
  const { data: statsData, isLoading: isStatsLoading } = useAdminDashboardStats();
  const {
    data: laporanData,
    isLoading: isLaporanLoading,
    error: laporanError,
  } = useAdminLaporan({ limit: 10 });

  // Use authenticated village assignment if available (Lobener Lor in seeder, or dynamic)
  const villageName =
    user?.wilayahId === 2
      ? 'Lobener Lor'
      : user?.wilayahId
      ? `Wilayah #${user.wilayahId}`
      : 'Sukamaju';
  const userName = user?.nama || 'Admin Pemdes';

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Section */}
      <DashboardHeader
        userName={userName}
        villageName={villageName}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* 2. 4 Horizontal KPI Cards */}
      <DashboardStats stats={statsData} isLoading={isStatsLoading} />

      {/* 3. Middle Section: Tren Laporan (7 cols) + Perlu Tindakan (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ReportTrendCard
            reports={laporanData?.reports}
            villageName={villageName}
          />
        </div>

        <div className="lg:col-span-5">
          <PriorityReportsCard
            reports={laporanData?.reports}
            onViewAll={() => {
              // Action handler for reports list view
            }}
            onFollowUp={() => {
              // Action handler for priority follow up
            }}
          />
        </div>
      </div>

      {/* 4. Bottom Section: Laporan Terbaru */}
      <RecentReportsCard
        reports={laporanData?.reports}
        isLoading={isLaporanLoading}
        error={laporanError instanceof Error ? laporanError.message : null}
        villageName={villageName}
        onViewAll={() => {
          // Action handler for full reports view
        }}
        onDetailClick={(_id) => {
          // Action handler for report detail view
        }}
      />
    </div>
  );
}

export default AdminPemdesDashboardPage;
