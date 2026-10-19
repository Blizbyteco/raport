import PageHeader from "@/shared/layout/PageHeader";
import StudentForm from "../ui/StudentForm";

const CreateStudentPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Tambah Siswa"
        description="Tambahkan data siswa baru ke dalam sistem."
      />
      <StudentForm />
    </div>
  );
};

export default CreateStudentPage;
