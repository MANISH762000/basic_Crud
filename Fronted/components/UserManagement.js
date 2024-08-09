// src/components/UserManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      axios
        .patch(`http://localhost:5000/users/${editing}`, user)
        .then((response) => {
          setUsers(users.map((u) => (u._id === editing ? response.data : u)));
          setEditing(null);
          setUser({ name: "", email: "", password: "", dob: "" });
        })
        .catch((error) => console.error(error));
    } else {
      axios
        .post("http://localhost:5000/users", user)
        .then((response) => {
          setUsers([...users, response.data]);
          setUser({ name: "", email: "", password: "", dob: "" });
        })
        .catch((error) => console.error(error));
    }
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((u) => u._id === id);
    setUser(userToEdit);
    setEditing(id);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/users/${id}`)
      .then(() => {
        setUsers(users.filter((u) => u._id !== id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="date"
          name="dob"
          value={user.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
        />
        <button type="submit">{editing ? "Update" : "Create"}</button>
      </form>

      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email} - {u.dob}
            <button onClick={() => handleEdit(u._id)}>Edit</button>
            <button onClick={() => handleDelete(u._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
