import { CheckCircle2, Star } from "lucide-react";

import { formatDate } from "@/shared/lib/formatDate";

const AcademicYearBanner = ({ academicYears = [] }) => {
  const activeYear =
    academicYears.find((academicYear) => academicYear.is_active) ?? null;

  if (!activeYear) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-4 text-sm text-muted">
        Belum ada tahun akademik aktif. Aktifkan salah satu tahun akademik.
      </div>
    );
  }

  const terms = [...(activeYear.terms ?? [])].sort((a, b) =>
    a.start_date.localeCompare(b.start_date),
  );

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
          <h2 className="text-lg font-bold text-white">
            {activeYear.start_year} / {activeYear.end_year}
          </h2>
          {terms.length > 0 && (
            <p className="mt-1 text-sm text-white/80">
              {formatDate(terms[0].start_date)} —{" "}
              {formatDate(terms[terms.length - 1].end_date)}
            </p>
          )}
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
