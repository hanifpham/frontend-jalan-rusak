import React from 'react';

export interface ReportPageHeaderProps {
  villageName?: string;
}

export function ReportPageHeader({ villageName }: ReportPageHeaderProps): React.JSX.Element {
  const displayVillage = villageName ? `Desa ${villageName.replace(/^Desa\s+/i, '')}` : 'Wilayah belum tersedia';

  return (
    <div className="flex flex-col gap-1 px-1">
      <h1 className="text-[28px] font-bold text-navy-deepest tracking-tight leading-tight">
        Daftar Laporan
      </h1>
      <p className="text-[14px] text-muted leading-normal">
        Laporan kerusakan jalan desa di wilayah {displayVillage}.
      </p>
    </div>
  );
}

export default ReportPageHeader;
