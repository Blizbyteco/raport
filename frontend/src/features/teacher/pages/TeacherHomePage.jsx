import PageHeader from "@/shared/layout/PageHeader";

import useHomeroomClasses from "../hooks/useHomeroomClasses";
import useTeacherClasses from "../hooks/useTeacherClasses";
import ClassCard from "../ui/ClassCard";
import HomeroomCard from "../ui/HomeroomCard";

const TeacherHomePage = () => {
  const {
    data: homeroomData,
    isLoading: homeroomLoading,
    isError: homeroomError,
  } = useHomeroomClasses();

  const {
    data: classData,
    isLoading: classLoading,
    isError: classError,
  } = useTeacherClasses();

  const homeroomClasses = homeroomData?.data ?? [];
  const classSubjects = classData?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <PageHeader
          title="Mata Pelajaran Saya"
          description="Kelas dan mata pelajaran yang Anda ajar. Pilih salah satu untuk mencatat pembelajaran dan laporan sesi."
        />

        {classLoading ? (
          <p className="mt-4 text-sm text-muted">Memuat mata pelajaran...</p>
        ) : classError ? (
          <p className="mt-4 text-sm text-danger">
            Gagal memuat mata pelajaran.
          </p>
        ) : classSubjects.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {classSubjects.map((item) => (
              <ClassCard
                key={item.id}
                id={item.id}
                subject={item.subject}
                classroom={item.classroom}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Belum ada mata pelajaran yang ditugaskan.
          </p>
        )}
      </section>

      <section>
        <PageHeader
          title="Kelas Wali"
          description="Pilih kelas yang sedang Anda pegang untuk memonitoring."
        />

        {homeroomLoading ? (
          <p className="mt-4 text-sm text-muted">Memuat kelas wali...</p>
        ) : homeroomError ? (
          <p className="mt-4 text-sm text-danger">Gagal memuat kelas wali.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {homeroomClasses.map((item) => (
              <HomeroomCard
                key={item.id}
                classroomId={item.classroom?.id}
                nameClass={item.classroom?.name}
                studentCount={item.student_count}
                academicYear={item.academic_year}
              />
            ))}

            {!homeroomClasses.length && (
              <p className="text-sm text-muted">Belum ada kelas wali.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherHomePage;
