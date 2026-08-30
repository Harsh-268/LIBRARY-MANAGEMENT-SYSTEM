export const extractFieldErrors = (err) => {
  const errors = err?.response?.data?.errors;
  if (!Array.isArray(errors)) return {};

  return errors.reduce((acc, { field, message }) => {
    // field paths look like "body.newPassword" — strip the "body." prefix
    const key = field.split(".").pop();
    acc[key] = message;
    return acc;
  }, {});
};