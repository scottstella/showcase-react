import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabase/Client";
import "../../common/input-group.css";
import "../../common/table.css";
import { toast } from "react-toastify";

export default function MaintainClasses() {
  const [heroClasses, setHeroClasses] = useState([]);
  const [heroClass, setHeroClass] = useState({ name: "" });
  const { name } = heroClass;

  const fetchToastId = useRef(null);
  const addToastId = useRef(null);
  const deleteToastId = useRef(null);

  useEffect(() => {
    fetchHeroClasses();
  }, []);

  const updateToast = (toastId, error, showSuccess) => {
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

  async function fetchHeroClasses() {
    fetchToastId.current = toast("Getting Hero Classes...");

    const { data, error } = await supabase.from("hero_class").select();

    updateToast(fetchToastId, error, false);

    if (error === null) {
      setHeroClasses(data);
      toast.dismiss(fetchToastId.current);
    }
  }

  async function addHeroClass() {
    addToastId.current = toast("Adding record...");

    const { data, error } = await supabase
      .from("hero_class")
      .insert([{ name }])
      .single();

    updateToast(addToastId, error, true);

    if (error === null) {
      setHeroClass({ name: "" });
      fetchHeroClasses();
    }
  }

  async function deleteHeroClass(e) {
    deleteToastId.current = toast("Deleting record...");
    const { data, error } = await supabase
      .from("hero_class")
      .delete()
      .eq("id", e.currentTarget.id);

    updateToast(deleteToastId, error, true);

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
        <thead>
          <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Name</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
