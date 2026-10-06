import React from "react";

export interface MapHeaderProps {
  title?: string;
  subtitle?: string;
}

export function MapHeader({
  title = "Peta Laporan",
  subtitle = "Pantau lokasi laporan kerusakan jalan desa di wilayah Anda.",
}: MapHeaderProps = {}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 px-1">
      <h1 className="text-[28px] font-bold text-navy-deepest tracking-tight leading-tight">
        {title}
      </h1>
      <p className="text-[14px] text-muted dark:text-[#AFC0D4] leading-normal">
        {subtitle}
      </p>
    </div>
  );
}

export default MapHeader;
