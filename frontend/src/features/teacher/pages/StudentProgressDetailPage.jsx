import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageHeader from "@/shared/layout/PageHeader";
import Button from "@/shared/ui/button/Button";
import Select from "@/shared/ui/form/Select";
import Table from "@/shared/ui/data-display/Table";

import evaluationData from "@/shared/data/evaluationData.json";

const { classroom, lessons, students } = evaluationData;

const getAverage = (scores) => {
  const valid = scores.filter((score) => score !== null && score !== undefined);

  if (!valid.length) return 0;

  return Math.round(
    valid.reduce((sum, score) => sum + score, 0) / valid.length,
  );
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const getMonthName = (monthKey) =>
  new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${monthKey}-01`));

const StudentProgressDetailPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [period, setPeriod] = useState("monthly");
  const [month, setMonth] = useState("2026-09");
  const [semester, setSemester] = useState("ganjil");

  const student = students.find((item) => String(item.id) === studentId);

  const semesterMonths =
    semester === "ganjil"
      ? ["2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12"]
      : ["2027-01", "2027-02", "2027-03", "2027-04", "2027-05", "2027-06"];

  const activeLessons = useMemo(() => {
    if (period === "monthly") {
      return lessons.filter((lesson) => lesson.date.slice(0, 7) === month);
    }

    return lessons.filter((lesson) =>
      semesterMonths.includes(lesson.date.slice(0, 7)),
    );
  }, [period, month, semester]);

  if (!student) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Siswa tidak ditemukan"
          description="Data siswa yang diminta tidak tersedia."
        />
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Kembali
        </Button>
      </div>
    );
  }

  // Score diambil berdasarkan index lesson asli,
  // karena student.scores mengikuti urutan lessons global.
  const history = activeLessons.map((lesson) => {
    const globalIndex = lessons.findIndex((item) => item.id === lesson.id);

    return {
      ...lesson,
      score: student.scores[globalIndex],
    };
  });

  const validScores = history
    .map((item) => item.score)
    .filter((score) => score !== null && score !== undefined);

  const average = getAverage(validScores);
  const highest = validScores.length ? Math.max(...validScores) : "-";
  const lowest = validScores.length ? Math.min(...validScores) : "-";

  const chartData = history
    .filter((item) => item.score !== null && item.score !== undefined)
    .map((item) => ({
      date: formatDate(item.date),
      materi: item.title,
      nilai: item.score,
    }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Kembali ke Evaluasi
        </button>

        <PageHeader
          title="Detail Perkembangan Siswa"
          description="Riwayat dan grafik perkembangan pembelajaran siswa."
        />
      </div>

      {/* Student profile */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
          {student.name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-foreground">{student.name}</h2>
          <p className="mt-1 text-sm text-muted">NISN {student.nis}</p>
          <p className="mt-1 text-sm text-muted">
            {classroom.class} · {classroom.subject} · {classroom.academicYear}
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <BookOpen size={14} />
          Detail Akademik
        </span>
      </section>

      {/* Filters */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Periode"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="monthly">Bulanan</option>
            <option value="semester">Semester</option>
          </Select>

          {period === "monthly" ? (
            <Select
              label="Bulan"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              {[
                "2026-07",
                "2026-08",
                "2026-09",
                "2026-10",
                "2026-11",
                "2026-12",
                "2027-01",
                "2027-02",
                "2027-03",
                "2027-04",
                "2027-05",
                "2027-06",
              ].map((monthKey) => (
                <option key={monthKey} value={monthKey}>
                  {getMonthName(monthKey)}
                </option>
              ))}
            </Select>
          ) : (
            <Select
              label="Semester"
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
            >
              <option value="ganjil">Ganjil 2026/2027</option>
              <option value="genap">Genap 2026/2027</option>
            </Select>
          )}
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={BookOpen}
          label="Pembelajaran"
          value={activeLessons.length}
        />
        <SummaryCard
          icon={TrendingUp}
          label="Rata-rata Nilai"
          value={validScores.length ? average : "-"}
        />
        <SummaryCard icon={Award} label="Nilai Tertinggi" value={highest} />
        <SummaryCard
          icon={CalendarDays}
          label="Nilai Terendah"
          value={lowest}
        />
      </section>

      {/* Progress chart */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-foreground">
            Grafik Perkembangan Nilai
          </h2>
          <p className="mt-1 text-sm text-muted">
            Perkembangan nilai siswa berdasarkan pembelajaran yang telah
            dinilai.
          </p>
        </div>

        {chartData.length ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 12, left: -18, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, "Nilai"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.materi || ""
                  }
                />
                <Line
                  type="monotone"
                  dataKey="nilai"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg bg-background text-sm text-muted">
            Belum ada nilai pada periode ini.
          </div>
        )}
      </section>

      {/* Learning history */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-foreground">
            Riwayat Pembelajaran
          </h2>
          <p className="mt-1 text-sm text-muted">
            Rincian materi dan nilai siswa pada periode terpilih.
          </p>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head className="w-12 text-center">No</Table.Head>
              <Table.Head>Tanggal</Table.Head>
              <Table.Head>Materi Pembelajaran</Table.Head>
              <Table.Head className="text-center">Nilai</Table.Head>
              <Table.Head>Catatan Guru</Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {history.map((item, index) => (
              <Table.Row key={item.id}>
                <Table.Cell className="text-center">{index + 1}</Table.Cell>
                <Table.Cell className="whitespace-nowrap">
                  {formatDate(item.date)}
                </Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-foreground">
                    {item.title}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-center">
                  {item.score ?? "-"}
                </Table.Cell>
                <Table.Cell className="text-sm text-muted">
                  {student.notes || "-"}
                </Table.Cell>
              </Table.Row>
            ))}

            {!history.length && (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <p className="py-8 text-center text-sm text-muted">
                    Belum ada riwayat pembelajaran pada periode ini.
                  </p>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </section>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm text-muted">{label}</p>
      <Icon size={18} className="text-primary" />
    </div>
    <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
  </div>
);

export default StudentProgressDetailPage;
