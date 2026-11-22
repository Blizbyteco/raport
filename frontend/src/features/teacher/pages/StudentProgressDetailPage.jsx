import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  TrendingUp,
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
import useClassSubjectEvaluation from "../hooks/useClassSubjectEvaluation";

const monthKeys = [
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
];

const getMonthKey = (date) => (date ? date.slice(0, 7) : "");

const getMonthName = (monthKey) =>
  new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${monthKey}-01`));

const formatDate = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const getAverage = (scores) => {
  if (!scores.length) return null;

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

const StudentProgressDetailPage = () => {
  const navigate = useNavigate();
  const { classSubjectId, studentId } = useParams();

  const [period, setPeriod] = useState("monthly");
  const [month, setMonth] = useState(monthKeys[0]);
  const [semester, setSemester] = useState("ganjil");

  const { data, isLoading, isError } = useClassSubjectEvaluation(classSubjectId);

  const classroom = data?.data?.classroom ?? {};
  const allLessons = data?.data?.lessons ?? [];
  const students = data?.data?.students ?? [];
  const student = students.find(
    (item) => String(item.id) === String(studentId),
  );

  const semesterMonths = useMemo(
    () =>
      semester === "ganjil" ? monthKeys.slice(0, 6) : monthKeys.slice(6),
    [semester],
  );

  const activeLessons = useMemo(() => {
    const keys = period === "monthly" ? [month] : semesterMonths;

    return allLessons.filter((lesson) => keys.includes(getMonthKey(lesson.date)));
  }, [allLessons, period, month, semesterMonths]);

  if (isLoading) {
    return <p className="text-sm text-muted">Memuat detail siswa...</p>;
  }

  if (isError || !student) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Siswa tidak ditemukan"
          description="Data siswa yang diminta tidak tersedia."
        />
        <Button variant="outline" onClick={() => navigate(-1)} icon={ArrowLeft}>
          Kembali
        </Button>
      </div>
    );
  }

  const history = activeLessons.map((lesson) => {
    const globalIndex = allLessons.findIndex((item) => item.id === lesson.id);

    return {
      ...lesson,
      score: student.scores?.[globalIndex],
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
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="S"
          icon={ArrowLeft}
          onClick={() =>
            navigate(`/teacher/class/${classSubjectId}/evaluation`)
          }
          className="-ml-2"
        >
          Kembali ke Evaluasi
        </Button>

        <PageHeader
          title="Detail Perkembangan Siswa"
          description="Riwayat dan grafik perkembangan pembelajaran siswa."
        />
      </div>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
          {student.name
            ?.split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-foreground">{student.name}</h2>
          <p className="mt-1 text-sm text-muted">NISN {student.nis}</p>
          <p className="mt-1 text-sm text-muted">
            {classroom.class} · {classroom.subject} · {classroom.academicYear}
          </p>
        </div>
      </section>

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
              {monthKeys.map((monthKey) => (
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
              <option value="ganjil">Ganjil</option>
              <option value="genap">Genap</option>
            </Select>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={BookOpen}
          label="Pembelajaran"
          value={activeLessons.length}
        />
        <SummaryCard
          icon={TrendingUp}
          label="Rata-rata Nilai"
          value={average ?? "-"}
        />
        <SummaryCard icon={Award} label="Nilai Tertinggi" value={highest} />
        <SummaryCard
          icon={CalendarDays}
          label="Nilai Terendah"
          value={lowest}
        />
      </section>

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
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
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

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold text-foreground">Riwayat Pembelajaran</h2>
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
                <Table.Cell className="text-center">{item.score ?? "-"}</Table.Cell>
                <Table.Cell className="text-sm text-muted">
                  {student.notes || "-"}
                </Table.Cell>
              </Table.Row>
            ))}

            {!history.length && (
              <Table.Row>
                <Table.Cell colSpan={5} className="py-8 text-center">
                  Belum ada riwayat pembelajaran pada periode ini.
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
