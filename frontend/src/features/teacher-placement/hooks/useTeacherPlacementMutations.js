import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createClassSubject,
  deleteClassSubject,
  removeHomeroomTeacher,
  setHomeroomTeacher,
  updateClassSubject,
} from "../api/placementApi";

const invalidatePlacement = (queryClient, classId) => {
  queryClient.invalidateQueries({ queryKey: ["class-subjects", classId] });
  queryClient.invalidateQueries({ queryKey: ["homeroom-teacher", classId] });
  queryClient.invalidateQueries({ queryKey: ["classes"] });
};

export const useCreateClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }) => createClassSubject(classId, data),
    onSuccess: (_, variables) => invalidatePlacement(queryClient, variables.classId),
  });
};

export const useUpdateClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, classSubjectId, data }) =>
      updateClassSubject(classId, classSubjectId, data),
    onSuccess: (_, variables) => invalidatePlacement(queryClient, variables.classId),
  });
};

export const useDeleteClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, classSubjectId }) =>
      deleteClassSubject(classId, classSubjectId),
    onSuccess: (_, variables) => invalidatePlacement(queryClient, variables.classId),
  });
};

export const useSetHomeroomTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }) => setHomeroomTeacher(classId, data),
    onSuccess: (_, variables) => invalidatePlacement(queryClient, variables.classId),
  });
};

export const useRemoveHomeroomTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, academicYearId }) =>
      removeHomeroomTeacher(classId, academicYearId),
    onSuccess: (_, variables) => invalidatePlacement(queryClient, variables.classId),
  });
};
