import Link from "next/link";

export default function DirectoryAuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
              SRM
            </div>
            <span className="font-bold text-gray-900">Social Route Media</span>
          </div>
          <Link
            href="/directory"
            className="text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50"
          >
            Home
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 text-center mb-6">{subtitle}</p>
        )}

        {children}

        {footer && <div className="text-center mt-6 text-sm">{footer}</div>}
      </div>
    </div>
  );
}
