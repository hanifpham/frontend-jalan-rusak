import React from 'react';

export function App(): React.JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-canvas text-navy-deepest">
      <div className="w-full max-w-md bg-white rounded-card shadow-sm border border-blue-pale/50 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy-primary text-white mb-4 font-bold text-lg">
          R
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-deepest">
          ROADIS Web
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sistem Pemantauan & Pelaporan Kerusakan Jalan Kabupaten Indramayu
        </p>
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-status-selesai" />
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Fase 1: Foundation Ready
          </span>
        </div>
      </div>
    </main>
  );
}

export default App;
