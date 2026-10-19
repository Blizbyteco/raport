const setFormErrors = (error, setError) => {
  const errors = error.response?.data?.errors;

  if (!errors) return;

  Object.entries(errors).forEach(([field, messages]) => {
    setError(field, {
      type: "server",
      message: messages[0],
    });
  });
};

export default setFormErrors;
