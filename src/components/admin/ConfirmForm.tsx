"use client";

/** A server-action form that asks for confirmation first (used for every destructive admin operation). */
export default function ConfirmForm({ action, message, children, className }: { action: () => void | Promise<void>; message: string; children: React.ReactNode; className?: string }) {
  return (
    <form action={action} onSubmit={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      <button className={className ?? "text-sm text-red-600 hover:underline"}>{children}</button>
    </form>
  );
}
