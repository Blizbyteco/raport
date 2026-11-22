import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addStudentsToClass,
  removeStudentFromClass,
} from "../api/placementApi";

export const useAddStudentsToClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }) => addStudentsToClass(classId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["class-students"] });
      queryClient.invalidateQueries({
        queryKey: ["class-students", variables.classId],
      });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useRemoveStudentFromClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, studentId, academicYearId }) =>
      removeStudentFromClass(classId, studentId, academicYearId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["class-students", variables.classId],
      });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
