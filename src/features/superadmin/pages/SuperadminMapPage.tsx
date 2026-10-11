import React, { useState, useMemo } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useAdminMapReports } from '@/features/admin-pemdes/api/useAdminPemdesData';
import { MapHeader } from '@/components/map/MapHeader';
import { ReportScopeChips } from '@/components/reports/ReportScopeChips';
import {
  MapFilters,
  type MapStatusFilter,
  type MapAuthorityFilter,
  type MapSeverityFilter,
  type MapDateFilter,
  type MapSortFilter,
} from '@/components/map/MapFilters';
import { MapView } from '@/components/map/MapView';

export function SuperadminMapPage(): React.JSX.Element {
  const { data: settings } = useSettings();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MapStatusFilter>('all');
  const [authority, setAuthority] = useState<MapAuthorityFilter>('all');
  const [severity, setSeverity] = useState<MapSeverityFilter>('all');
  const [dateFilter, setDateFilter] = useState<MapDateFilter>('all');
  const [sortBy, setSortBy] = useState<MapSortFilter>('default');

  const { data: mapData, isLoading, error, refetch } = useAdminMapReports({
    jenis_jalan: authority !== 'all' ? authority : undefined,
  });

  const rawReports = useMemo(() => {
    let list = mapData?.reports || [];
    if (authority !== 'all') {
      list = list.filter(
        (r) => (r.jenisJalan || '').toLowerCase() === authority.toLowerCase()
      );
    }
    return list;
  }, [mapData?.reports, authority]);

  const displayedReports = useMemo(() => {
    let list = [...rawReports];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.judul.toLowerCase().includes(query) ||
          r.tipeKerusakan.toLowerCase().includes(query)
      );
    }

    if (status !== 'all') {
      list = list.filter((r) => r.status === status);
    }

    if (severity !== 'all') {
      list = list.filter(
        (r) => (r.severity || '').toLowerCase() === severity.toLowerCase()
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      list = list.filter((r) => {
        if (!r.createdAt) return true;
        const d = new Date(r.createdAt);
        if (isNaN(d.getTime())) return true;
        if (dateFilter === 'today') {
          return d.toDateString() === now.toDateString();
        }
        if (dateFilter === 'this_week') {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return d >= weekAgo;
        }
        if (dateFilter === 'this_month') {
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        }
        return true;
      });
    }

    if (sortBy === 'title_asc') {
      list.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (sortBy === 'title_desc') {
      list.sort((a, b) => b.judul.localeCompare(a.judul));
    } else if (sortBy === 'status') {
      list.sort((a, b) => a.status.localeCompare(b.status));
    }

    return list;
  }, [rawReports, search, status, severity, dateFilter, sortBy]);

  const validReports = useMemo(() => {
    return displayedReports.filter(
      (r) =>
        typeof r.latitude === 'number' &&
        typeof r.longitude === 'number' &&
        !isNaN(r.latitude) &&
        !isNaN(r.longitude) &&
        !(r.latitude === 0 && r.longitude === 0)
    );
  }, [displayedReports]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('all');
    setAuthority('all');
    setSeverity('all');
    setDateFilter('all');
    setSortBy('default');
  };

  const totalReportsCount = rawReports.length;

  const scopeLabelDisplay = useMemo(() => {
    if (authority === 'all') return 'Semua Kewenangan';
    return `Jalan ${authority.charAt(0).toUpperCase() + authority.slice(1)}`;
  }, [authority]);

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 1. Header & Subtitle */}
      <MapHeader
        title="Peta Sebaran Laporan Seluruh Wilayah"
        subtitle="Pantau visualisasi geospasial titik kerusakan jalan lintas seluruh kewenangan dan wilayah administratif."
      />

      {/* 2. Scope Chips */}
      <ReportScopeChips
        locationLabel="Seluruh Wilayah (Pusat)"
        scopeLabel={scopeLabelDisplay}
        totalReports={totalReportsCount}
        isLoading={isLoading}
      />

      {/* 3. Toolbar & Filters */}
      <MapFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        authority={authority}
        onAuthorityChange={setAuthority}
        allowedAuthorities={['all', 'desa', 'kabupaten', 'provinsi', 'nasional']}
        severity={severity}
        onSeverityChange={setSeverity}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={handleResetFilters}
      />

      {/* 4. Main Map View */}
      <MapView
        reports={validReports}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        onRetry={refetch}
        defaultCenter={[-6.37, 108.28]}
        defaultZoom={11}
        mapDefaultView={settings?.preferences?.map_default_view}
        showLabels={settings?.preferences?.map_show_labels}
        scopeLabel="Monitoring Seluruh Wilayah & Kewenangan"
        detailPathPrefix="/superadmin/laporan"
        showAuthorityLegend={true}
      />
    </div>
  );
}

export default SuperadminMapPage;
