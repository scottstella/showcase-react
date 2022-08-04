import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabase/Client";
import "../../common/input-group.css";
import "../../common/table.css";
import { toast } from "react-toastify";
import Refreshed from "../../common/Refreshed";
import { updateToast } from "../../common/toastHelpers.js";

export default function MaintainClasses() {
  const [heroClasses, setHeroClasses] = useState([]);
  const [heroClass, setHeroClass] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(true);
  const { name } = heroClass;

  const fetchToastRef = useRef(null);
  const addToastRef = useRef(null);
  const deleteToastRef = useRef(null);

  useEffect(() => {
    fetchHeroClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchHeroClasses() {
    setIsLoading(true);
    const { data, error } = await supabase.from("hero_class").select();

    updateToast(fetchToastRef, error, false);

    if (error === null) {
      setHeroClasses(data);
      setIsLoading(false);
    }
  }

  async function addHeroClass() {
    addToastRef.current = toast("Adding record...");

    const { error } = await supabase
      .from("hero_class")
      .insert([{ name }])
      .single();

    updateToast(addToastRef, error, true);

    if (error === null) {
      setHeroClass({ name: "" });
      fetchHeroClasses();
    }
  }

  async function deleteHeroClass(e) {
    deleteToastRef.current = toast("Deleting record...");
    const { error } = await supabase
      .from("hero_class")
      .delete()
      .eq("id", e.currentTarget.id);

    updateToast(deleteToastRef, error, true);

    if (error === null) {
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

      <table>
        <caption>
          <Refreshed loading={isLoading} />
        </caption>
        <thead>
          <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Name</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {heroClasses.map((heroClass) => (
            <tr>
              <td style={{ width: "75px" }}>
                <i
                  class="fa-solid fa-trash-can"
                  id={heroClass.id}
                  onClick={deleteHeroClass}
                ></i>
              </td>
              <td style={{ width: "75px" }}>{heroClass.id}</td>
              <td>{heroClass.name}</td>
              <td>{heroClass.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
