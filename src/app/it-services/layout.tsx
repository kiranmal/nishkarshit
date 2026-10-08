export default function ITServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark bg-black-100 text-white min-h-screen w-full">
      {children}
    </div>
  );
}
