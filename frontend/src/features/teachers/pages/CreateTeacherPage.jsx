import PageHeader from "@/shared/layout/PageHeader";
import TeacherForm from "../ui/TeacherForm";

const CreateTeacherPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Tambah Guru"
        description="Tambahkan data guru baru ke dalam sistem."
      />
      <TeacherForm />
    </div>
  );
};

export default CreateTeacherPage;
