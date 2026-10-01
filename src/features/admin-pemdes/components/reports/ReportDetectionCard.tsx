import React from "react";
import { Brain, Info, AlertCircle } from "lucide-react";
import { type Detection } from "@/types/domain";

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
    <div className="bg-white dark:bg-[#0D1A2D] rounded-card border border-blue-pale/40 dark:border-[rgba(193,232,255,0.12)] shadow-sm p-6 flex flex-col gap-4">
      {/* Header: AI Icon + Title & Model Badge */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Brain
            className="w-5 h-5 text-navy-primary dark:text-blue-pale"
            aria-hidden="true"
          />
          <h2 className="text-[17px] font-bold text-navy-deepest">
            Hasil Deteksi AI
          </h2>
        </div>

        <span
          className="inline-flex items-center gap-1 bg-blue-pale/30 dark:bg-[#5483B3]/20 text-navy-primary dark:text-blue-pale border border-blue-supporting/30 dark:border-[#5483B3]/40 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider select-none"
          title={
            modelVersion
              ? `Model: ${modelVersion}`
              : "Model Target YOLOv11 (Backend Gap)"
          }
        >
          {modelVersion || "YOLOv11 (Target)"}
        </span>
      </div>

      {/* Detections List or Honest Backend Gap State */}
      {hasDetections && detections ? (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/10">
          {detections.map((item, idx) => (
            <div
              key={`det-${idx}`}
              className="py-4 first:pt-0 last:pb-0 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[15px] font-bold text-navy-deepest">
                    {item.className}
                  </h3>
                  <p className="text-[12px] text-muted dark:text-[#AFC0D4] mt-0.5">
                    Objek kerusakan terdeteksi pada area jalan.
                  </p>
                </div>
                {item.severity && (
                  <span className="inline-flex items-center gap-1 bg-severity-berat/10 text-severity-berat border border-severity-berat/25 px-2.5 py-1 rounded-full text-[11px] font-bold">
                    {item.severity}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 bg-canvas/60 dark:bg-[#12233A] rounded-xl p-3 text-center">
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted dark:text-[#8FA4BA]">
                    Confidence
                  </span>
                  <span className="text-[16px] font-extrabold text-navy-deepest">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted dark:text-[#8FA4BA]">
                    Severity
                  </span>
                  <span className="text-[15px] font-bold text-navy-deepest">
                    {item.severity || "—"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted dark:text-[#8FA4BA]">
                    Severity Score
                  </span>
                  <span className="text-[16px] font-extrabold text-navy-deepest">
                    {item.severityScore !== undefined
                      ? item.severityScore
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Honest Backend-Gap State (Rule 7: Never fabricate fake detections) */
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-canvas dark:bg-[#12233A] border border-blue-pale/40 dark:border-white/10 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-pale/50 dark:bg-[#5483B3]/20 text-navy-primary dark:text-blue-pale flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-navy-deepest">
                Data Deteksi AI Belum Tersedia dari Backend
              </h4>
              <p className="text-[12px] text-muted dark:text-[#AFC0D4] leading-relaxed">
                Backend saat ini belum memiliki tabel/entitas deteksi objek AI
                (bounding box koordinat, confidence level, dan skor keparahan
                per-objek). ROADIS tidak menampilkan data AI tiruan demi
                integritas data operasional.
              </p>
            </div>
          </div>

          {/* Categorical damage reported by citizen */}
          {damageType && (
            <div className="p-3.5 bg-blue-pale/15 dark:bg-[#5483B3]/10 rounded-xl border border-blue-pale/40 dark:border-white/10 flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-[#8FA4BA]">
                  Kategori Kerusakan Dilaporkan
                </span>
                <span className="text-[14px] font-bold text-navy-deepest mt-0.5 truncate">
                  {damageType}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-navy-primary dark:text-blue-pale bg-white dark:bg-[#0D1A2D] px-2.5 py-1 rounded-full border border-blue-pale/50 dark:border-white/10 shrink-0">
                Data Form Warga
              </span>
            </div>
          )}
        </div>
      )}

      {/* Informational Guidance Note (Always present per Stitch design) */}
      <div className="mt-1 p-3 rounded-xl bg-blue-pale/30 dark:bg-[#5483B3]/15 border border-blue-supporting/30 dark:border-[#5483B3]/30 flex items-start gap-2.5 text-[12px] text-muted dark:text-[#AFC0D4]">
        <Info
          className="w-4 h-4 text-navy-primary dark:text-blue-pale shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="leading-relaxed">
          Confidence menunjukkan tingkat keyakinan model AI, bukan tingkat
          keparahan kerusakan.
        </p>
      </div>
    </div>
  );
}

export default ReportDetectionCard;
