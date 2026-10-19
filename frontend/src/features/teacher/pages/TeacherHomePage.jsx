import useTeacherClasses from "../hooks/useTeacherClasses";
import ClassCard from "../ui/ClassCard";
import HomeroomCard from "../ui/HomeroomCard";
import PageHeader from "@/shared/layout/PageHeader";

// const classes = [
//   {
//     id: 1,
//     nameClass: "X RPL 1",
//     subject: "Matematika",
//     studentCount: 32,
//     schedule: "07:00 - 08:30",
//     status: "ongoing",
//   },
//   {
//     id: 2,
//     nameClass: "X RPL 2",
//     subject: "Matematika",
//     studentCount: 30,
//     schedule: "09:00 - 10:30",
//     status: "upcoming",
//   },
// ];

const TeacherHomePage = () => {
  const { data, isLoading, isError } = useTeacherClasses();

  if (isLoading) {
    return <div>Memuat kelas...</div>;
  }

  if (isError) {
    return <div>Gagal memuat kelas.</div>;
  }

  const classes = data?.data ?? [];
  console.log(classes);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Kelas Anda"
        description="Pilih kelas yang sedang Anda ajar untuk mencatat perkembangan siswa."
      />
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {classes.map((item) => (
            <ClassCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section>
        <PageHeader
          title="Kelas Wali"
          description="Pilih kelas yang sedang Anda pegang untuk memonitoring."
        />
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 mt-4">
          <HomeroomCard
            nameClass="X RPL 1"
            studentCount={17}
            academicYear="2026/2027"
          />
          <HomeroomCard
            nameClass="X RPL 1"
            studentCount={17}
            academicYear="2026/2027"
          />
        </div>
      </section>
    </div>
  );
};

export default TeacherHomePage;
