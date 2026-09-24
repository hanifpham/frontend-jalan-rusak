import React, { useState, useEffect } from 'react';
import { Camera, ZoomIn, X, Image as ImageIcon } from 'lucide-react';
import { type Detection } from '@/types/domain';

export interface ReportImageCardProps {
  imageUrl?: string;
  title: string;
  detections?: Detection[];
}

export function ReportImageCard({
  imageUrl,
  title,
  detections,
}: ReportImageCardProps): React.JSX.Element {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Close lightbox on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    }

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  const hasRealDetections = Boolean(detections && detections.length > 0);

  return (
    <>
      <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-6 flex flex-col gap-4">
        {/* Card Header: Camera Icon + Title & Zoom Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-navy-primary" aria-hidden="true" />
            <h2 className="text-[17px] font-bold text-navy-deepest">
              Foto Kerusakan Jalan
            </h2>
          </div>

          {imageUrl && !imageError && (
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-primary hover:bg-canvas px-3.5 py-1.5 rounded-full border border-blue-pale/40 transition-colors cursor-pointer select-none"
              title="Perbesar Foto"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
              <span>Perbesar Foto</span>
            </button>
          )}
        </div>

        {/* Image Frame Area */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-blue-pale/30 bg-slate-900 group min-h-80 sm:min-h-90 flex items-center justify-center">
          {imageUrl && !imageError ? (
            <>
              <img
                src={imageUrl}
                alt={`Foto kerusakan: ${title}`}
                onError={() => setImageError(true)}
                className="w-full h-90 object-cover"
                loading="lazy"
              />

              {/* Detection Overlay ONLY if real detections are provided from backend */}
              {hasRealDetections && detections && (
                <div className="absolute inset-0 pointer-events-none p-4">
                  {detections.map((det, index) => {
                    if (!det.bbox) return null;
                    const { x, y, width, height } = det.bbox;
                    return (
                      <div
                        key={`bbox-${index}`}
                        className="absolute border-2 border-severity-berat rounded-lg bg-severity-berat/10 shadow-lg"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${width}%`,
                          height: `${height}%`,
                        }}
                      >
                        <span className="absolute -top-3.5 left-2 bg-severity-berat text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                          {det.className} • {Math.round(det.confidence * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-slate-400">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <ImageIcon className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  Foto Tidak Tersedia
                </p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Foto kerusakan jalan belum diunggah atau tautan gambar tidak dapat dimuat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Fullscreen Lightbox Modal */}
      {isLightboxOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deepest/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau foto: ${title}`}
        >
          {/* Backdrop close click */}
          <div
            className="fixed inset-0"
            onClick={() => setIsLightboxOpen(false)}
            aria-hidden="true"
          />

          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col border border-blue-pale/40">
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <div className="min-w-0 pr-4">
                <h3 className="text-base font-bold text-navy-deepest truncate">
                  {title}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Foto resolusi asli laporan kerusakan jalan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-9 h-9 rounded-full bg-canvas hover:bg-gray-200 text-navy-deepest flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Pratinjau Foto"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Lightbox Image Viewport */}
            <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-2">
              <img
                src={imageUrl}
                alt={`Pratinjau besar: ${title}`}
                className="max-h-[75vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportImageCard;
