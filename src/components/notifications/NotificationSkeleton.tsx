import React from "react";

export function NotificationSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Memuat notifikasi">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-4 sm:p-5 rounded-2xl border border-blue-pale/25 dark:border-white/5 bg-canvas/40 dark:bg-white/5 flex items-start gap-4 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-3/4" />
            <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded w-1/4 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;
