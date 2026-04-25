

export const getFirstError = (errorMessage: unknown) => {
  if (!errorMessage) return "";
  if (typeof errorMessage === "string") return errorMessage;
  if (errorMessage instanceof Error) return errorMessage.message;

  if (typeof errorMessage === "object") {
    const maybeMessage = (errorMessage as { message?: unknown }).message;
    if (typeof maybeMessage === "string") return maybeMessage;
  }

  return "Invalid input";
};