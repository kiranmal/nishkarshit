import DirectoryHeader from "@/components/directory/DirectoryHeader";
import DirectoryFooter from "@/components/directory/DirectoryFooter";

export default function MagazinePage() {
  return (
    <>
      <DirectoryHeader />
      <main>
        <section className="border-b border-gray-100 py-6">
          <div className="max-w-[1300px] mx-auto px-4 md:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Magazine</h1>
              <p className="text-gray-400 text-sm">40 pages</p>
            </div>
            <span className="text-sm text-gray-400">
              A full page-flip reader can be wired in here once the real
              magazine PDF is supplied.
            </span>
          </div>
        </section>

        <section className="max-w-[1300px] mx-auto px-4 md:px-8 py-16 flex justify-center">
          <div className="w-full max-w-sm aspect-[3/4] rounded-lg shadow-xl bg-gradient-to-br from-blue-700 to-emerald-600 flex flex-col items-center justify-center text-white text-center p-8">
            <div className="text-xs font-bold bg-amber-400 text-[#0b1224] px-3 py-1 rounded-full mb-4">
              16th Edition 2025-26
            </div>
            <h2 className="text-2xl font-extrabold leading-tight mb-2">
              Printing &amp; Electronic Directory
            </h2>
            <p className="text-sm text-white/70">No.1 Directory of Media, 2021–32</p>
          </div>
        </section>
      </main>
      <DirectoryFooter />
    </>
  );
}
