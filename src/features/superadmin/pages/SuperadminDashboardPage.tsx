import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import {
  useAdminDashboardStats,
  useAdminLaporan,
} from '@/features/admin-pemdes/api/useAdminPemdesData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ReportTrendCard } from '@/components/dashboard/ReportTrendCard';
import { PriorityReportsCard } from '@/components/dashboard/PriorityReportsCard';
import { RecentReportsCard } from '@/components/dashboard/RecentReportsCard';
import { WilayahChip } from '@/components/ui/WilayahChip';

function JurisdictionChip(): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5 flex-wrap select-none">
      <WilayahChip locationLabel="Seluruh Wilayah (Pusat)" />
    </div>
  );
}

export function SuperadminDashboardPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('Bulan Ini');

  // Official KPI metrics from GET /api/admin/dashboard
  // Backend returns total aggregated metrics across all road types and territories for role super_admin
  const { data: statsData, isLoading: isStatsLoading } = useAdminDashboardStats();

  // Recent/priority report records across all jurisdictions
  const {
    data: laporanData,
    isLoading: isLaporanLoading,
    error: laporanError,
  } = useAdminLaporan({ limit: 10 });

  const allReports = laporanData?.reports || [];
  const userName = user?.nama || 'Superadmin';

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Section */}
      <DashboardHeader
        userName={userName}
        subtitle="Pusat kendali operasional, inventarisasi data, dan pengawasan kondisi jalan seluruh wilayah."
        scopeBadge={<JurisdictionChip />}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* 2. Official 5 KPI Cards (Total, Menunggu, Proses, Selesai, Ditolak) */}
      <DashboardStats stats={statsData} isLoading={isStatsLoading} />

      {/* 3. Middle Section: Tren Laporan (7 cols) + Perlu Tindakan (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ReportTrendCard
            reports={allReports}
            scopeLabel="Seluruh Wilayah Penugasan"
          />
        </div>

        <div className="lg:col-span-5">
          <PriorityReportsCard
            reports={allReports}
            onViewAll={() => {
              navigate('/superadmin/laporan');
            }}
            onFollowUp={() => {
              navigate('/superadmin/laporan');
            }}
            onDetailClick={(id) => {
              navigate(`/superadmin/laporan/${id}`);
            }}
          />
        </div>
      </div>

      {/* 4. Bottom Section: Laporan Terbaru Seluruh Wilayah */}
      <RecentReportsCard
        reports={allReports.slice(0, 5)}
        isLoading={isLaporanLoading}
        error={laporanError instanceof Error ? laporanError.message : null}
        subtitle="Daftar laporan kerusakan jalan terbaru yang masuk dari warga di seluruh wilayah"
        emptyMessage="Belum ada laporan kerusakan jalan yang terdaftar pada sistem."
        onViewAll={() => {
          navigate('/superadmin/laporan');
        }}
        onDetailClick={(id) => {
          navigate(`/superadmin/laporan/${id}`);
        }}
      />
    </div>
  );
}

export default SuperadminDashboardPage;
