import React from "react";
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardCheck,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  MoreHorizontal,
  FileText,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

const summaryCards = [
  {
    title: "Total Siswa",
    value: "842",
    description: "Siswa terdaftar",
    icon: Users,
    trend: "+4.8%",
    trendLabel: "dari semester lalu",
  },
  {
    title: "Total Guru",
    value: "64",
    description: "Guru aktif",
    icon: GraduationCap,
    trend: "+2",
    trendLabel: "guru baru",
  },
  {
    title: "Total Kelas",
    value: "28",
    description: "Kelas aktif",
    icon: School,
    trend: "100%",
    trendLabel: "data terverifikasi",
  },
  {
    title: "Mata Pelajaran",
    value: "42",
    description: "Mata pelajaran",
    icon: BookOpen,
    trend: "92%",
    trendLabel: "nilai telah masuk",
  },
];

const recentActivities = [
  {
    title: "Nilai Matematika diperbarui",
    description: "Kelas XII IPA 1",
    time: "5 menit lalu",
    type: "success",
  },
  {
    title: "Nilai belum lengkap",
    description: "Bahasa Indonesia — XI IPS 2",
    time: "24 menit lalu",
    type: "warning",
  },
  {
    title: "Rapor berhasil diterbitkan",
    description: "Kelas XII IPA 3",
    time: "1 jam lalu",
    type: "info",
  },
  {
    title: "Data siswa diperbarui",
    description: "12 data siswa",
    time: "2 jam lalu",
    type: "success",
  },
];

const classProgress = [
  {
    name: "X IPA 1",
    students: 32,
    progress: 96,
  },
  {
    name: "X IPA 2",
    students: 31,
    progress: 91,
  },
  {
    name: "XI IPA 1",
    students: 30,
    progress: 84,
  },
  {
    name: "XI IPS 2",
    students: 29,
    progress: 72,
  },
  {
    name: "XII IPA 1",
    students: 32,
    progress: 100,
  },
];

const quickActions = [
  {
    title: "Data Siswa",
    description: "Kelola data siswa",
    icon: GraduationCap,
    color: "primary",
  },
  {
    title: "Input Nilai",
    description: "Kelola nilai siswa",
    icon: BookOpen,
    color: "secondary",
  },
  {
    title: "Validasi Rapor",
    description: "Periksa kelengkapan",
    icon: ClipboardCheck,
    color: "success",
  },
  {
    title: "Cetak Rapor",
    description: "Cetak laporan siswa",
    icon: FileText,
    color: "info",
  },
];

const activityConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    background: "bg-success/10",
  },
  warning: {
    icon: Clock3,
    color: "text-warning",
    background: "bg-warning/10",
  },
  info: {
    icon: FileText,
    color: "text-info",
    background: "bg-info/10",
  },
};

const DashboardPage = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />

            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Semester Ganjil 2025/2026
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Selamat datang 👋
          </h1>

          <p className="mt-1 text-sm text-muted">
            Pantau aktivitas akademik dan progres e-Rapor sekolah.
          </p>
        </div>

        <button
          type="button"
          className="
              inline-flex items-center justify-center gap-2
              rounded-xl
              bg-primary
              px-4 py-2.5
              text-sm font-bold
              text-white
            "
        >
          <FileText className="size-4" />
          Lihat Rekap Rapor
          <ArrowUpRight className="size-4" />
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="
                  rounded-2xl
                  border border-border
                  bg-card
                  p-5
                "
            >
              <div className="flex items-start justify-between">
                <div
                  className="
                      flex size-11 items-center justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                    "
                >
                  <Icon className="size-5" />
                </div>

                <button
                  type="button"
                  className="
                      rounded-lg
                      p-1.5
                      text-muted
                      transition-colors
                      hover:bg-primary/10
                      hover:text-primary
                    "
                  aria-label={`More options for ${card.title}`}
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-muted">{card.title}</p>

                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                  {card.value}
                </h2>

                <p className="mt-1 text-xs text-muted">{card.description}</p>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs">
                <span className="font-bold text-success">{card.trend}</span>

                <span className="text-muted">{card.trendLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* RAPOR PROGRESS */}
        <div
          className="
              rounded-2xl
              border border-border
              bg-card
              p-5
              xl:col-span-2
            "
        >
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

            <button
              type="button"
              className="
                  hidden
                  rounded-lg
                  px-3 py-1.5
                  text-xs font-bold
                  text-primary
                  transition-colors
                  hover:bg-primary/10
                  sm:block
                "
            >
              Lihat semua
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {classProgress.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {item.name}
                    </p>

                    <p className="text-xs text-muted">{item.students} siswa</p>
                  </div>

                  <span
                    className={`
                        text-xs font-bold
                        ${
                          item.progress === 100
                            ? "text-success"
                            : item.progress >= 80
                              ? "text-primary"
                              : "text-warning"
                        }
                      `}
                  >
                    {item.progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className={`
                        h-full rounded-full transition-all
                        ${
                          item.progress === 100
                            ? "bg-success"
                            : item.progress >= 80
                              ? "bg-primary"
                              : "bg-warning"
                        }
                      `}
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RAPOR STATUS */}
        <div
          className="
              rounded-2xl
              border border-border
              bg-card
              p-5
            "
        >
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardCheck className="size-4" />
              </div>

              <h2 className="font-bold text-foreground">Status Rapor</h2>
            </div>

            <p className="mt-2 text-xs text-muted">
              Status penerbitan rapor semester ini.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div
              className="
                  relative
                  flex size-40
                  items-center justify-center
                  rounded-full
                  border-[14px]
                  border-primary/10
                "
            >
              <div className="text-center">
                <p className="text-3xl font-extrabold text-foreground">78%</p>

                <p className="text-xs font-medium text-muted">Selesai</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />

                <span className="text-xs font-medium text-foreground/80">
                  Sudah diterbitkan
                </span>
              </div>

              <span className="text-xs font-bold text-foreground">656</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock3 className="size-4 text-warning" />

                <span className="text-xs font-medium text-foreground/80">
                  Dalam proses
                </span>
              </div>

              <span className="text-xs font-bold text-foreground">124</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 text-danger" />

                <span className="text-xs font-medium text-foreground/80">
                  Belum lengkap
                </span>
              </div>

              <span className="text-xs font-bold text-foreground">62</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTENT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* RECENT ACTIVITIES */}
        <div
          className="
              rounded-2xl
              border border-border
              bg-card
              p-5
            "
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-foreground">Aktivitas Terbaru</h2>

              <p className="mt-1 text-xs text-muted">
                Aktivitas terbaru dalam sistem e-Rapor.
              </p>
            </div>

            <button
              type="button"
              className="
                  text-xs font-bold
                  text-primary
                  hover:underline
                "
            >
              Lihat semua
            </button>
          </div>

          <div className="mt-5 divide-y divide-border">
            {recentActivities.map((activity, index) => {
              const config = activityConfig[activity.type];
              const ActivityIcon = config.icon;

              return (
                <div
                  key={`${activity.title}-${index}`}
                  className="
                      flex items-center gap-3
                      py-3.5
                      first:pt-4
                      last:pb-0
                    "
                >
                  <div
                    className={`
                        flex size-9 shrink-0
                        items-center justify-center
                        rounded-xl
                        ${config.background}
                        ${config.color}
                      `}
                  >
                    <ActivityIcon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {activity.title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted">
                      {activity.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] font-medium text-muted">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div
          className="
              rounded-2xl
              border border-border
              bg-card
              p-5
            "
        >
          <div>
            <h2 className="font-bold text-foreground">Akses Cepat</h2>

            <p className="mt-1 text-xs text-muted">
              Menu yang sering digunakan dalam pengelolaan rapor.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  className={`
                      group
                      rounded-xl
                      border border-border
                      bg-background
                      p-4
                      text-left
                      transition-colors
                      hover:border-${action.color}/30
                      hover:bg-${action.color}/5
                    `}
                >
                  <div
                    className={`
                        flex size-9
                        items-center justify-center
                        rounded-lg
                        bg-${action.color}/10
                        text-${action.color}
                      `}
                  >
                    <Icon className="size-4" />
                  </div>

                  <p className="mt-3 text-sm font-bold text-foreground">
                    {action.title}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    {action.description}
                  </p>

                  <ArrowUpRight
                    className={`
                        mt-3 size-4
                        text-muted
                        transition-colors
                        group-hover:text-${action.color}
                      `}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
