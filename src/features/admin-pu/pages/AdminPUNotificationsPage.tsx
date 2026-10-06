import React from "react";
import { NotificationView } from "@/components/notifications";

export function AdminPUNotificationsPage(): React.JSX.Element {
  return (
    <NotificationView
      role="admin_pu"
      title="Notifikasi"
      subtitle="Pantau pembaruan laporan dan komunikasi warga wilayah Kabupaten Indramayu."
      scopeAuthority="kabupaten"
      reportsBasePath="/pu/laporan"
      messagesBasePath="/pu/pesan"
    />
  );
}

export default AdminPUNotificationsPage;
