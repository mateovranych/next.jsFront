"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Cat {
  id: number;
  name: string;
  age: number;
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(false);

  const getCats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      const data = await res.json();
      setCats(data); // Actualiza el estado de los gatos con la respuesta del servidor
    } catch (error) {
      console.error("Error fetching cats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <pre>
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      )}
      <button onClick={getCats} disabled={loading}>
        {loading ? "Loading..." : "Get Cats"}
      </button>
      {cats.length > 0 && (
        <div>
          <h2>Mis gatos</h2>
          <ul>
            {cats.map((cat) => (
              <li key={cat.id}>
                <p>Nombre: {cat.name}</p>
                <p>Edad: {cat.age}</p>                
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
