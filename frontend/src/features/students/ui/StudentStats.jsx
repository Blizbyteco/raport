import { CheckCircle2, GraduationCap, UserRound, Users } from "lucide-react";

const statItems = [
  {
    label: "Total siswa",
    value: "842",
    detail: "Terdaftar di sistem",
    icon: Users,
    tone: "primary",
  },
  {
    label: "Siswa aktif",
    value: "816",
    detail: "96,9% dari total siswa",
    icon: UserRound,
    tone: "success",
  },
  {
    label: "Data terverifikasi",
    value: "790",
    detail: "Menunggu 52 verifikasi",
    icon: CheckCircle2,
    tone: "info",
  },
  {
    label: "Tingkat akhir",
    value: "128",
    detail: "Kelas XII tahun ini",
    icon: GraduationCap,
    tone: "secondary",
  },
];

const toneClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  secondary: "bg-secondary/10 text-secondary",
};

const StudentStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                  {item.value}
                </p>
              </div>

              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${toneClasses[item.tone]}`}
              >
                <Icon className="size-5" />
              </span>
            </div>

            <p className="mt-4 text-xs font-medium text-muted">{item.detail}</p>
          </article>
        );
      })}
    </div>
  );
};

export default StudentStats;
