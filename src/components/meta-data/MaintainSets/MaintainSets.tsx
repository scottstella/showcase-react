import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast, Id } from "react-toastify";
import MaintainSetsResults from "./MaintainSetsResults";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik, FormikHelpers } from "formik";
import { setSchema } from "../../../schemas/index";
import type { Set } from "../../../dto/Set";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import "./MaintainSets.css";

interface FormValues {
  name: string;
  is_standard: boolean;
  release_date: string;
}

export default function MaintainSets({
  cardService = cardServiceImpl,
}: {
  cardService?: typeof cardServiceImpl;
}) {
  const [sets, setSets] = useState<Set[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const addToastRef = useRef<Id | null>(null);
  const deleteToastRef = useRef<Id | null>(null);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik<FormValues>(
    {
      initialValues: {
        name: "",
        is_standard: false,
        release_date: new Date().toISOString().split("T")[0], // Default to today's date
      },
      validationSchema: setSchema,
      onSubmit,
    }
  );

  useEffect(() => {
    fetchSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values: FormValues, actions: FormikHelpers<FormValues>) {
    addSet(values, actions);
  }

  async function fetchSets() {
    setIsLoading(true);
    const { data, error } = await cardService.fetchSets();

    if (error == null) {
      setSets(data as Set[]);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }

  async function addSet(values: FormValues, actions: FormikHelpers<FormValues>) {
    addToastRef.current = toast("Adding record...");

    const { error } = await cardService.addSet({
      ...values,
      created_at: new Date().toISOString(),
    } as Set);

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchSets();
    }
  }

  async function deleteSet(e: React.MouseEvent<SVGSVGElement>) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteSet(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      fetchSets();
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    // Blur the input to close the picker after selection
    e.target.blur();
  };

  return (
    <div className="maintain-data">
      <div className="input-group">
        <form onSubmit={handleSubmit} role="form">
          <div className="form-row">
            <div>
              <div className="form-control">
                <label htmlFor="name">Name</label>
                <div className="input-container">
                  <input
                    placeholder="Name"
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.name && touched.name ? "error" : ""}
                  />
                  {errors.name && touched.name && <div className="error-msg">{errors.name}</div>}
                </div>
              </div>

              <div className="checkbox-control">
                <label>
                  <input
                    type="checkbox"
                    id="is_standard"
                    name="is_standard"
                    checked={values.is_standard}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  Standard Set
                </label>
              </div>
            </div>

            <div className="form-control date-control">
              <label htmlFor="release_date">Release Date</label>
              <div className="input-container">
                <input
                  ref={dateInputRef}
                  type="date"
                  id="release_date"
                  name="release_date"
                  value={values.release_date}
                  onChange={handleDateChange}
                  onBlur={handleBlur}
                  className={errors.release_date && touched.release_date ? "error" : ""}
                />
                <div className="icon-container">
                  <FontAwesomeIcon icon={faCalendar} className="date-picker-icon" />
                </div>
                {errors.release_date && touched.release_date && (
                  <div className="error-msg">{errors.release_date}</div>
                )}
              </div>
            </div>

            <input type="submit" value="Submit" className="submit-button" />
          </div>
        </form>
      </div>

      <MaintainSetsResults isLoading={isLoading} sets={sets} deleteSet={deleteSet} />
    </div>
  );
}
