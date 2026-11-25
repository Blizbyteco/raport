const getHomePath = (role) => {
  if (role === "teacher") {
    return "/teacher";
  }

  if (role === "admin" || role === "leader") {
    return "/dashboard";
  }

  return "/profile";
};

export default getHomePath;
