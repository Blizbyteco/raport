import PageHeader from "@/shared/layout/PageHeader";
import useTeacherClasses from "../hooks/useTeacherClasses";
import useHomeroomClasses from "../hooks/useHomeroomClasses";
import ClassCard from "../ui/ClassCard";
import HomeroomCard from "../ui/HomeroomCard";

const TeacherHomePage = () => {
  const {
    data: classesData,
    isLoading: classesLoading,
    isError: classesError,
  } = useTeacherClasses();
  const {
    data: homeroomData,
    isLoading: homeroomLoading,
    isError: homeroomError,
  } = useHomeroomClasses();

  const classes = classesData?.data ?? [];
  const homeroomClasses = homeroomData?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Kelas Anda"
        description="Pilih kelas yang sedang Anda ajar untuk mencatat perkembangan siswa."
      />

      <section>
        {classesLoading ? (
          <p className="text-sm text-muted">Memuat kelas...</p>
        ) : classesError ? (
          <p className="text-sm text-danger">Gagal memuat kelas.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((item) => (
              <ClassCard key={item.id} {...item} />
            ))}

            {!classes.length && (
              <p className="text-sm text-muted">
                Belum ada kelas yang Anda ajar.
              </p>
            )}
          </div>
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
