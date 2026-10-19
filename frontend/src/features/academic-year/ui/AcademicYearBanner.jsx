import { CheckCircle2, Star } from "lucide-react";

const AcademicYearBanner = () => {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-primary p-4 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white/20 p-2.5 text-white">
          <Star size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-white/80">
            Tahun akademik yang sedang aktif
          </p>
          <h2 className="text-lg font-bold text-white">2026 / 2027</h2>
          <p className="mt-1 text-sm text-white/80">3 Jul 2026 — 30 Jun 2027</p>
        </div>
      </div>

      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white">
        <CheckCircle2 size={14} />
        Sedang Berjalan
      </span>
    </div>
  );
};

export default AcademicYearBanner;
