const Table = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full overflow-x-auto rounded-xl border-l border-t border-r border-border bg-card [scrollbar-width:thin] [scrollbar-color:var(--color-muted)_transparent] ${className}`}
    >
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
};

const Header = ({ children, className = "" }) => {
  return <thead className={className}>{children}</thead>;
};

const Body = ({ children, className = "" }) => {
  return <tbody className={className}>{children}</tbody>;
};

const Row = ({ children, className = "" }) => {
  return <tr className={className}>{children}</tr>;
};

const Head = ({ children, className = "", ...props }) => {
  return (
    <th
      className={`border-b border-border p-4 text-xs font-bold tracking-normal text-muted ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

const Cell = ({ children, className = "", ...props }) => {
  return (
    <td
      className={`border-b border-border p-4 text-xs font-medium text-foreground ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Head = Head;
Table.Cell = Cell;

export default Table;
