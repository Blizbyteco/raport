import { useMemo, useState } from "react";
import { ArrowRight, GraduationCap, Search, Users } from "lucide-react";
import { useNavigate } from "react-router";

import Input from "@/shared/ui/form/Input";

const classes = [
  { id: 1, name: "X IPA 1", students: 32 },
  { id: 2, name: "X IPA 2", students: 30 },
  { id: 3, name: "XI IPA 1", students: 31 },
  { id: 4, name: "XI IPS 1", students: 29 },
  { id: 5, name: "XII IPA 1", students: 34 },
  { id: 6, name: "XII IPS 1", students: 28 },
];

const StudentPlacementPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Penempatan Siswa
        </h1>
        <p className="mt-1 text-sm text-muted">
          Pilih kelas untuk mengelola siswa di dalamnya.
        </p>
      </div>

      <div className="w-full sm:max-w-sm">
        <Input icon={Search} placeholder="Cari kelas..." />
      </div>

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
                    {classItem.students} siswa
                  </span>
                </div>
              </div>
            </div>

            <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentPlacementPage;
