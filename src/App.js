import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

function UserCard({ user }) {
  return (
    <div>
      <h2>
        {user.name} {user.fLastName} {user.sLastName}
      </h2>
      <p>ID: {user.id}</p>
      <p>Mail: {user.email}</p>
      <p>Fecha de Nacimiento: {user.birthday}</p>
      <p>Telefono: {user.phone}</p>
      <p>Analista Asignado: {user.assignedAnalyst}</p>
      <p>Tarjeta: {user.cardInfo.number}</p>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  if (!users) return "Loading...";

  const usersList = users.map((user) => {
    return <UserCard key={user.id} user={user} />;
  });

  return (
    <div className="App">
      <h1>Atrato App</h1>
      {usersList}
    </div>
  );
}

export default App;
