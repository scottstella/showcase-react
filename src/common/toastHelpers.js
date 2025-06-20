import { toast } from "react-toastify";
const getFriendlyErrorMessage = error => {
  // Handle RLS errors (permission denied)
  if (error.code === "42501") {
    return "You must be logged in to add records";
  }
  if (error.code === "403") {
    return error.message; // Already friendly message from our CardService
  }
  // For other errors, show technical details
  return `Error: [${error.code}] ${error.details}, ${error.message}`;
};
export const updateToast = (toastRef, error, showSuccess) => {
  if (!toastRef.current) return;
  if (error != null) {
    toast.update(toastRef.current, {
      render: getFriendlyErrorMessage(error),
      type: "error",
      autoClose: 5000,
    });
  } else {
    if (showSuccess) {
      toast.update(toastRef.current, {
        render: "Success",
        type: "info",
        autoClose: 1500,
      });
    }
  }
};
export const displayErrorToast = error => {
  toast.error(getFriendlyErrorMessage(error), { autoClose: 5000 });
};
// Keep this for cases where we need the raw error message
export const formatErrorMessage = error => {
  return `Error: [${error.code}] ${error.details}, ${error.message}`;
};
