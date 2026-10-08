"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
export default function EmiCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(24);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const n = tenure;
    const e =
      monthlyRate === 0
        ? amount / n
        : (amount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
          (Math.pow(1 + monthlyRate, n) - 1);
    const total = e * n;
    return { emi: e, totalInterest: total - amount, totalAmount: total };
  }, [amount, rate, tenure]);

  const principalPct = Math.round((amount / totalAmount) * 100) || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <label className="flex justify-between text-sm font-medium text-brand-navy mb-2">
            Loan Amount <span>₹{amount.toLocaleString("en-IN")}</span>
          </label>
          <input
            type="range"
            min={50000}
            max={5000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="flex justify-between text-sm font-medium text-brand-navy mb-2">
            Interest Rate (%) <span>{rate}%</span>
          </label>
          <input
            type="range"
            min={5}
            max={20}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="flex justify-between text-sm font-medium text-brand-navy mb-2">
            Loan Tenure (months) <span>{tenure}</span>
          </label>
          <input
            type="range"
            min={6}
            max={360}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center">
        <div
          className="w-40 h-40 rounded-full mb-6"
          style={{
            background: `conic-gradient(#17b6e8 0% ${principalPct}%, #d8102e ${principalPct}% 100%)`,
          }}
        />
        <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
        <p className="text-3xl font-bold text-brand-navy mb-4">
          ₹{emi.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </p>
        <div className="flex gap-6 text-sm text-gray-500 mb-6">
          <span>
            Principal:{" "}
            <b className="text-brand-navy">₹{amount.toLocaleString("en-IN")}</b>
          </span>
          <span>
            Interest:{" "}
            <b className="text-brand-navy">
              ₹
              {totalInterest.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </b>
          </span>
        </div>
        <Link
          href="/banking/loan/apply"
          className="inline-block rounded-full bg-brand-navy text-white text-sm font-semibold px-8 py-3 hover:bg-brand-cyan transition-colors"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
