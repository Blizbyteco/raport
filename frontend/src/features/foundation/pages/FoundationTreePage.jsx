import PageHeader from "@/shared/layout/PageHeader";

import FoundationTree from "../ui/FoundationTree";
import useFoundationOfficials from "../hooks/useFoundationOfficials";

const FoundationTreePage = () => {
  const { data, isLoading, isError } = useFoundationOfficials();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Struktur Yayasan"
        description="Susunan pengurus yayasan yang menaungi sekolah."
      />

      <FoundationTree
        officials={data ?? []}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default FoundationTreePage;
