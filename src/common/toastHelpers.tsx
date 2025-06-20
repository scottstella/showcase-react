import { toast, Id as ToastId } from "react-toastify";

interface ErrorObject {
  code: string;
  details: string;
  message: string;
}

const getFriendlyErrorMessage = (error: ErrorObject): string => {
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

export const updateToast = (
  toastRef: React.MutableRefObject<ToastId | null>,
  error: ErrorObject | null | undefined,
  showSuccess: boolean
): void => {
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

export const displayErrorToast = (error: ErrorObject): void => {
  toast.error(getFriendlyErrorMessage(error), { autoClose: 5000 });
};

// Keep this for cases where we need the raw error message
export const formatErrorMessage = (error: ErrorObject): string => {
  return `Error: [${error.code}] ${error.details}, ${error.message}`;
};
