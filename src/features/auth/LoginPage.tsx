import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { ShieldCheck, AlertCircle, LogIn } from 'lucide-react';
import { apiClient } from '@/services/api/client';
import { isApiError } from '@/services/api/errors';
import { useAuth } from './useAuth';
import { type UserSummary, type Role } from '@/types/domain';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format alamat email tidak valid'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi'),
});

interface BackendLoginPayload {
  token?: string;
  user?: {
    id?: number;
    nama?: string;
    email?: string;
    role?: Role;
    wilayah_id?: number;
    foto_profil?: string;
  };
  // Flat response variant if returned without nested user object
  id?: number;
  nama?: string;
  email?: string;
  role?: Role;
  wilayah_id?: number;
  data?: {
    token?: string;
    user?: {
      id?: number;
      nama?: string;
      email?: string;
      role?: Role;
      wilayah_id?: number;
    };
  };
}

export function LoginPage(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFormErrors({});

    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      // Verified endpoint from docs/05-api-contract.md: POST /api/login
      const response = await apiClient.post<BackendLoginPayload>('/login', {
        email,
        password,
      });

      // Defensive normalization of login response per docs/05-api-contract.md & docs/12-known-unknowns.md
      const token = response.token || response.data?.token;
      const rawUser = response.user || response.data?.user || response;

      if (!token) {
        throw new Error('Peladen tidak memberikan token otentikasi yang valid.');
      }

      const user: UserSummary = {
        id: rawUser.id || 0,
        nama: rawUser.nama || email.split('@')[0] || 'Admin',
        email: rawUser.email || email,
        role: rawUser.role || 'admin_pu',
        wilayahId: rawUser.wilayah_id,
        profilePhoto: response.user?.foto_profil,
      };

      login(token, user);

      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (isApiError(err)) {
        setServerError(err.message);
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Gagal melakukan proses masuk. Silakan periksa koneksi Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-navy-primary text-white mb-3 shadow-md">
            <ShieldCheck className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-deepest">
            ROADIS Indramayu
          </h1>
          <p className="mt-1 text-sm text-muted">
            Portal Administrasi & Pemantauan Kerusakan Jalan
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-blue-pale/50 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-navy-deepest">Masuk ke Akun</CardTitle>
            <CardDescription>
              Masukkan kredensial resmi administrator untuk mengakses dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {serverError && (
              <div
                className="mb-5 p-3.5 rounded-control bg-severity-berat/10 border border-severity-berat/20 flex items-start gap-2.5 text-xs text-severity-berat font-medium"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Alamat Email"
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="nama@indramayukab.go.id"
                value={email}
                error={formErrors.email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <Input
                label="Kata Sandi"
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                error={formErrors.password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  Masuk Sekarang
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <p className="mt-6 text-center text-xs text-muted">
          Akses terbatas untuk personel berwenang Pemkab Indramayu & Dinas PU.
        </p>
      </div>
    </main>
  );
}
