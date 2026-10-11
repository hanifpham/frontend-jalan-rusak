import React from 'react';
import { ProfileView } from '@/components/profile';

export function SuperadminProfilePage(): React.JSX.Element {
  return <ProfileView role="super_admin" />;
}

export default SuperadminProfilePage;
