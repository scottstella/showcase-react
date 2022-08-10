import { toast } from "react-toastify";

export const updateToast = (toastRef, error, showSuccess) => {
  //Not using !== because check fails for undefined
  if (error != null) {
    console.log("    -updateToast: error is not null so updating to ERROR");
    const errorString =
      "Error: [" + error.code + "] " + error.details + ", " + error.message;

    toast.update(toastRef.current, {
      render: errorString,
      type: toast.TYPE.ERROR,
      autoClose: 5000,
    });
  } else {
    console.log("    -updateToast: error is null so updating to SUCCESS");
    if (showSuccess) {
      console.log("    -show success is true!");
      toast.update(toastRef.current, {
        render: "Success",
        type: toast.TYPE.INFO,
        autoClose: 1500,
      });
    }
  }
};

export const displayErrorToast = (error) => {
  toast.error(error.message, { autoClose: 5000 });
};
