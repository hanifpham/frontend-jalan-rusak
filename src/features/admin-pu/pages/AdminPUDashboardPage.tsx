import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import {
  useAdminDashboardStats,
  useAdminLaporan,
} from "@/features/admin-pemdes/api/useAdminPemdesData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ReportTrendCard } from "@/components/dashboard/ReportTrendCard";
import { PriorityReportsCard } from "@/components/dashboard/PriorityReportsCard";
import { RecentReportsCard } from "@/components/dashboard/RecentReportsCard";
import { WilayahChip } from "@/components/ui/WilayahChip";

/**
 * JurisdictionChip
 * Displays harmonized jurisdiction scope badges for Dinas PUPR Kabupaten Indramayu
 */
function JurisdictionChip(): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5 flex-wrap select-none">
      <WilayahChip locationLabel="Kabupaten Indramayu" />
    </div>
  );
}

export function AdminPUDashboardPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("Bulan Ini");

  // 1. Official KPI metrics from GET /api/admin/dashboard
  // Backend automatically enforces role admin_pu to: jenis_jalan = "kabupaten"
  const { data: statsData, isLoading: isStatsLoading } =
    useAdminDashboardStats();

  // 2. Report records for recent/priority lists and trend distribution (limit: 10)
  const {
    data: laporanData,
    isLoading: isLaporanLoading,
    error: laporanError,
  } = useAdminLaporan({ limit: 10, jenis_jalan: "kabupaten" });

  // Client-side defensive filter guaranteeing no non-kabupaten records leak into lists
  const kabupatenReports = useMemo(() => {
    return (laporanData?.reports || []).filter(
      (report) => report.roadAuthority === "kabupaten",
    );
  }, [laporanData?.reports]);

  const userName = user?.nama || "Admin Dinas PU";

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Section */}
      <DashboardHeader
        userName={userName}
        subtitle="Pantau dan koordinasikan laporan kerusakan jalan kabupaten di seluruh wilayah Indramayu."
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
            reports={kabupatenReports}
            scopeLabel="Jalan Kabupaten Indramayu"
          />
        </div>

        <div className="lg:col-span-5">
          <PriorityReportsCard
            reports={kabupatenReports}
            onViewAll={() => {
              navigate("/pu/laporan");
            }}
            onFollowUp={() => {
              navigate("/pu/laporan");
            }}
            onDetailClick={(id) => {
              navigate(`/pu/laporan/${id}`);
            }}
          />
        </div>
      </div>

      {/* 4. Bottom Section: Laporan Terbaru Kabupaten */}
      <RecentReportsCard
        reports={kabupatenReports.slice(0, 5)}
        isLoading={isLaporanLoading}
        error={laporanError instanceof Error ? laporanError.message : null}
        subtitle="Daftar kerusakan jalan kabupaten yang baru dilaporkan warga Indramayu"
        emptyMessage="Belum ada laporan kerusakan jalan kabupaten yang terdaftar."
        onViewAll={() => {
          navigate("/pu/laporan");
        }}
        onDetailClick={(id) => {
          navigate(`/pu/laporan/${id}`);
        }}
      />
    </div>
  );
}

export default AdminPUDashboardPage;
