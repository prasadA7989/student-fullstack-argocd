import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    department: "",
    year_joined: ""
  });

  const API_URL = "/api";

  const loadStudents = async () => {
    const res = await axios.get(`${API_URL}/students`);
    setStudents(res.data);
  };

  const initDb = async () => {
    await axios.get(`${API_URL}/init`);
    alert("Database initialized");
  };

  const addStudent = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/students`, {
      name: form.name,
      department: form.department,
      year_joined: Number(form.year_joined)
    });
    setForm({ name: "", department: "", year_joined: "" });
    loadStudents();
  };

  useEffect(() => {
    loadStudents().catch(() => {});
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Student Records</h1>

      <button onClick={initDb}>Initialize DB</button>

      <form onSubmit={addStudent} style={{ marginTop: "20px" }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        />
        <input
          placeholder="Year Joined"
          value={form.year_joined}
          onChange={(e) => setForm({ ...form, year_joined: e.target.value })}
        />
        <button type="submit">Add Student</button>
      </form>

      <h2>Students List</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Year Joined</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.department}</td>
              <td>{s.year_joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
