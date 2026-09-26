import React from 'react';

export function MapHeader(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 px-1">
      <h1 className="text-[28px] font-bold text-navy-deepest tracking-tight leading-tight">
        Peta Laporan
      </h1>
      <p className="text-[14px] text-muted leading-normal">
        Pantau lokasi laporan kerusakan jalan desa di wilayah Anda.
      </p>
    </div>
  );
}

export default MapHeader;
