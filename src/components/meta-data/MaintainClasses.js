import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/Client";

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
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setHeroClass({ ...heroClass, name: e.target.value })}
      />
      <button onClick={addHeroClass}>Add Hero Class</button>
      {heroClasses.map((heroClass) => (
        <div key={heroClass.id}>
          <p>{heroClass.name}</p>
        </div>
      ))}
    </div>
  );
}
