import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addExtracurricularStudents,
  assignExtracurricularTeacher,
  removeExtracurricularStudent,
  removeExtracurricularTeacher,
} from "../api/extracurricularApi";

const useSaveExtracurricularMembers = (extracurricularId, academicYearId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      addedTeacherIds,
      removedTeacherIds,
      addedStudentIds,
      removedStudentIds,
    }) => {
      for (const teacherId of addedTeacherIds) {
        await assignExtracurricularTeacher(extracurricularId, {
          academic_year_id: academicYearId,
          teacher_id: Number(teacherId),
        });
      }

      for (const teacherId of removedTeacherIds) {
        await removeExtracurricularTeacher(
          extracurricularId,
          teacherId,
          academicYearId,
        );
      }

      if (addedStudentIds.length > 0) {
        await addExtracurricularStudents(extracurricularId, {
          academic_year_id: academicYearId,
          student_ids: addedStudentIds.map(Number),
        });
      }

      for (const studentId of removedStudentIds) {
        await removeExtracurricularStudent(
          extracurricularId,
          studentId,
          academicYearId,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["extracurricular-teachers", extracurricularId],
      });
      queryClient.invalidateQueries({
        queryKey: ["extracurricular-students", extracurricularId],
      });
      queryClient.invalidateQueries({ queryKey: ["extracurriculars"] });
    },
  });
};

export default useSaveExtracurricularMembers;
