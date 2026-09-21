/**
 * ROADIS Core Domain Types & Enums
 * Source of Truth: docs/00-project-context.md, docs/05-api-contract.md, docs/06-data-model.md
 */

export type Role = 'warga' | 'admin_pemdes' | 'admin_pu' | 'super_admin';

export type ReportStatus = 'menunggu' | 'proses' | 'selesai';

export type Severity = 'ringan' | 'sedang' | 'berat';

export type RoadAuthority =
  | 'desa'
  | 'kabupaten'
  | 'provinsi'
  | 'nasional'
  | 'tidak_teridentifikasi';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UserSummary {
  id: number;
  nama: string;
  email: string;
  role: Role;
  wilayahId?: number;
  profilePhoto?: string;
}

/**
 * TARGET Detection Model
 * Intended to be populated by mobile YOLOv11 inference.
 * BACKEND GAP: The current backend does not possess a detections table.
 * RULE: Never fabricate a Detection object from legacy singular `tipe_kerusakan`.
 */
export interface Detection {
  id?: number;
  className: string;
  confidence: number;
  bbox?: BoundingBox;
  severity?: Severity;
  severityScore?: number;
  modelVersion?: string;
}

/**
 * LEGACY Backend Report Fields
 * Verified fields from the existing Go/Gin GORM backend audit.
 */
export interface LegacyBackendReportFields {
  id: number;
  user_id?: number;
  wilayah_id?: number;
  jenis_jalan?: string;
  judul: string;
  deskripsi?: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  tipe_kerusakan?: string; // Singular string in current backend
  status: ReportStatus;
  ditugaskan_ke?: string;
  foto_bukti?: string;
  catatan_admin?: string;
}

/**
 * TARGET Report Model
 * Structured domain representation for the dashboard frontend.
 * Separates verified properties from target fields documented as backend gaps.
 */
export interface Report {
  id: number;
  userId?: number;
  wilayahId?: number;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt?: string;

  /* Target fields (Documented in docs/06-data-model.md) */
  roadName?: string;
  roadAuthority?: RoadAuthority;
  damageType?: string;
  severity?: Severity;
  severityScore?: number;
  priorityScore?: number;
  detections?: Detection[];
  assignedTo?: string;
  handlingNote?: string;
  repairEvidenceUrl?: string;
}
