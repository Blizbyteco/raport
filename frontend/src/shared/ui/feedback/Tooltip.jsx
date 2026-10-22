const Tooltip = ({ label, children }) => {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity duration-150 group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100"
      >
        {label}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 right-3 size-2 rotate-45 bg-foreground"
        />
      </span>
    </span>
  );
};

export default Tooltip;
