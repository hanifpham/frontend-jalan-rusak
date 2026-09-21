import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';

export function AppShell(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex flex-col antialiased">
      {/* Floating Centered Sticky Navbar */}
      <TopNavbar onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />

      {/* Main Body: Desktop Sidebar + Page View */}
      <div className="w-[95%] max-w-7xl mx-auto flex-1 flex gap-6 pt-6 pb-12">
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
