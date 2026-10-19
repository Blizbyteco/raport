import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCheck,
  ClipboardCheck,
  Search,
  Users,
} from "lucide-react";

const mockMeta = {
  class_name: "X RPL 1",
  subject_name: "Matematika",
  teacher_name: "Budi Santoso, S.Pd.",
};

const mockStudents = [
  { id: 1, nis: "26001", name: "Ahmad Fauzan" },
  { id: 2, nis: "26002", name: "Aisyah Putri" },
  { id: 3, nis: "26003", name: "Bagas Pratama" },
  { id: 4, nis: "26004", name: "Citra Lestari" },
  { id: 5, nis: "26005", name: "Dimas Saputra" },
  { id: 6, nis: "26006", name: "Eka Ramadhan" },
  { id: 7, nis: "26007", name: "Fajar Maulana" },
  { id: 8, nis: "26008", name: "Gita Anggraini" },
];

const statusOptions = [
  {
    value: "present",
    label: "Hadir",
    active: "border-success bg-success text-white",
    inactive: "border-border text-muted hover:border-success/50",
  },
  {
    value: "permission",
    label: "Izin",
    active: "border-info bg-info text-white",
    inactive: "border-border text-muted hover:border-info/50",
  },
  {
    value: "sick",
    label: "Sakit",
    active: "border-warning bg-warning text-white",
    inactive: "border-border text-muted hover:border-warning/50",
  },
  {
    value: "absent",
    label: "Alpa",
    active: "border-danger bg-danger text-white",
    inactive: "border-border text-muted hover:border-danger/50",
  },
];

const AttendanceFormPage = () => {
  const navigate = useNavigate();
  const { classSubjectId } = useParams();

  const [search, setSearch] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toLocaleDateString("en-CA"),
      meeting_number: "",
      topic: "",
      notes: "",
      attendance: {},
    },
  });

  const attendance = watch("attendance") || {};

  const filteredStudents = useMemo(
    () =>
      mockStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.nis.includes(search),
      ),
    [search],
  );

  const counts = mockStudents.reduce(
    (acc, student) => {
      const status = attendance[student.id];

      if (status) acc[status] += 1;
      else acc.unmarked += 1;

      return acc;
    },
    {
      present: 0,
      permission: 0,
      sick: 0,
      absent: 0,
      unmarked: 0,
    },
  );

  const setStudentStatus = (studentId, status) => {
    setValue(`attendance.${studentId}.status`, status, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setSubmitMessage("");
  };

  const markAllPresent = () => {
    const allAttendance = {};

    mockStudents.forEach((student) => {
      allAttendance[student.id] = {
        status: "present",
        note: attendance[student.id]?.note || "",
      };
    });

    setValue("attendance", allAttendance, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setSubmitMessage("");
  };

  const onSubmit = (data) => {
    const missing = mockStudents.filter(
      (student) => !data.attendance?.[student.id]?.status,
    );

    if (missing.length > 0) {
      setSubmitMessage(
        `Masih ada ${missing.length} siswa yang belum ditandai.`,
      );
      return;
    }

    const payload = {
      class_subject_id: Number(classSubjectId),
      date: data.date,
      meeting_number: data.meeting_number,
      topic: data.topic,
      notes: data.notes,
      attendance: mockStudents.map((student) => ({
        student_id: student.id,
        status: data.attendance[student.id].status,
        note: data.attendance[student.id].note || "",
      })),
    };

    // TODO: Ganti dengan mutation API Laravel.
    console.log("Attendance payload:", payload);
    setSubmitMessage("Simulasi berhasil. Data siap dikirim ke API.");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(`/classroom/${classSubjectId}`)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Kembali ke Kelas
        </button>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <ClipboardCheck size={16} />
            <span>Absensi</span>
            <span>/</span>
            <span>Input Absensi</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Form Absensi Siswa
          </h1>

          <p className="mt-1 text-sm text-muted">
            Catat kehadiran siswa pada pertemuan mata pelajaran.
          </p>
        </div>
      </div>

      {/* Class information */}
      <div className="flex flex-col gap-3 rounded-xl bg-primary p-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/80">Kelas dan Mata Pelajaran</p>
          <h2 className="mt-1 text-lg font-bold">
            {mockMeta.subject_name} · {mockMeta.class_name}
          </h2>
          <p className="mt-1 text-sm text-white/80">
            Guru: {mockMeta.teacher_name}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm">
          <Users size={17} />
          {mockStudents.length} Siswa
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Session information */}
        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-foreground">
              Informasi Pertemuan
            </h2>
            <p className="mt-1 text-sm text-muted">
              Tentukan tanggal dan materi absensi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Tanggal Absensi
              </label>
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="date"
                  {...register("date", {
                    required: "Tanggal wajib diisi",
                  })}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-xs text-danger">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Attendance list */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="space-y-4 border-b border-border p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-foreground">
                  Daftar Kehadiran
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Tandai status kehadiran setiap siswa.
                </p>
              </div>

              <button
                type="button"
                onClick={markAllPresent}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-success/30 px-3 text-sm font-medium text-success transition hover:bg-success/10"
              >
                <CheckCheck size={16} />
                Tandai Semua Hadir
              </button>
            </div>

            {/* Status summary */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <CountCard label="Hadir" value={counts.present} color="success" />
              <CountCard label="Izin" value={counts.permission} color="info" />
              <CountCard label="Sakit" value={counts.sick} color="warning" />
              <CountCard label="Alpa" value={counts.absent} color="danger" />
              <CountCard
                label="Belum Diisi"
                value={counts.unmarked}
                color="muted"
              />
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau NIS siswa..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredStudents.map((student, index) => {
              const currentStatus = attendance[student.id]?.status;

              return (
                <div
                  key={student.id}
                  className="flex flex-col gap-3 p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {student.name
                        .split(" ")
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {student.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        NIS {student.nis}
                      </p>
                    </div>

                    <span className="text-xs text-muted">
                      #{mockStudents.indexOf(student) + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {statusOptions.map((option) => {
                      const selected = currentStatus === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setStudentStatus(student.id, option.value)
                          }
                          className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition ${
                            selected ? option.active : option.inactive
                          }`}
                        >
                          {selected && <Check size={15} />}
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  {currentStatus && currentStatus !== "present" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">
                        Keterangan{" "}
                        {currentStatus === "permission"
                          ? "Izin"
                          : currentStatus === "sick"
                            ? "Sakit"
                            : "Alpa"}{" "}
                        (opsional)
                      </label>
                      <input
                        placeholder="Tambahkan keterangan..."
                        {...register(`attendance.${student.id}.note`)}
                        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {filteredStudents.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-muted">
                Siswa tidak ditemukan.
              </p>
            )}
          </div>

          <div className="border-t border-border bg-background/50 px-4 py-3 text-xs text-muted sm:px-5">
            {mockStudents.length - counts.unmarked} dari {mockStudents.length}{" "}
            siswa telah ditandai.
          </div>
        </section>

        {/* Notes and actions */}
        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Catatan Pertemuan (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder="Tambahkan catatan umum untuk absensi pertemuan ini..."
            {...register("notes")}
            className="w-full resize-y rounded-lg border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
          />

          {submitMessage && (
            <p
              className={`mt-3 rounded-lg p-3 text-sm ${
                counts.unmarked > 0
                  ? "bg-warning/10 text-warning"
                  : "bg-success/10 text-success"
              }`}
            >
              {submitMessage}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/classroom/${classSubjectId}`)}
              className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition hover:bg-background"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={counts.unmarked > 0}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ClipboardCheck size={17} />
              Simpan Absensi
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

const CountCard = ({ label, value, color }) => {
  const styles = {
    success: "text-success bg-success/10",
    info: "text-info bg-info/10",
    warning: "text-warning bg-warning/10",
    danger: "text-danger bg-danger/10",
    muted: "text-muted bg-background",
  };

  return (
    <div className="rounded-lg border border-border p-2.5">
      <p className="text-xs text-muted">{label}</p>
      <span
        className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-sm font-bold ${styles[color]}`}
      >
        {value}
      </span>
    </div>
  );
};

export default AttendanceFormPage;
