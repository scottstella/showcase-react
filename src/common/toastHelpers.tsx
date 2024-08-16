import { toast, ToastId } from "react-toastify";

interface ErrorObject {
  code: string;
  details: string;
  message: string;
}

export const updateToast = (toastRef: React.MutableRefObject<ToastId | null>, error: ErrorObject | null | undefined, showSuccess: boolean): void => {
  //Not using !== because check fails for undefined
  if (error != null) {
    const errorString = formatErrorMessage(error);
    toast.update(toastRef.current, {
      render: errorString,
      type: toast.TYPE.ERROR,
      autoClose: 5000,
    });
  } else {
    if (showSuccess) {
      toast.update(toastRef.current, {
        render: "Success",
        type: toast.TYPE.INFO,
        autoClose: 1500,
      });
    }
  }
};

export const displayErrorToast = (error: ErrorObject): string => {
  toast.error(formatErrorMessage(error), { autoClose: 5000 });
};

export const formatErrorMessage = (error: ErrorObject): string => {
  return `Error: [${error.code}] ${error.details}, ${error.message}`;
};
