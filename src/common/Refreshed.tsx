import React from "react";
import { getDateAndTimeString } from "./utils";

interface RefreshedProps {
  loading: boolean;
}

export default function Refreshed(props: RefreshedProps): JSX.Element {
  const getCurrentDateTime = (): string => {
    return getDateAndTimeString(new Date());
  };

  return (
    <div>
      {props.loading
        ? "Loading..."
        : "Data refreshed on " + getCurrentDateTime()}
    </div>
  );
}
