import React from 'react';
import { NotificationView } from '@/components/notifications';

export function SuperadminNotificationsPage(): React.JSX.Element {
  return (
    <NotificationView
      role="super_admin"
      title="Notifikasi"
      subtitle="Pantau pembaruan laporan, eskalasi sistem, dan komunikasi seluruh wilayah."
      scopeAuthority="nasional"
      reportsBasePath="/superadmin/laporan"
      messagesBasePath="/superadmin/pesan"
    />
  );
}

export default SuperadminNotificationsPage;
