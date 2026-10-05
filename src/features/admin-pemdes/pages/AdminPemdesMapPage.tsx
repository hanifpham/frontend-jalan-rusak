import React, { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { useAdminMapReports } from "../api/useAdminPemdesData";
import { MapHeader } from "../components/map/MapHeader";
import { MapScopeChips } from "../components/map/MapScopeChips";
import {
  MapFilters,
  type MapStatusFilter,
  type MapAuthorityFilter,
  type MapSeverityFilter,
  type MapDateFilter,
  type MapSortFilter,
} from "../components/map/MapFilters";
import { MapView } from "../components/map/MapView";

export function AdminPemdesMapPage(): React.JSX.Element {
  const { user } = useAuth();
  const { data: settings } = useSettings();

  // Dynamic village name from authenticated user session (consistent with AdminPemdesReportsPage)
  const villageName =
    user?.wilayahId === 2
      ? "Lobener Lor"
      : user?.wilayahId
        ? `Wilayah #${user.wilayahId}`
        : undefined;

  // Filter states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MapStatusFilter>("all");
  const [authority, setAuthority] = useState<MapAuthorityFilter>("desa");
  const [severity, setSeverity] = useState<MapSeverityFilter>("all");
  const [dateFilter, setDateFilter] = useState<MapDateFilter>("all");
  const [sortBy, setSortBy] = useState<MapSortFilter>("default");

  // React Query hook for verified GET /api/admin/map/laporan
  const { data: mapData, isLoading, error, refetch } = useAdminMapReports();

  // Client-side filtering and sorting on verified backend coordinates
  const displayedReports = useMemo(() => {
    const rawReports = mapData?.reports || [];
    let list = [...rawReports];

    // 1. Search filter by title
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter((r) => r.judul.toLowerCase().includes(query));
    }

    // 2. Status filter
    if (status !== "all") {
      list = list.filter((r) => r.status === status);
    }

    // 3. Severity filter
    if (severity !== "all") {
      list = list.filter(
        (r) => (r.severity || "").toLowerCase() === severity.toLowerCase()
      );
    }

    // 4. Date filter (graceful handling: if timestamp exists filter, otherwise retain)
    if (dateFilter !== "all") {
      const now = new Date();
      list = list.filter((r) => {
        if (!r.createdAt) return true;
        const d = new Date(r.createdAt);
        if (isNaN(d.getTime())) return true;
        if (dateFilter === "today") {
          return d.toDateString() === now.toDateString();
        }
        if (dateFilter === "this_week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return d >= weekAgo;
        }
        if (dateFilter === "this_month") {
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        }
        return true;
      });
    }

    // 5. Sorting
    if (sortBy === "title_asc") {
      list.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (sortBy === "title_desc") {
      list.sort((a, b) => b.judul.localeCompare(a.judul));
    } else if (sortBy === "status") {
      list.sort((a, b) => a.status.localeCompare(b.status));
    }

    return list;
  }, [mapData?.reports, search, status, severity, dateFilter, sortBy]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setAuthority("desa");
    setSeverity("all");
    setDateFilter("all");
    setSortBy("default");
  };

  const totalReportsCount = mapData?.total ?? 0;

  return (
    <div className="flex flex-col gap-6 max-w-full">
      {/* 1. Header & Subtitle */}
      <MapHeader />

      {/* 2. Scope Chips (Lokasi, Wewenang & Counter) */}
      <MapScopeChips
        villageName={villageName}
        totalReports={totalReportsCount}
        isLoading={isLoading}
      />

      {/* 3. Toolbar & Filters (Search, Status, Kewenangan, Keparahan, Tanggal, Urutkan, Reset, Export) */}
      <MapFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        authority={authority}
        onAuthorityChange={setAuthority}
        allowedAuthorities={["desa"]}
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
        reports={displayedReports}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        onRetry={refetch}
        mapDefaultView={settings?.preferences?.map_default_view}
        showLabels={settings?.preferences?.map_show_labels}
      />
    </div>
  );
}

export default AdminPemdesMapPage;
