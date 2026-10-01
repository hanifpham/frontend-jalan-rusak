import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary caught error]:", error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full py-12 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white rounded-card border border-blue-pale/50 shadow-sm p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-severity-berat flex items-center justify-center mx-auto shadow-2xs">
              <AlertCircle className="w-7 h-7" aria-hidden="true" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-navy-deepest">
                {this.props.fallbackTitle ||
                  "ROADIS mengalami kendala saat memuat halaman"}
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {this.props.fallbackMessage ||
                  "Terjadi kesalahan saat memproses data antarmuka. Silakan muat ulang halaman atau periksa koneksi Anda."}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-navy-primary hover:bg-navy-deepest text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-medium select-none"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Muat Ulang Halaman</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
