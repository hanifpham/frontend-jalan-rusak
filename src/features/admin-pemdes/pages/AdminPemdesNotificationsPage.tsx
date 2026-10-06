import React from "react";
import { NotificationView } from "@/components/notifications";

export function AdminPemdesNotificationsPage(): React.JSX.Element {
  return (
    <NotificationView
      role="admin_pemdes"
      title="Notifikasi"
      subtitle="Pantau pembaruan laporan dan komunikasi warga."
      scopeAuthority="desa"
      reportsBasePath="/pemdes/laporan"
      messagesBasePath="/pemdes/pesan"
    />
  );
}

export default AdminPemdesNotificationsPage;
