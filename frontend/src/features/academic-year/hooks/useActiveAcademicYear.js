import useAcademicYears from "./useAcademicYears";

const useActiveAcademicYear = () => {
  const query = useAcademicYears();
  const academicYears = query.data?.data ?? [];

  return {
    ...query,
    academicYears,
    data:
      academicYears.find((academicYear) => academicYear.is_active) ??
      academicYears[0] ??
      null,
  };
};

export default useActiveAcademicYear;
