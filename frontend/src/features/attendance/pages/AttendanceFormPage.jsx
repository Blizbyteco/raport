import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ClipboardCheck,
  Search,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/form/Input";
import Textarea from "@/shared/ui/form/Textarea";

import useAttendances from "../hooks/useAttendances";
import useAttendance from "../hooks/useAttendance";
import useCreateAttendance from "../hooks/useCreateAttendance";
import useUpdateAttendance from "../hooks/useUpdateAttendance";
import useClassSubjectStudents from "@/features/teacher/hooks/useClassSubjectStudents";

const statusOptions = [
  { value: "present", label: "Hadir" },
  { value: "permission", label: "Izin" },
  { value: "sick", label: "Sakit" },
  { value: "absent", label: "Alpa" },
];

const statusStyles = {
  present: "border-success bg-success text-white",
  permission: "border-info bg-info text-white",
  sick: "border-warning bg-warning text-white",
  absent: "border-danger bg-danger text-white",
};

const inactiveStyle = "border-border text-muted hover:border-primary/50";

const AttendanceFormPage = () => {
  const navigate = useNavigate();
  const { classSubjectId, attendanceId } = useParams();

  const [search, setSearch] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { data: attendanceData } = useAttendances(classSubjectId);
  const { data: attendanceDetail } = useAttendance(attendanceId);
  const { data: studentsData, isLoading: studentsLoading } =
    useClassSubjectStudents(classSubjectId);

  const createMutation = useCreateAttendance();
  const updateMutation = useUpdateAttendance();

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

  const attendance = watch("attendance") ?? {};
  const students = studentsData?.data ?? [];
  const meta = attendanceData?.meta;
  const isEditing = Boolean(attendanceId);

  useEffect(() => {
    if (!attendanceId || !attendanceDetail?.data) return;

    const detail = attendanceDetail.data;
    const values = {};

    (detail.details ?? []).forEach((item) => {
      values[item.student_id] = {
        status: item.status,
        note: item.note ?? "",
      };
    });

    reset({
      date: detail.date ?? "",
      meeting_number: detail.meeting_number ?? "",
      topic: detail.topic ?? "",
      notes: detail.notes ?? "",
      attendance: values,
    });
  }, [attendanceId, attendanceDetail, reset]);

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return students.filter(
      (student) =>
        !keyword ||
        student.name?.toLowerCase().includes(keyword) ||
        student.nis?.toLowerCase().includes(keyword),
    );
  }, [students, search]);

  const counts = students.reduce(
    (accumulator, student) => {
      const status = attendance[student.id]?.status;

      if (status && accumulator[status] !== undefined) {
        accumulator[status] += 1;
      } else {
        accumulator.unmarked += 1;
      }

      return accumulator;
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
    setValue(
      `attendance.${studentId}.status`,
      status,
      { shouldDirty: true, shouldValidate: true },
    );
    setSubmitError("");
  };

  const markAllPresent = () => {
    const allAttendance = {};

    students.forEach((student) => {
      allAttendance[student.id] = {
        status: "present",
        note: attendance[student.id]?.note ?? "",
      };
    });

    setValue("attendance", allAttendance, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSubmitError("");
  };

  const onSubmit = (values) => {
    const missing = students.filter(
      (student) => !values.attendance?.[student.id]?.status,
    );

    if (missing.length > 0) {
      setSubmitError(`Masih ada ${missing.length} siswa yang belum ditandai.`);
      return;
    }

    const payload = {
      date: values.date,
      meeting_number: values.meeting_number
        ? Number(values.meeting_number)
        : null,
      topic: values.topic || null,
      notes: values.notes || null,
      attendance: students.map((student) => ({
        student_id: student.id,
        status: values.attendance[student.id].status,
        note: values.attendance[student.id].note || null,
      })),
    };

    const onSuccess = () =>
      navigate(`/teacher/class/${classSubjectId}/attendance/history`);

    const onError = (error) => {
      setSubmitError(
        error?.response?.data?.message ?? "Gagal menyimpan absensi.",
      );
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: attendanceId, ...payload },
        { onSuccess, onError },
      );
      return;
    }

    createMutation.mutate(
      { classSubjectId, data: payload },
      { onSuccess, onError },
    );
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="S"
          icon={ArrowLeft}
          onClick={() => navigate(`/teacher/class/${classSubjectId}`)}
          className="-ml-2"
        >
          Kembali ke Kelas
        </Button>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <ClipboardCheck size={16} />
            <span>Absensi</span>
            <span>/</span>
            <span>{isEditing ? "Ubah Absensi" : "Input Absensi"}</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Ubah Absensi Siswa" : "Form Absensi Siswa"}
          </h1>

          <p className="mt-1 text-sm text-muted">
            Catat kehadiran siswa pada pertemuan mata pelajaran.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-primary p-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/80">Kelas dan Mata Pelajaran</p>
          <h2 className="mt-1 text-lg font-bold">
            {meta?.subject?.name ?? "-"} · {meta?.classroom?.name ?? "-"}
          </h2>
          <p className="mt-1 text-sm text-white/80">
            Guru: {meta?.teacher?.full_name ?? "-"}
          </p>
        </div>

        <div className="rounded-lg bg-white/15 px-3 py-2 text-sm">
          {students.length} Siswa
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="font-semibold text-foreground">Informasi Pertemuan</h2>
          <p className="mt-1 text-sm text-muted">
            Tentukan tanggal dan materi absensi.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Tanggal absensi"
              type="date"
              required
              error={errors.date?.message}
              {...register("date", { required: "Tanggal wajib diisi" })}
            />

            <Input
              label="Nomor pertemuan"
              type="number"
              min="1"
              placeholder="Contoh: 5"
              {...register("meeting_number")}
            />

            <Input
              label="Materi / topik"
              placeholder="Contoh: Persamaan Kuadrat"
              {...register("topic")}
            />
          </div>
        </section>

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

              <Button
                type="button"
                variant="outline"
                icon={CheckCheck}
                onClick={markAllPresent}
                disabled={!students.length}
              >
                Tandai Semua Hadir
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <CountCard label="Hadir" value={counts.present} tone="success" />
              <CountCard label="Izin" value={counts.permission} tone="info" />
              <CountCard label="Sakit" value={counts.sick} tone="warning" />
              <CountCard label="Alpa" value={counts.absent} tone="danger" />
              <CountCard label="Belum Diisi" value={counts.unmarked} tone="muted" />
            </div>

            <div className="w-full sm:max-w-sm">
              <Input
                icon={Search}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama atau NIS siswa..."
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredStudents.map((student, index) => {
              const currentStatus = attendance[student.id]?.status;

              return (
                <div key={student.id} className="flex flex-col gap-3 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {student.name
                        ?.split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {student.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        NISN {student.nis}
                      </p>
                    </div>

                    <span className="text-xs text-muted">#{index + 1}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {statusOptions.map((option) => {
                      const selected = currentStatus === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setStudentStatus(student.id, option.value)}
                          className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition ${
                            selected ? statusStyles[option.value] : inactiveStyle
                          }`}
                        >
                          {selected && <Check size={15} />}
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  {currentStatus && currentStatus !== "present" && (
                    <Input
                      placeholder="Tambahkan keterangan..."
                      {...register(`attendance.${student.id}.note`)}
                    />
                  )}
                </div>
              );
            })}

            {studentsLoading && (
              <p className="px-5 py-10 text-center text-sm text-muted">
                Memuat daftar siswa...
              </p>
            )}

            {!studentsLoading && !filteredStudents.length && (
              <p className="px-5 py-10 text-center text-sm text-muted">
                Siswa tidak ditemukan.
              </p>
            )}
          </div>

          <div className="border-t border-border bg-background/50 px-4 py-3 text-xs text-muted sm:px-5">
            {students.length - counts.unmarked} dari {students.length} siswa
            telah ditandai.
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <Textarea
            label="Catatan Pertemuan (Opsional)"
            placeholder="Tambahkan catatan umum untuk absensi pertemuan ini..."
            {...register("notes")}
          />

          {submitError && (
            <p className="mt-3 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              {submitError}
            </p>
          )}

          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/teacher/class/${classSubjectId}`)}
            >
              Batal
            </Button>

            <Button
              type="submit"
              icon={ClipboardCheck}
              isLoading={isSubmitting}
              disabled={isSubmitting || !students.length}
            >
              Simpan Absensi
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};

const CountCard = ({ label, value, tone }) => {
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
        className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-sm font-bold ${styles[tone]}`}
      >
        {value}
      </span>
    </div>
  );
};

export default AttendanceFormPage;
