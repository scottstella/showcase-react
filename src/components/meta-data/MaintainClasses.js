import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/Client";
import "../../common/input-group.css";
import "../../common/table.css";

export default function MaintainClasses() {
  const [heroClasses, setHeroClasses] = useState([]);
  const [heroClass, setHeroClass] = useState({ name: "" });
  const { name } = heroClass;

  useEffect(() => {
    fetchHeroClasses();
  }, []);

  async function fetchHeroClasses() {
    const { data } = await supabase.from("hero_class").select();
    setHeroClasses(data);
    console.log("data: ", data);
  }

  async function addHeroClass() {
    await supabase.from("hero_class").insert([{ name }]).single();
    setHeroClass({ name: "" });
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
                <i class="fa-solid fa-trash-can"></i>
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
