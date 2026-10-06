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

/**
 * AdminPUMapPage
 * Renders the GIS Leaflet Map specifically for Admin PU.
 * PU-5.1: Admin PU views markers from ALL road authorities (Desa, Kabupaten, Provinsi, Nasional).
 * Filters include: Status, Kewenangan, Keparahan, Tanggal, Search, Sorting.
 * Detail button inside popups routes to /pu/laporan/:id.
 */
export function AdminPUMapPage(): React.JSX.Element {
  const { data: settings } = useSettings();

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MapStatusFilter>('all');
  const [authority, setAuthority] = useState<MapAuthorityFilter>('all');
  const [severity, setSeverity] = useState<MapSeverityFilter>('all');
  const [dateFilter, setDateFilter] = useState<MapDateFilter>('all');
  const [sortBy, setSortBy] = useState<MapSortFilter>('default');

  // React Query hook for verified GET /api/admin/map/laporan
  const { data: mapData, isLoading, error, refetch } = useAdminMapReports({
    jenis_jalan: authority !== 'all' ? authority : undefined,
  });

  // PU-5.1: Include reports from all road authorities; filter by authority if chosen
  const rawReports = useMemo(() => {
    let list = mapData?.reports || [];
    if (authority !== 'all') {
      list = list.filter(
        (r) => (r.jenisJalan || '').toLowerCase() === authority.toLowerCase()
      );
    }
    return list;
  }, [mapData?.reports, authority]);

  // Client-side filtering & sorting on map reports
  const displayedReports = useMemo(() => {
    let list = [...rawReports];

    // 1. Search filter by title or damage type
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.judul.toLowerCase().includes(query) ||
          r.tipeKerusakan.toLowerCase().includes(query)
      );
    }

    // 2. Status filter
    if (status !== 'all') {
      list = list.filter((r) => r.status === status);
    }

    // 3. Severity filter
    if (severity !== 'all') {
      list = list.filter(
        (r) => (r.severity || '').toLowerCase() === severity.toLowerCase()
      );
    }

    // 4. Date filter (graceful handling: if timestamp exists filter, otherwise retain)
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

    // 5. Sorting
    if (sortBy === 'title_asc') {
      list.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (sortBy === 'title_desc') {
      list.sort((a, b) => b.judul.localeCompare(a.judul));
    } else if (sortBy === 'status') {
      list.sort((a, b) => a.status.localeCompare(b.status));
    }

    return list;
  }, [rawReports, search, status, severity, dateFilter, sortBy]);

  // Coordinate validation: ensure only valid, non-zero coordinates are rendered
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
        title="Peta Laporan Kerusakan Jalan"
        subtitle="Pantau sebaran spasial titik laporan kerusakan jalan seluruh kewenangan di Kabupaten Indramayu."
      />

      {/* 2. Scope Chips (Lokasi, Wewenang & Counter) */}
      <ReportScopeChips
        locationLabel="Kabupaten Indramayu"
        scopeLabel={scopeLabelDisplay}
        totalReports={totalReportsCount}
        isLoading={isLoading}
      />

      {/* 3. Toolbar & Filters (Search, Status, Kewenangan, Keparahan, Tanggal, Sort, Reset, Export) */}
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

      {/* 4. Main Map Card with Real GIS Coordinates */}
      <MapView
        reports={validReports}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        onRetry={refetch}
        defaultCenter={[-6.37, 108.28]}
        defaultZoom={11}
        mapDefaultView={settings?.preferences?.map_default_view}
        showLabels={settings?.preferences?.map_show_labels}
        scopeLabel="Monitoring Seluruh Kewenangan Jalan"
        detailPathPrefix="/pu/laporan"
        showAuthorityLegend={true}
      />
    </div>
  );
}

export default AdminPUMapPage;
