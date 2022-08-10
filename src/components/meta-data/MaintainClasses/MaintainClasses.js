import React, { useState, useEffect, useRef } from "react";
import "../../../common/input-group.css";
import "../../../common/table.css";
import { toast } from "react-toastify";
import MaintainClassesResults from "./MaintainClassesResults";

import {
  displayErrorToast,
  updateToast,
} from "../../../common/toastHelpers.js";
import cardServiceImpl from "../../../services/CardService";

export default function MaintainClasses({ cardService = cardServiceImpl }) {
  const [heroClasses, setHeroClasses] = useState([]);
  const [heroClass, setHeroClass] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(true);
  const { name } = heroClass;

  const addToastRef = useRef(null);
  const deleteToastRef = useRef(null);

  useEffect(() => {
    fetchHeroClasses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchHeroClasses() {
    console.log("function fetchHeroClasses");
    setIsLoading(true);
    const { data, error } = await cardServiceImpl.fetchHeroClasses();

    if (error == null) {
      console.log("  * error is null");
      setHeroClasses(data);
      setIsLoading(false);
    } else {
      displayErrorToast(error);
    }
  }

  async function addHeroClass() {
    console.log("function addHeroClass");
    console.log("  * addToastRef display adding record msg");
    addToastRef.current = toast("Adding record...");

    const response = await cardServiceImpl.addHeroClass(heroClass);

    console.log(response);

    updateToast(addToastRef, response.error, true);

    if (response.error == null) {
      setHeroClass({ name: "" });
      fetchHeroClasses();
    }
  }

  async function deleteHeroClass(e) {
    deleteToastRef.current = toast("Deleting record...");
    const response = await cardServiceImpl.deleteHeroClass(e.currentTarget.id);
    console.log(response);
    updateToast(deleteToastRef, response.error, true);

    if (response.error == null) {
      fetchHeroClasses();
    }
  }

  return (
    <div>
      <div class="input-group">
        <input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setHeroClass({ ...heroClass, name: e.target.value })}
        />
        <button onClick={addHeroClass}>
          <i class="fa-regular fa-square-plus"></i> Add Hero Class
        </button>
      </div>

      <MaintainClassesResults
        isLoading={isLoading}
        heroClasses={heroClasses}
        deleteHeroClass={deleteHeroClass}
      />
    </div>
  );
}
