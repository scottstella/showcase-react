import { toast } from "react-toastify";

export const updateToast = (toastId, error, showSuccess) => {
    if (error !== null) {
      const errorString =
        "Error: [" + error.code + "] " + error.details + ", " + error.message;
      toast.update(toastId.current, {
        render: errorString,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    } else {
      if (showSuccess) {
        toast.update(toastId.current, {
          render: "Success",
          type: toast.TYPE.INFO,
          autoClose: 1500,
        });
      }
    }
  };