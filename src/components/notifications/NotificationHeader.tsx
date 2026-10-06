import React from "react";

export interface NotificationHeaderProps {
  title?: string;
  subtitle?: string;
}

export function NotificationHeader({
  title = "Notifikasi",
  subtitle = "Pantau pembaruan laporan dan komunikasi warga.",
}: NotificationHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-deepest dark:text-white tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-muted dark:text-[#AFC0D4]">
        {subtitle}
      </p>
    </div>
  );
}

export default NotificationHeader;
