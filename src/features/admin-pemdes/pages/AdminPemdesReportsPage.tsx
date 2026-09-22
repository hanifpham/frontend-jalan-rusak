import React, { useState, useMemo } from 'react';
import { useAuth } from '@/features/auth/useAuth';
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
  // Backend directly supports `status`, `search`, `page`, and `limit`
  const {
    data: laporanData,
    isLoading,
    error,
    refetch,
  } = useAdminLaporan({
    status: status === 'all' ? undefined : status,
    search: search.trim() || undefined,
    page,
    limit: pageSize,
  });

  // Client-side date filter & sort enhancement on the verified dataset
  const displayedReports = useMemo(() => {
    const rawReports = laporanData?.reports || [];
    let list = [...rawReports];

    // 1. Date filtering
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
          return itemDate >= sevenDaysAgo && itemDate <= now;
        }

        if (dateFilter === 'this_month') {
          return (
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          );
        }

        return true;
      });
    }

    // 2. Sorting
    list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      return dateB - dateA; // newest default
    });

    return list;
  }, [laporanData?.reports, dateFilter, sortBy]);

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

  const totalReportsCount = laporanData?.total ?? 0;

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 1. Header & Subtitle */}
      <ReportPageHeader villageName={villageName} />

      {/* 2. Scope Chips (Lokasi, Wewenang & Counter) */}
      <ReportScopeChips
        villageName={villageName}
        totalReports={totalReportsCount}
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
      <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-6 flex flex-col gap-4 overflow-hidden">
        <ReportTable
          reports={displayedReports}
          isLoading={isLoading}
          error={error instanceof Error ? error.message : null}
          onRetry={refetch}
          villageName={villageName}
        />

        {/* Table Footer with Summary & Dynamic Pagination */}
        <ReportPagination
          currentPage={page}
          totalItems={totalReportsCount}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default AdminPemdesReportsPage;
