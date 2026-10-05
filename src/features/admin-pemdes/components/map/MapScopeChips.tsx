import React from "react";
import {
  ReportScopeChips,
  type ReportScopeChipsProps,
} from "../reports/ReportScopeChips";

export type MapScopeChipsProps = ReportScopeChipsProps;

/**
 * MapScopeChips Component
 * Uses ReportScopeChips as the single source of truth for scope indicator chips
 * across Admin Pemdes & Admin PU map pages.
 */
export function MapScopeChips(props: MapScopeChipsProps): React.JSX.Element {
  return <ReportScopeChips {...props} />;
}

export default MapScopeChips;

