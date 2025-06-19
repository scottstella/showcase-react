import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast, Id } from "react-toastify";
import MaintainClassesResults from "./MaintainClassesResults.js";
import { FormikHelpers } from "formik";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";
import cardServiceImpl from "../../../services/CardService";
import { useFormik } from "formik";
import { heroClassSchema } from "../../../schemas/index.js";
import type { HeroClass } from "../../../dto/HeroClass";

interface FormValues {
  name: string;
}

export default function MaintainClasses({ cardService = cardServiceImpl }) {
  const [heroClasses, setHeroClasses] = useState<HeroClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const addToastRef = useRef<Id | null>(null);
  const deleteToastRef = useRef<Id | null>(null);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: heroClassSchema,
    onSubmit,
  });

  useEffect(() => {
    fetchHeroClasses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(values: FormValues, actions: FormikHelpers<FormValues>) {
    addHeroClass(values, actions);
  }

  async function fetchHeroClasses() {
    setIsLoading(true);
    const { data, error } = await cardService.fetchHeroClasses();

    if (error == null) {
      setHeroClasses(data as HeroClass[]);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }

  async function addHeroClass(values: FormValues, actions: FormikHelpers<FormValues>) {
    addToastRef.current = toast("Adding record...");

    const { error } = await cardService.addHeroClass({
      ...values,
      id: 0, // temporary id, will be replaced by server
      created_at: new Date().toISOString(),
    });

    updateToast(addToastRef, error, true);

    if (error == null) {
      actions.resetForm();
      fetchHeroClasses();
    }
  }

  async function deleteHeroClass(e: React.MouseEvent<SVGSVGElement>) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await cardService.deleteHeroClass(Number(e.currentTarget.id));
    updateToast(deleteToastRef, error, true);

    if (error == null) {
      fetchHeroClasses();
    }
  }

  return (
    <div className="maintain-data">
      <div className="input-group">
        <form onSubmit={handleSubmit} role="form">
          <div className="form-control">
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
          <input type="submit" value="Submit" />
        </form>
      </div>

      <MaintainClassesResults
        isLoading={isLoading}
        heroClasses={heroClasses}
        deleteHeroClass={deleteHeroClass}
      />
    </div>
  );
}
