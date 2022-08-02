import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/Client";
import "../../common/input-group.css";
import "../../common/table.css";
import { toast } from "react-toastify";

export default function MaintainClasses() {
  const [heroClasses, setHeroClasses] = useState([]);
  const [heroClass, setHeroClass] = useState({ name: "" });
  const { name } = heroClass;

  useEffect(() => {
    fetchHeroClasses();
  }, []);

  async function fetchHeroClasses() {
    console.log("fetching data");
    const { data, error } = await supabase.from("hero_class").select();

    if (error !== null) {
      const errorString =
        "Error fetching data: (" + error.code + ") - " + error.message;
      toast.error(errorString);
    } else {
      toast.info("Successfully fetched data");
      setHeroClasses(data);
    }
  }

  async function addHeroClass() {
    await supabase.from("hero_class").insert([{ name }]).single();

    setHeroClass({ name: "" });
    fetchHeroClasses();
  }

  async function deleteHeroClass(e) {
    await supabase.from('hero_class').delete().eq('id', e.currentTarget.id);
    fetchHeroClasses();
  }

  return (
    <div>
      <div class="input-group">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setHeroClass({ ...heroClass, name: e.target.value })}
        />
        <button onClick={addHeroClass}>Add Hero Class</button>
        <button onClick={deleteHeroClass}>Delete Record</button>
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
                <i class="fa-solid fa-trash-can" id={heroClass.id} onClick={deleteHeroClass}></i>
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
