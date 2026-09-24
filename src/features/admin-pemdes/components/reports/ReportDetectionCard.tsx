import React from 'react';
import { Brain, Info, AlertCircle } from 'lucide-react';
import { type Detection } from '@/types/domain';

export interface ReportDetectionCardProps {
  damageType?: string;
  detections?: Detection[];
  modelVersion?: string;
}

export function ReportDetectionCard({
  damageType,
  detections,
  modelVersion,
}: ReportDetectionCardProps): React.JSX.Element {
  const hasDetections = Boolean(detections && detections.length > 0);

  return (
    <div className="bg-white rounded-card border border-blue-pale/40 shadow-sm p-6 flex flex-col gap-4">
      {/* Header: AI Icon + Title & Model Badge */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-navy-primary" aria-hidden="true" />
          <h2 className="text-[17px] font-bold text-navy-deepest">
            Hasil Deteksi AI
          </h2>
        </div>

        <span
          className="inline-flex items-center gap-1 bg-blue-pale/30 text-navy-primary border border-blue-supporting/30 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider select-none"
          title={modelVersion ? `Model: ${modelVersion}` : 'Model Target YOLOv11 (Backend Gap)'}
        >
          {modelVersion || 'YOLOv11 (Target)'}
        </span>
      </div>

      {/* Detections List or Honest Backend Gap State */}
      {hasDetections && detections ? (
        <div className="flex flex-col divide-y divide-gray-100">
          {detections.map((item, idx) => (
            <div key={`det-${idx}`} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[15px] font-bold text-navy-deepest">
                    {item.className}
                  </h3>
                  <p className="text-[12px] text-muted mt-0.5">
                    Objek kerusakan terdeteksi pada area jalan.
                  </p>
                </div>
                {item.severity && (
                  <span className="inline-flex items-center gap-1 bg-severity-berat/10 text-severity-berat border border-severity-berat/25 px-2.5 py-1 rounded-full text-[11px] font-bold">
                    {item.severity}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 bg-canvas/60 rounded-xl p-3 text-center">
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted">Confidence</span>
                  <span className="text-[16px] font-extrabold text-navy-deepest">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted">Severity</span>
                  <span className="text-[15px] font-bold text-navy-deepest">
                    {item.severity || '—'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted">Severity Score</span>
                  <span className="text-[16px] font-extrabold text-navy-deepest">
                    {item.severityScore !== undefined ? item.severityScore : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Honest Backend-Gap State (Rule 7: Never fabricate fake detections) */
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-canvas border border-blue-pale/40 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-pale/50 text-navy-primary flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-navy-deepest">
                Data Deteksi AI Belum Tersedia dari Backend
              </h4>
              <p className="text-[12px] text-muted leading-relaxed">
                Backend saat ini belum memiliki tabel/entitas deteksi objek AI (bounding box koordinat, confidence level, dan skor keparahan per-objek). ROADIS tidak menampilkan data AI tiruan demi integritas data operasional.
              </p>
            </div>
          </div>

          {/* Categorical damage reported by citizen */}
          {damageType && (
            <div className="p-3.5 bg-blue-pale/15 rounded-xl border border-blue-pale/40 flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Kategori Kerusakan Dilaporkan
                </span>
                <span className="text-[14px] font-bold text-navy-deepest mt-0.5 truncate">
                  {damageType}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-navy-primary bg-white px-2.5 py-1 rounded-full border border-blue-pale/50 shrink-0">
                Data Form Warga
              </span>
            </div>
          )}
        </div>
      )}

      {/* Informational Guidance Note (Always present per Stitch design) */}
      <div className="mt-1 p-3 rounded-xl bg-blue-pale/30 border border-blue-supporting/30 flex items-start gap-2.5 text-[12px] text-muted">
        <Info className="w-4 h-4 text-navy-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          Confidence menunjukkan tingkat keyakinan model AI, bukan tingkat keparahan kerusakan.
        </p>
      </div>
    </div>
  );
}

export default ReportDetectionCard;
