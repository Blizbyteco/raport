import { Landmark, Mail, Pencil, Phone, Trash2, UserRound } from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Tooltip from "@/shared/ui/feedback/Tooltip";

const sortOfficials = (a, b) =>
  (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name);

const buildTree = (officials = []) => {
  const nodes = new Map();

  officials.forEach((official) => {
    nodes.set(official.id, { ...official, children: [] });
  });

  const roots = [];

  nodes.forEach((node) => {
    const parent =
      node.parent_id && node.parent_id !== node.id
        ? nodes.get(node.parent_id)
        : null;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortTree = (list) => {
    list.sort(sortOfficials);
    list.forEach((node) => sortTree(node.children));
  };

  sortTree(roots);

  return roots;
};

const OfficialCard = ({ official, canManage, onEdit, onDelete }) => (
  <article className="group w-full max-w-2xl rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 ring-primary hover:ring-1">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Landmark className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {official.position}
          </p>
          <h2 className="mt-1 truncate text-sm font-semibold text-foreground">
            {official.name}
          </h2>
          {official.period && (
            <p className="mt-1 text-xs text-muted">
              Periode {official.period}
            </p>
          )}
        </div>
      </div>

      {canManage && (
        <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
          <Tooltip label="Ubah data pengurus">
            <Button
              variant="ghost"
              size="S"
              icon={Pencil}
              iconOnly
              onClick={() => onEdit?.(official)}
              aria-label={`Ubah data ${official.name}`}
            />
          </Tooltip>

          <Tooltip label="Hapus data pengurus">
            <Button
              variant="ghost"
              size="S"
              icon={Trash2}
              iconOnly
              onClick={() => onDelete?.(official)}
              aria-label={`Hapus data ${official.name}`}
            />
          </Tooltip>
        </div>
      )}
    </div>

    {(official.phone || official.email) && (
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted">
        {official.phone && (
          <span className="inline-flex items-center gap-1.5">
            <Phone className="size-3.5" aria-hidden="true" />
            {official.phone}
          </span>
        )}
        {official.email && (
          <span className="inline-flex items-center gap-1.5">
            <Mail className="size-3.5" aria-hidden="true" />
            {official.email}
          </span>
        )}
      </div>
    )}
  </article>
);

const TreeNode = ({ node, depth, canManage, onEdit, onDelete }) => (
  <li className="relative">
    {depth > 0 && (
      <span
        aria-hidden="true"
        className="absolute -left-4 top-8 h-px w-4 bg-border sm:-left-6 sm:w-6"
      />
    )}

    <OfficialCard
      official={node}
      canManage={canManage}
      onEdit={onEdit}
      onDelete={onDelete}
    />

    {node.children.length > 0 && (
      <ul className="ml-3 mt-3 space-y-3 border-l border-border pl-4 sm:ml-5 sm:pl-6">
        {node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            canManage={canManage}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    )}
  </li>
);

const FoundationTree = ({
  officials = [],
  isLoading = false,
  isError = false,
  canManage = false,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <p className="text-sm text-muted">Memuat struktur yayasan...</p>;
  }

  if (isError) {
    return <p className="text-sm text-danger">Gagal memuat struktur yayasan.</p>;
  }

  const roots = buildTree(officials);

  if (!roots.length) {
    return (
      <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-background text-muted">
          <UserRound className="size-5" />
        </div>

        <h2 className="mt-4 font-bold text-card-foreground">
          Belum ada pengurus yayasan
        </h2>

        <p className="mt-1 text-sm text-muted">
          {canManage
            ? "Tambahkan susunan pengurus yayasan terlebih dahulu."
            : "Struktur pengurus yayasan belum diisi."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {roots.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default FoundationTree;
