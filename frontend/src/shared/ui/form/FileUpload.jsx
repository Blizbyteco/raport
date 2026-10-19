import { Upload } from "lucide-react";

const FileUpload = ({
  id,
  name,
  accept,
  multiple = false,
  title = "Pilih file",
  description = "Klik untuk memilih file atau seret file ke area ini.",
  maxSize,
  icon: Icon = Upload,
  className = "",
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-12 text-center transition-colors hover:border-primary hover:bg-primary/5 ${className}`}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>

      <h3 className="mt-4 font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>

      {maxSize && (
        <span className="mt-4 text-xs font-medium text-muted">
          Maksimal ukuran file {maxSize}
        </span>
      )}

      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        {...props}
      />
    </label>
  );
};

export default FileUpload;
