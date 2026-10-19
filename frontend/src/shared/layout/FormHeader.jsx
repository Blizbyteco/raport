const FormHeader = ({ title, description }) => {
  return (
    <div>
      <h2 className="text-sm font-bold text-dark">{title}</h2>

      {description && (
        <p className="mt-1 text-xs font-normal text-muted sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
};

export default FormHeader;
