import Link from "next/link";

const tabs = [
  { label: "Bank CSP", href: "/banking/bank-csp" },
  { label: "Loan", href: "/banking/loan" },
  { label: "CSP Hardware", href: "/banking/csp-hardware" },
];

export default function BankingTabs({ active }: { active: string }) {
  return (
    <div className="bg-[#0b1a33] border-b border-white/10">
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 flex gap-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              active === t.href
                ? "text-amber-400 border-amber-400"
                : "text-white/60 border-transparent hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
