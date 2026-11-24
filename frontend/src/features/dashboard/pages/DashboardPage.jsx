import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  School,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import useAuth from "@/features/auth/hooks/useAuth";
import useDashboardSummary from "@/features/dashboard/hooks/useDashboardSummary";
import Button from "@/shared/ui/button/Button";
import Alert from "@/shared/ui/feedback/Alert";

const roleLabel = {
  admin: "Administrator",
  teacher: "Guru",
  leader: "Kepala Yayasan",
};

const QuickActionCard = ({ to, icon: Icon, title, description }) => (
  <Link
    to={to}
    className="group rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
  >
    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="size-4" />
    </div>

    <p className="mt-3 text-sm font-bold text-foreground">{title}</p>
    <p className="mt-1 text-xs text-muted">{description}</p>
  </Link>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isPending, isError, refetch, isFetching } =
    useDashboardSummary();

  const summary = data?.data;
  const totals = summary?.totals ?? {};
  const academicYear = summary?.academic_year;
  const classProgress = summary?.class_progress ?? [];

  const averageProgress = classProgress.length
    ? Math.round(
        classProgress.reduce((total, item) => total + item.progress, 0) /
          classProgress.length,
      )
    : 0;

  const completeClasses = classProgress.filter(
    (item) => item.progress >= 100,
  ).length;
  const ongoingClasses = classProgress.filter(
    (item) => item.progress >= 50 && item.progress < 100,
  ).length;
  const delayedClasses = classProgress.filter(
    (item) => item.progress < 50,
  ).length;

  const summaryCards = [
    {
      title: "Total Siswa",
      value: totals.students ?? 0,
      description: "Siswa terdaftar",
      icon: GraduationCap,
    },
    {
      title: "Total Guru",
      value: totals.teachers ?? 0,
      description: "Guru aktif",
      icon: Users,
    },
    {
      title: "Total Kelas",
      value: totals.classes ?? 0,
      description: "Kelas terdaftar",
      icon: School,
    },
    {
      title: "Mata Pelajaran",
      value: totals.subjects ?? 0,
      description: "Mata pelajaran aktif",
      icon: BookOpen,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />

            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {academicYear
                ? `Tahun Ajaran ${academicYear.start_year}/${academicYear.end_year}`
                : "Tahun ajaran belum tersedia"}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Selamat datang, {user?.full_name ?? "Pengguna"}
          </h1>

          <p className="mt-1 text-sm text-muted">
            Pantau aktivitas akademik dan progres e-Rapor sekolah.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground">
          <LayoutDashboard className="size-4 text-primary" />
          {roleLabel[user?.role] ?? "Pengguna"}
        </div>
      </div>

      {isError && (
        <Alert
          type="danger"
          message="Gagal memuat data dashboard."
          onClose={() => refetch()}
        />
      )}

      {isPending ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-12 text-sm text-muted">
          <LoaderCircle className="size-4 animate-spin" />
          Memuat data dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted">
                      {card.title}
                    </p>

                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                      {Number(card.value).toLocaleString("id-ID")}
                    </h2>

                    <p className="mt-1 text-xs text-muted">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 xl:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="size-4" />
                    </div>

                    <h2 className="font-bold text-foreground">
                      Progres Pengisian Rapor
                    </h2>
                  </div>

                  <p className="mt-2 text-xs text-muted">
                    Persentase kelengkapan nilai setiap kelas.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="S"
                  isLoading={isFetching}
                  onClick={() => refetch()}
                >
                  Muat ulang
                </Button>
              </div>

              {classProgress.length === 0 ? (
                <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
                  Belum ada kelas untuk ditampilkan.
                </p>
              ) : (
                <div className="mt-6 space-y-5">
                  {classProgress.map((item) => (
                    <div key={item.id}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {item.name}
                          </p>

                          <p className="text-xs text-muted">
                            {item.students} siswa
                          </p>
                        </div>

                        <span
                          className={`text-xs font-bold ${
                            item.progress >= 100
                              ? "text-success"
                              : item.progress >= 50
                                ? "text-primary"
                                : "text-warning"
                          }`}
                        >
                          {item.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-border">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.progress >= 100
                              ? "bg-success"
                              : item.progress >= 50
                                ? "bg-primary"
                                : "bg-warning"
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ClipboardCheck className="size-4" />
                </div>

                <h2 className="font-bold text-foreground">Status Rapor</h2>
              </div>

              <p className="mt-2 text-xs text-muted">
                Ringkasan progres pengisian rapor semester ini.
              </p>

              <div className="mt-6 flex items-center justify-center">
                <div className="relative flex size-40 items-center justify-center rounded-full border-[14px] border-primary/10">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-foreground">
                      {averageProgress}%
                    </p>

                    <p className="text-xs font-medium text-muted">Rata-rata</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success" />

                    <span className="text-xs font-medium text-foreground/80">
                      Kelas selesai
                    </span>
                  </div>

                  <span className="text-xs font-bold text-foreground">
                    {completeClasses}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" />

                    <span className="text-xs font-medium text-foreground/80">
                      Dalam proses
                    </span>
                  </div>

                  <span className="text-xs font-bold text-foreground">
                    {ongoingClasses}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-warning" />

                    <span className="text-xs font-medium text-foreground/80">
                      Perlu perhatian
                    </span>
                  </div>

                  <span className="text-xs font-bold text-foreground">
                    {delayedClasses}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div>
              <h2 className="font-bold text-foreground">Akses Cepat</h2>

              <p className="mt-1 text-xs text-muted">
                Menu yang sering digunakan dalam pengelolaan rapor.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <QuickActionCard
                to="/dashboard/students"
                icon={GraduationCap}
                title="Data Siswa"
                description="Kelola data siswa"
              />
              <QuickActionCard
                to="/dashboard/classes"
                icon={School}
                title="Data Kelas"
                description="Kelola data kelas"
              />
              <QuickActionCard
                to="/dashboard/teacher-placement"
                icon={UserPlus}
                title="Penempatan Guru"
                description="Atur guru dan mapel"
              />
              <QuickActionCard
                to="/dashboard/academic-year"
                icon={CalendarDays}
                title="Tahun Akademik"
                description="Kelola tahun ajaran"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
