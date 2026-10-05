import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useAdminLaporan } from '@/features/admin-pemdes/api/useAdminPemdesData';
import { ReportPageHeader } from '@/features/admin-pemdes/components/reports/ReportPageHeader';
import { ReportScopeChips } from '@/features/admin-pemdes/components/reports/ReportScopeChips';
import {
  ReportFilters,
  type StatusFilterValue,
  type SeverityFilterValue,
  type DateFilterValue,
  type SortFilterValue,
} from '@/features/admin-pemdes/components/reports/ReportFilters';
import { ReportTable } from '@/features/admin-pemdes/components/reports/ReportTable';
import { ReportPagination } from '@/features/admin-pemdes/components/reports/ReportPagination';

export function AdminPUReportsPage(): React.JSX.Element {
  const { data: settings } = useSettings();

  // Backend pagination states (standard pageSize = 10)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<StatusFilterValue>('all');
  const [severity, setSeverity] = useState<SeverityFilterValue>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('all');
  const [sortBy, setSortBy] = useState<SortFilterValue>('newest');

  // Debounce search query by 300ms before sending to backend API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Query live backend endpoint with true server-side pagination & filtering:
  // GET /api/admin/laporan?page={page}&limit={pageSize}&status={status}&search={debouncedSearch}&jenis_jalan=kabupaten
  const {
    data: laporanData,
    isLoading,
    error,
    refetch,
  } = useAdminLaporan({
    page,
    limit: pageSize,
    status: status !== 'all' ? status : undefined,
    search: debouncedSearch.trim() || undefined,
    jenis_jalan: 'kabupaten',
  });

  // Business rule & defensive verification: Admin PU list only views jenis_jalan = "kabupaten"
  const rawReports = useMemo(() => {
    return (laporanData?.reports || []).filter(
      (r) => (r.roadAuthority || '').toLowerCase() === 'kabupaten'
    );
  }, [laporanData?.reports]);

  // Client-side handling for attributes not in backend SQL query (severity, date range, client sort reversal)
  const displayedReports = useMemo(() => {
    let list = [...rawReports];

    // Client-side severity filtering (backend does not have a severity column in DB)
    if (severity !== 'all') {
      list = list.filter((r) => (r.severity || 'sedang').toLowerCase() === severity.toLowerCase());
    }

    // Client-side date filtering if specified
    if (dateFilter !== 'all') {
      const now = new Date();
      list = list.filter((r) => {
        if (!r.createdAt) return true;
        const itemDate = new Date(r.createdAt);
        if (isNaN(itemDate.getTime())) return true;

        if (dateFilter === 'today') {
          return (
            itemDate.getDate() === now.getDate() &&
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          );
        }

        if (dateFilter === 'this_week') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          sevenDaysAgo.setHours(0, 0, 0, 0);
          return itemDate >= sevenDaysAgo && itemDate <= now;
        }

        if (dateFilter === 'this_month') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          thirtyDaysAgo.setHours(0, 0, 0, 0);

          const isCurrentCalendarMonth =
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear();

          const isWithinLast30Days = itemDate >= thirtyDaysAgo && itemDate <= now;

          return isCurrentCalendarMonth || isWithinLast30Days;
        }

        return true;
      });
    }

    // Sort: Backend already returns created_at DESC (newest). If oldest is requested, invert order.
    if (sortBy === 'oldest') {
      list.reverse();
    }

    return list;
  }, [rawReports, severity, dateFilter, sortBy]);

  // Handlers with page reset
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: StatusFilterValue) => {
    setStatus(val);
    setPage(1);
  };

  const handleSeverityChange = (val: SeverityFilterValue) => {
    setSeverity(val);
    setPage(1);
  };

  const handleDateFilterChange = (val: DateFilterValue) => {
    setDateFilter(val);
    setPage(1);
  };

  const handleSortByChange = (val: SortFilterValue) => {
    setSortBy(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('all');
    setSeverity('all');
    setDateFilter('all');
    setSortBy('newest');
    setPage(1);
  };

  const totalReports = laporanData?.total ?? 0;
  const isFiltered = (status !== 'all' || debouncedSearch.trim() !== '' || severity !== 'all' || dateFilter !== 'all') && (totalReports === 0 || displayedReports.length === 0);

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 1. Header & Subtitle */}
      <ReportPageHeader
        title="Daftar Laporan Jalan Kabupaten"
        subtitle="Pusat inventarisasi dan disposisi laporan kerusakan jalan kewenangan Kabupaten Indramayu."
      />

      {/* 2. Scope Chips (Lokasi, Wewenang & Counter from Backend Total) */}
      <ReportScopeChips
        locationLabel="Kabupaten Indramayu"
        scopeLabel="Jalan Kabupaten"
        totalReports={totalReports}
        isLoading={isLoading}
      />

      {/* 3. Toolbar & Filters (Search, Status, Severity, Date, Sort, Reset, Export) */}
      <ReportFilters
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Cari judul, deskripsi, atau pelapor..."
        status={status}
        onStatusChange={handleStatusChange}
        severity={severity}
        onSeverityChange={handleSeverityChange}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateFilterChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        onReset={handleResetFilters}
      />

      {/* 4. Main Table Card */}
      <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-white/10 shadow-sm p-6 flex flex-col gap-4 overflow-hidden">
        <ReportTable
          reports={displayedReports}
          isLoading={isLoading}
          error={error instanceof Error ? error.message : null}
          onRetry={refetch}
          scopeLabel="Jalan Kabupaten"
          detailPathPrefix="/pu/laporan"
          density={settings?.preferences?.report_display_preference}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />

        {/* Table Footer with True Backend Pagination */}
        <ReportPagination
          currentPage={page}
          totalItems={totalReports}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default AdminPUReportsPage;
