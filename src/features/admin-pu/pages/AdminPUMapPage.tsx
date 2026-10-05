import React, { useState, useMemo } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useAdminMapReports } from '@/features/admin-pemdes/api/useAdminPemdesData';
import { MapHeader } from '@/features/admin-pemdes/components/map/MapHeader';
import { MapScopeChips } from '@/features/admin-pemdes/components/map/MapScopeChips';
import {
  MapFilters,
  type MapStatusFilter,
  type MapSortFilter,
} from '@/features/admin-pemdes/components/map/MapFilters';
import { MapView } from '@/features/admin-pemdes/components/map/MapView';

/**
 * AdminPUMapPage
 * Renders the GIS Leaflet Map specifically for Admin PU.
 * Business Rule: Admin PU on Map only views reports with jenis_jalan = "kabupaten".
 * Detail button inside popups strictly routes to /pu/laporan/:id.
 */
export function AdminPUMapPage(): React.JSX.Element {
  const { data: settings } = useSettings();

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MapStatusFilter>('all');
  const [sortBy, setSortBy] = useState<MapSortFilter>('default');

  // React Query hook for verified GET /api/admin/map/laporan
  const { data: mapData, isLoading, error, refetch } = useAdminMapReports();

  // Business rule & defensive verification: Admin PU list strictly limits to jenis_jalan = "kabupaten"
  const rawKabupatenReports = useMemo(() => {
    return (mapData?.reports || []).filter(
      (r) => (r.jenisJalan || '').toLowerCase() === 'kabupaten'
    );
  }, [mapData?.reports]);

  // Client-side filtering & sorting on kabupaten reports
  const displayedReports = useMemo(() => {
    let list = [...rawKabupatenReports];

    // 1. Search filter by title
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter((r) => r.judul.toLowerCase().includes(query));
    }

    // 2. Status filter
    if (status !== 'all') {
      list = list.filter((r) => r.status === status);
    }

    // 3. Sorting
    if (sortBy === 'title_asc') {
      list.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (sortBy === 'title_desc') {
      list.sort((a, b) => b.judul.localeCompare(a.judul));
    } else if (sortBy === 'status') {
      list.sort((a, b) => a.status.localeCompare(b.status));
    }

    return list;
  }, [rawKabupatenReports, search, status, sortBy]);

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
    setSortBy('default');
  };

  const totalReportsCount = rawKabupatenReports.length;

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 1. Header & Subtitle */}
      <MapHeader
        title="Peta Laporan Jalan Kabupaten"
        subtitle="Pantau sebaran spasial titik laporan kerusakan jalan kewenangan Kabupaten Indramayu."
      />

      {/* 2. Scope Chips (Lokasi, Wewenang & Counter) */}
      <MapScopeChips
        locationLabel="Kabupaten Indramayu"
        scopeLabel="Jalan Kabupaten"
        totalReports={totalReportsCount}
        isLoading={isLoading}
      />

      {/* 3. Toolbar & Filters (Search, Status, Severity, Date, Sort, Reset, Export) */}
      <MapFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
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
        scopeLabel="100% Kewenangan Jalan Kabupaten"
        detailPathPrefix="/pu/laporan"
      />
    </div>
  );
}

export default AdminPUMapPage;
