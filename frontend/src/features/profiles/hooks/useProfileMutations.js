import { useMutation } from "@tanstack/react-query";

import { updatePassword, updateProfile } from "../api/profileApi";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};
