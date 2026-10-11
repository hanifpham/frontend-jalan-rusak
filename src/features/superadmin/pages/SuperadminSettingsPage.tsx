import React from 'react';
import { SettingsView } from '@/components/settings';

export function SuperadminSettingsPage(): React.JSX.Element {
  return <SettingsView role="super_admin" />;
}

export default SuperadminSettingsPage;
