import { toast } from "react-toastify";

export const updateToast = (toastRef, error, showSuccess) => {
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

export const displayErrorToast = (error) => {
  toast.error(formatErrorMessage(error), { autoClose: 5000 });
};

export const formatErrorMessage = (error) => {
  return "Error: [" + error.code + "] " + error.details + ", " + error.message;
};
