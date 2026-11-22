import { useState } from "react";
import { useNavigate } from "react-router";
import { Download, Save } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import FileUpload from "@/shared/ui/form/FileUpload";
import PageHeader from "@/shared/layout/PageHeader";
import FormHeader from "@/shared/layout/FormHeader";
import Alert from "@/shared/ui/feedback/Alert";
import { downloadCsv, parseCsv } from "@/shared/lib/csv";

import useCreateStudent from "../hooks/useCreateStudent";

const CSV_HEADERS = ["nisn", "full_name", "gender", "parent_name"];

const getErrorMessage = (error) => {
  const errors = error.response?.data?.errors;

  if (errors) {
    return Object.values(errors).flat().join(" ");
  }

  return (
    error.response?.data?.message ?? error.message ?? "Terjadi kesalahan."
  );
};

const ImportStudentsPage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateStudent();

  const [file, setFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleDownloadTemplate = () => {
    downloadCsv("template-siswa.csv", [CSV_HEADERS]);
  };

  const handleImport = async (event) => {
    event.preventDefault();

    if (!file || isImporting) return;

    setIsImporting(true);
    setFeedback(null);

    const errors = [];
    let imported = 0;

    try {
      const rows = parseCsv(await file.text());
      const [header, ...dataRows] = rows;

      if (!header) {
        errors.push("File CSV kosong.");
      } else {
        const columns = header.map((column) => column.trim().toLowerCase());
        const missing = CSV_HEADERS.filter((name) => !columns.includes(name));

        if (missing.length > 0) {
          errors.push(`Kolom wajib tidak ditemukan: ${missing.join(", ")}.`);
        } else {
          const columnIndex = (name) => columns.indexOf(name);

          for (const [index, cells] of dataRows.entries()) {
            const nisn = (cells[columnIndex("nisn")] ?? "").trim();
            const fullName = (cells[columnIndex("full_name")] ?? "").trim();
            const gender = (cells[columnIndex("gender")] ?? "").trim();
            const parentName = (cells[columnIndex("parent_name")] ?? "").trim();

            if (!nisn && !fullName && !gender && !parentName) continue;

            if (!nisn || !fullName) {
              errors.push(
                `Baris ${index + 2}: NISN dan nama lengkap wajib diisi.`,
              );
              continue;
            }

            try {
              await createMutation.mutateAsync({
                nisn,
                full_name: fullName,
                gender: gender || null,
                parent_name: parentName || null,
              });
              imported += 1;
            } catch (error) {
              errors.push(`Baris ${index + 2}: ${getErrorMessage(error)}`);
            }
          }
        }
      }

      if (imported === 0 && errors.length === 0) {
        errors.push("Tidak ada data siswa untuk diimpor.");
      }

      setFeedback({
        type: errors.length === 0 ? "success" : "warning",
        message:
          errors.length === 0
            ? `${imported} siswa berhasil diimpor.`
            : `${imported} siswa berhasil diimpor, ${errors.length} baris gagal.`,
        errors,
      });

      if (errors.length === 0) {
        setFile(null);
        window.setTimeout(() => navigate("/dashboard/students"), 1500);
        return;
      }
    } catch (error) {
      setFeedback({
        type: "danger",
        message: getErrorMessage(error),
        errors: [],
      });
    }

    setIsImporting(false);
  };

  return (
    <form onSubmit={handleImport} className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Import Siswa"
        description="Tambahkan banyak data siswa sekaligus melalui file CSV."
      />
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader
            title="Upload file CSV"
            description="Gunakan file dengan format .csv."
          />
        </div>

        <div className="p-5 sm:p-6">
          <FileUpload
            id="student-file"
            name="student-file"
            accept=".csv,text/csv"
            title="Pilih file CSV"
            description="Klik untuk memilih file atau seret file CSV ke area ini."
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <FormHeader title="Format file" />
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-3 rounded-lg sm:flex-row sm:items-center sm:justify-between">
            <FormHeader
              title="Belum punya template?"
              description="Download template CSV agar format kolom sesuai."
            />
            <Button
              type="button"
              variant="outline"
              size="S"
              icon={Download}
              onClick={handleDownloadTemplate}
            >
              Download template
            </Button>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="space-y-3">
          <Alert
            type={feedback.type}
            message={feedback.message}
            duration={0}
            onClose={() => setFeedback(null)}
          />

          {feedback.errors.length > 0 && (
            <ul className="list-disc space-y-1 rounded-xl border border-border bg-card p-4 pl-8 text-sm text-danger">
              {feedback.errors.map((error, index) => (
                <li key={`${index}-${error}`}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="M"
          onClick={() => navigate("/dashboard/students")}
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="M"
          icon={Save}
          isLoading={isImporting}
          disabled={!file || isImporting}
        >
          Impor siswa
        </Button>
      </div>
    </form>
  );
};

export default ImportStudentsPage;
