import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';

export function AppShell(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-navy-deepest antialiased flex flex-col pb-12">
      {/* Floating Centered Top Navbar */}
      <TopNavbar onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />

      {/* Main Layout Wrapper: Compact 72px Sidebar + Main Content Area */}
      <div className="px-6 md:px-10 py-8 gap-8 md:gap-10 w-[95%] mx-auto relative flex items-start flex-1">
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 flex flex-col gap-6" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
