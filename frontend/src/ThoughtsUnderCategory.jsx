import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const ThoughtsUnderCategory = () => {
  const location = useLocation();
  const { id, username = "Guest", category } = location.state || {};

  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState("");
  const [editingIds, setEditingIds] = useState(new Set());
  const [updatedThoughts, setUpdatedThoughts] = useState({});

  const getThoughts = async () => {
    try {
      const response = await axios.get(`http://localhost:1234/thoughtsundercategory/`, {
        params: { id },
        withCredentials: true,
      });
      console.log("Thoughts data:", response.data);
      setThoughts(response.data);
    } catch (error) {
      console.log("Error fetching thoughts:", error);
    }
  };

  const postThought = async (e) => {
    e.preventDefault();
    if (!newThought.trim()) return;
    try {
      await axios.post(
        `http://localhost:1234/thoughtsundercategory/`,
        { id, thought: newThought} ,
        {withCredentials: true }
      );
      setNewThought("");
      getThoughts();
    } catch (error) {
      console.log("Error adding thought:", error);
    }
  };

  const updateThought = async (thoughtId) => {
    const updatedText = updatedThoughts[thoughtId];
    if (!updatedText.trim()) return;
    try {
      await axios.put(
        `http://localhost:1234/thoughtsundercategory/`,
        { thought: updatedText,id:thoughtId },
        { withCredentials: true }
      );
      const newEditing = new Set(editingIds);
      newEditing.delete(thoughtId);
      setEditingIds(newEditing);

      const newUpdated = { ...updatedThoughts };
      delete newUpdated[thoughtId];
      setUpdatedThoughts(newUpdated);

      getThoughts();
    } catch (error) {
      console.log("Error updating thought:", error);
    }
  };

  const deleteThought = async (thoughtId) => {
    try {
      await axios.delete(`http://localhost:1234/thoughtsundercategory/${thoughtId}`, {
        withCredentials: true,
      });
      getThoughts();
    } catch (error) {
      console.log("Error deleting thought:", error);
    }
  };

  const startEditing = (id, currentText) => {
    const ids = new Set(editingIds);
    ids.add(id);
    setEditingIds(ids);
    setUpdatedThoughts((prev) => ({ ...prev, [id]: currentText }));
  };

  useEffect(() => {
    getThoughts();
  }, [id]);

  return (
    <div>
      <Navbar username={username} />
      <div style={{ padding: "20px" }}>
        <h2>Thoughts in "{category}"</h2>

        {/* Add Thought */}
        <form onSubmit={postThought} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={newThought}
            placeholder="Write a new thought"
            onChange={(e) => setNewThought(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        {/* Thought List */}
        {Array.isArray(thoughts) && thoughts.length > 0 ? (
          thoughts.map((item) => (
            <div key={item.id} style={{ margin: "10px 0" }}>
              {editingIds.has(item.id) ? (
                <>
                  <input
                    type="text"
                    value={updatedThoughts[item.id]}
                    onChange={(e) =>
                      setUpdatedThoughts((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    autoFocus
                  />
                  <button onClick={() => updateThought(item.id)}>Save</button>
                  <button
                    onClick={() => {
                      const ids = new Set(editingIds);
                      ids.delete(item.id);
                      setEditingIds(ids);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{item.thought}</span>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => startEditing(item.id, item.thought)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ marginLeft: "10px", color: "red" }}
                    onClick={() => deleteThought(item.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No thoughts found.</p>
        )}
      </div>
    </div>
  );
};

export default ThoughtsUnderCategory;
