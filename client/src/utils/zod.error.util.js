// Pulls the most relevant, user-facing message out of any API error shape
export const normalizeApiError = (error) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again."
    );
};

// Converts the backend's { field, message }[] array into a { fieldName: message }
// map that's easy to spread onto form state. Strips the "body."/"params."/"query."
// prefix that Zod's path includes, since your schemas wrap fields like
// z.object({ body: z.object({ name: ... }) }).
export const extractFieldErrors = (errors = []) => {
    return errors.reduce((acc, { field, message }) => {
        const key = field.replace(/^(body|query|params)\./, "");
        acc[key] = message;
        return acc;
    }, {});
};