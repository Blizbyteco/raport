const PageHeader = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight text-dark sm:text-2xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-xs font-normal text-muted sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
