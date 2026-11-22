import { useState } from "react";
import { ArrowRight, GraduationCap, Search, Users } from "lucide-react";
import { useNavigate } from "react-router";

import Input from "@/shared/ui/form/Input";
import PageHeader from "@/shared/layout/PageHeader";
import useClasses from "@/features/class/hooks/useClasses";

const StudentPlacementPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useClasses(search);
  const classes = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penempatan Siswa"
        description="Pilih kelas untuk mengelola siswa di dalamnya."
      />

      <div className="w-full sm:max-w-sm">
        <Input
          icon={Search}
          placeholder="Cari kelas..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Memuat daftar kelas...</p>
      ) : isError ? (
        <p className="text-sm text-danger">Gagal memuat daftar kelas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((classItem) => (
            <button
              key={classItem.id}
              type="button"
              onClick={() =>
                navigate(`/dashboard/student-placement/${classItem.id}`)
              }
              className="
                group flex w-full cursor-pointer items-center
                justify-between gap-4 rounded-xl border border-border
                bg-card p-4 text-left transition-all
                hover:-translate-y-0.5 hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/30
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="size-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-foreground">
                    {classItem.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <Users className="size-3.5" />
                    <span className="whitespace-nowrap">
                      {classItem.students_count ?? 0} siswa
                    </span>
                  </div>
                </div>
              </div>

              <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}

          {!classes.length && (
            <p className="col-span-full py-10 text-center text-sm text-muted">
              Kelas tidak ditemukan.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPlacementPage;
