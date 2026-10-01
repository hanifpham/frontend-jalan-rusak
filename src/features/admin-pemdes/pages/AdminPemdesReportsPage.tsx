import React, { useState, useMemo } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useAdminLaporan } from '../api/useAdminPemdesData';
import { ReportPageHeader } from '../components/reports/ReportPageHeader';
import { ReportScopeChips } from '../components/reports/ReportScopeChips';
import {
  ReportFilters,
  type StatusFilterValue,
  type SeverityFilterValue,
  type DateFilterValue,
  type SortFilterValue,
} from '../components/reports/ReportFilters';
import { ReportTable } from '../components/reports/ReportTable';
import { ReportPagination } from '../components/reports/ReportPagination';

export function AdminPemdesReportsPage(): React.JSX.Element {
  const { user } = useAuth();
  const { data: settings } = useSettings();

  // Dynamic village name from authenticated user session
  const villageName =
    user?.wilayahId === 2
      ? 'Lobener Lor'
      : user?.wilayahId
      ? `Wilayah #${user.wilayahId}`
      : undefined;

  // Filter and pagination states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilterValue>('all');
  const [severity, setSeverity] = useState<SeverityFilterValue>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('this_month');
  const [sortBy, setSortBy] = useState<SortFilterValue>('newest');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Query live backend endpoint: GET /api/admin/laporan
  // Fetch dataset for client-side filtering and pagination consistency
  const {
    data: laporanData,
    isLoading,
    error,
    refetch,
  } = useAdminLaporan({
    limit: 100,
  });

  const rawReports = useMemo(() => laporanData?.reports || [], [laporanData?.reports]);

  // Client-side filtering & sorting on verified dataset
  const filteredReports = useMemo(() => {
    let list = [...rawReports];

    // 1. Search keyword filtering
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => {
        const titleMatch = r.title ? r.title.toLowerCase().includes(q) : false;
        const descMatch = r.description ? r.description.toLowerCase().includes(q) : false;
        const reporterMatch = r.reporterName ? r.reporterName.toLowerCase().includes(q) : false;
        const roadMatch = r.roadName ? r.roadName.toLowerCase().includes(q) : false;
        const damageMatch = r.damageType ? r.damageType.toLowerCase().includes(q) : false;
        return titleMatch || descMatch || reporterMatch || roadMatch || damageMatch;
      });
    }

    // 2. Status filtering
    if (status !== 'all') {
      list = list.filter((r) => (r.status || '').toLowerCase() === status.toLowerCase());
    }

    // 3. Severity filtering
    if (severity !== 'all') {
      list = list.filter((r) => (r.severity || 'sedang').toLowerCase() === severity.toLowerCase());
    }

    // 4. Date filtering
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
          // "Bulan Ini" in operational context: current calendar month OR rolling last 30 days
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

    // 5. Sorting
    list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (sortBy === 'oldest') {
        if (dateA !== dateB) return dateA - dateB;
        return (a.id ?? 0) - (b.id ?? 0);
      }
      // 'newest' default
      if (dateB !== dateA) return dateB - dateA;
      return (b.id ?? 0) - (a.id ?? 0);
    });

    return list;
  }, [rawReports, search, status, severity, dateFilter, sortBy]);

  // Paginated records for table display
  const displayedReports = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, page, pageSize]);

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
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setSeverity('all');
    setDateFilter('this_month');
    setSortBy('newest');
    setPage(1);
  };

  const totalFilteredReports = filteredReports.length;
  const totalRawReports = rawReports.length;

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 1. Header & Subtitle */}
      <ReportPageHeader villageName={villageName} />

      {/* 2. Scope Chips (Lokasi, Wewenang & Counter) */}
      <ReportScopeChips
        villageName={villageName}
        totalReports={totalFilteredReports}
        isLoading={isLoading}
      />

      {/* 3. Toolbar & Filters (Search, Status, Severity, Date, Sort, Reset, Export) */}
      <ReportFilters
        search={search}
        onSearchChange={handleSearchChange}
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
          villageName={villageName}
          density={settings?.preferences?.report_display_preference}
          isFiltered={totalRawReports > 0 && totalFilteredReports === 0}
          onResetFilters={handleResetFilters}
        />

        {/* Table Footer with Summary & Dynamic Pagination */}
        <ReportPagination
          currentPage={page}
          totalItems={totalFilteredReports}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default AdminPemdesReportsPage;
