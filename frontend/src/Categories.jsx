import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "./Categories.css"; // We'll update this CSS file

const Categories = () => {
  const location = useLocation();
  const username = location.state?.username || "Guest";
  const color = location.state?.color || "#ffffff";
  
  // Function to determine text color based on background
  const getContrastColor = (bgColor) => {
    // Convert hex to RGB
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    
    // Calculate luminance - brighter colors need dark text
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
  
  // Generate complementary colors from base color
  const generatePalette = (baseColor) => {
    // Convert hex to RGB
    let r = parseInt(baseColor.slice(1, 3), 16);
    let g = parseInt(baseColor.slice(3, 5), 16);
    let b = parseInt(baseColor.slice(5, 7), 16);
    
    // Create lighter shade (for backgrounds)
    const lighterShade = `rgba(${r}, ${g}, ${b}, 0.1)`;
    
    // Create medium shade (for borders)
    const mediumShade = `rgba(${r}, ${g}, ${b}, 0.5)`;
    
    // Create darker shade (for hover effects)
    r = Math.max(0, Math.min(255, r * 0.8));
    g = Math.max(0, Math.min(255, g * 0.8));
    b = Math.max(0, Math.min(255, b * 0.8));
    const darkerShade = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    
    return { lighterShade, mediumShade, darkerShade };
  };
  
  const textColor = getContrastColor(color);
  const palette = generatePalette(color);

  const [CatData, setCatData] = useState([]);
  const [selectedCatIds, setSelectedCatIds] = useState([]);
  const [thoughtsByCategory, setThoughtsByCategory] = useState({});
  const [editingThoughtIndex, setEditingThoughtIndex] = useState(null);
  const [thoughtUpdates, setThoughtUpdates] = useState({});
  const [thoughtCategories, setThoughtCategories] = useState({});
  const [allThoughts, setAllThoughts] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryNameUpdate, setCategoryNameUpdate] = useState("");
  const [activeSection, setActiveSection] = useState("all");

  const getCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:1234/categories/`, {
        withCredentials: true,
      });
      setCatData(response.data);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const getThoughts = async (categoryId) => {
    try {
      const res = await axios.get(`http://localhost:1234/categories/${categoryId}`, {
        withCredentials: true,
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(`Error fetching thoughts for category ${categoryId}`, error);
      return [];
    }
  };

  const handleToggleCategory = async (id) => {
    if (selectedCatIds.includes(id)) {
      setSelectedCatIds((prev) => prev.filter((catId) => catId !== id));
    } else {
      setSelectedCatIds((prev) => [...prev, id]);
      if (!thoughtsByCategory[id]) {
        const data = await getThoughts(id);
        setThoughtsByCategory((prev) => ({ ...prev, [id]: data }));
      }
    }
  };

  const addNewCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:1234/categories",
        { cat: newCategoryName },
        { withCredentials: true }
      );
      
      setNewCategoryName("");
      await getCategories(); // Refresh categories
    } catch (error) {
      console.error("Error adding new category", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:1234/categories/${categoryId}`, {
        withCredentials: true,
      });
      
      if (selectedCatIds.includes(categoryId)) {
        setSelectedCatIds(prev => prev.filter(id => id !== categoryId));
      }
      
      await getCategories(); // Refresh categories
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  const updateCategoryName = async (categoryId) => {
    if (!categoryNameUpdate.trim()) return;

    try {
      await axios.put(
        `http://localhost:1234/categories/${categoryId}`,
        { cat: categoryNameUpdate },
        { withCredentials: true }
      );
      
      setEditingCategoryId(null);
      setCategoryNameUpdate("");
      await getCategories(); // Refresh categories
    } catch (error) {
      console.error("Error updating category name", error);
    }
  };

  const handleUpdateThought = async (thoughtIndex) => {
    const thought = allThoughts[thoughtIndex];
    if (!thought || !thought.id) return;
    
    if (thoughtUpdates[thoughtIndex] === undefined) return;
    
    try {
      await axios.put(
        `http://localhost:1234/thoughts/${thought.id}`,
        {
          thought: thoughtUpdates[thoughtIndex]
        },
        { withCredentials: true }
      );
      
      setEditingThoughtIndex(null);
      setThoughtUpdates({});
      await refreshThoughts();
    } catch (error) {
      console.error("Error updating thought", error);
    }
  };

  const handleDeleteThought = async (thoughtIndex) => {
    const thought = allThoughts[thoughtIndex];
    if (!thought || !thought.id) return;
    
    try {
      await axios.delete(
        `http://localhost:1234/thoughts/${thought.id}`,
        { withCredentials: true }
      );
      await refreshThoughts();
    } catch (err) {
      console.error("Error deleting thought", err);
    }
  };

  const handleRemoveFromCategory = async (thoughtIndex, categoryId) => {
    const thought = allThoughts[thoughtIndex];
    if (!thought || !thought.id) return;
    
    try {
      await axios.delete(
        `http://localhost:1234/categories/${categoryId}/thoughts/${thought.id}`,
        { withCredentials: true }
      );
      await refreshThoughts();
    } catch (err) {
      console.error("Error removing thought from category", err);
    }
  };

  const refreshThoughts = async () => {
    if (selectedCatIds.length === 0) {
      setAllThoughts([]);
      setThoughtCategories({});
      return;
    }

    const updated = {};
    const uniqueThoughts = [];
    const thoughtIdToIndex = {};
    const categoryMap = {};
    
    for (const catId of selectedCatIds) {
      const thoughts = await getThoughts(catId);
      updated[catId] = thoughts;
      
      thoughts.forEach(thought => {
        if (thoughtIdToIndex[thought.id] === undefined) {
          thoughtIdToIndex[thought.id] = uniqueThoughts.length;
          uniqueThoughts.push(thought);
        }
        
        const index = thoughtIdToIndex[thought.id];
        if (!categoryMap[index]) {
          categoryMap[index] = [];
        }
        if (!categoryMap[index].includes(catId)) {
          categoryMap[index].push(catId);
        }
      });
    }
    
    setThoughtsByCategory(updated);
    setAllThoughts(uniqueThoughts);
    setThoughtCategories(categoryMap);
  };

  const selectedCats = CatData.filter((cat) => selectedCatIds.includes(cat.id));
  const unselectedCats = CatData.filter((cat) => !selectedCatIds.includes(cat.id));

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    refreshThoughts();
  }, [selectedCatIds]);

  const getCategoryName = (catId) => {
    const category = CatData.find(cat => cat.id === catId);
    return category ? category.category : 'Unknown';
  };

  return (
    <div className="app-container" style={{ 
      backgroundColor: '#f8f9fa', 
      color: textColor 
    }}>
      <Navbar username={username} color={color} />
      
      <div className="category-hero" style={{ 
        backgroundColor: palette.lighterShade,
        borderBottom: `3px solid ${color}`
      }}>
        <h1 className="hero-title" style={{ color }}>Categories</h1>
        <p className="hero-subtitle" style={{ color: textColor }}>
          Organize your thoughts in a beautiful way
        </p>
      </div>
      
      <div className="container">
        {/* Navigation Tabs */}
        <div className="category-tabs">
          <button 
            className={`tab ${activeSection === "all" ? "active" : ""}`} 
            onClick={() => setActiveSection("all")}
            style={{ 
              color: activeSection === "all" ? color : textColor,
              borderBottom: activeSection === "all" ? `2px solid ${color}` : 'none'
            }}
          >
            All Categories
          </button>
          <button 
            className={`tab ${activeSection === "selected" ? "active" : ""}`} 
            onClick={() => setActiveSection("selected")}
            style={{ 
              color: activeSection === "selected" ? color : textColor,
              borderBottom: activeSection === "selected" ? `2px solid ${color}` : 'none'
            }}
          >
            Selected ({selectedCats.length})
          </button>
          <button 
            className={`tab ${activeSection === "thoughts" ? "active" : ""}`} 
            onClick={() => setActiveSection("thoughts")}
            style={{ 
              color: activeSection === "thoughts" ? color : textColor,
              borderBottom: activeSection === "thoughts" ? `2px solid ${color}` : 'none'
            }}
          >
            Thoughts ({allThoughts.length})
          </button>
          <button 
            className={`tab ${activeSection === "add" ? "active" : ""}`} 
            onClick={() => setActiveSection("add")}
            style={{ 
              color: activeSection === "add" ? color : textColor,
              borderBottom: activeSection === "add" ? `2px solid ${color}` : 'none'
            }}
          >
            Add New
          </button>
        </div>

        {/* Add New Category Section */}
        {(activeSection === "all" || activeSection === "add") && (
          <div className="category-section new-category-section">
            <div className="section-header">
              <h3 className="section-title" style={{ color }}>Create New Category</h3>
            </div>
            <div className="add-category-form">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="category-input"
                style={{ borderColor: palette.mediumShade }}
              />
              <button
                onClick={addNewCategory}
                className="add-button"
                style={{ 
                  backgroundColor: color, 
                  color: textColor,
                  boxShadow: `0 4px 8px ${palette.mediumShade}`
                }}
              >
                Add Category
              </button>
            </div>
          </div>
        )}

        {/* All Categories Grid Section */}
        {(activeSection === "all") && (
          <div className="categories-grid-container">
            {CatData.length === 0 ? (
              <div className="empty-state">
                <p style={{ color: textColor }}>No categories available. Create your first category!</p>
              </div>
            ) : (
              <div className="categories-grid">
                {CatData.map((cat) => (
                  <div 
                    key={cat.id}
                    className={`category-card ${selectedCatIds.includes(cat.id) ? 'selected' : ''}`}
                    style={{ 
                      borderColor: selectedCatIds.includes(cat.id) ? color : palette.mediumShade,
                      backgroundColor: selectedCatIds.includes(cat.id) ? palette.lighterShade : 'white',
                      boxShadow: selectedCatIds.includes(cat.id) ? `0 4px 12px ${palette.mediumShade}` : 'none'
                    }}
                  >
                    {editingCategoryId === cat.id ? (
                      <div className="edit-category-form">
                        <input
                          type="text"
                          value={categoryNameUpdate}
                          onChange={(e) => setCategoryNameUpdate(e.target.value)}
                          className="category-edit-input"
                          style={{ borderColor: palette.mediumShade }}
                        />
                        <div className="category-edit-actions">
                          <button
                            onClick={() => updateCategoryName(cat.id)}
                            className="save-button"
                            style={{ backgroundColor: color, color: textColor }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategoryId(null)}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          className="category-title"
                          onClick={() => handleToggleCategory(cat.id)}
                          style={{ color: selectedCatIds.includes(cat.id) ? color : textColor }}
                        >
                          {cat.category}
                        </div>
                        <div className="category-card-actions">
                          <button
                            onClick={() => {
                              setEditingCategoryId(cat.id);
                              setCategoryNameUpdate(cat.category);
                            }}
                            className="action-button edit-button"
                            style={{ color }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="action-button delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Categories Section */}
        {(activeSection === "selected") && (
          <div className="category-section selected-categories-section">
            <div className="section-header">
              <h3 className="section-title" style={{ color }}>Selected Categories</h3>
            </div>
            {selectedCats.length === 0 ? (
              <div className="empty-state">
                <p style={{ color: textColor }}>No categories selected. Select categories to view thoughts.</p>
              </div>
            ) : (
              <div className="selected-categories-container">
                {selectedCats.map((cat) => (
                  <div 
                    key={cat.id}
                    className="selected-category-item"
                    style={{ 
                      backgroundColor: palette.lighterShade,
                      borderLeft: `4px solid ${color}`
                    }}
                  >
                    {editingCategoryId === cat.id ? (
                      <div className="edit-category-form">
                        <input
                          type="text"
                          value={categoryNameUpdate}
                          onChange={(e) => setCategoryNameUpdate(e.target.value)}
                          className="category-edit-input"
                          style={{ borderColor: palette.mediumShade }}
                        />
                        <div className="category-edit-actions">
                          <button
                            onClick={() => updateCategoryName(cat.id)}
                            className="save-button"
                            style={{ backgroundColor: color, color: textColor }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategoryId(null)}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="selected-category-name" style={{ color }}>
                          {cat.category}
                        </div>
                        <div className="selected-category-actions">
                          <button
                            onClick={() => {
                              setEditingCategoryId(cat.id);
                              setCategoryNameUpdate(cat.category);
                            }}
                            className="action-button edit-button"
                            style={{ color }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="action-button delete-button"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleToggleCategory(cat.id)}
                            className="action-button"
                            style={{ color }}
                          >
                            Deselect
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Thoughts Section */}
        {(activeSection === "thoughts" || activeSection === "all") && (
          <div className="category-section thoughts-section">
            <div className="section-header">
              <h3 className="section-title" style={{ color }}>Thoughts</h3>
            </div>
            {allThoughts.length > 0 ? (
              <div className="thoughts-grid">
                {allThoughts.map((thought, index) => (
                  <div 
                    key={index} 
                    className="thought-card" 
                    style={{ 
                      backgroundColor: 'white',
                      boxShadow: `0 4px 12px ${palette.mediumShade}`,
                      borderTop: `4px solid ${color}`
                    }}
                  >
                    {editingThoughtIndex === index ? (
                      <div className="edit-thought-form">
                        <textarea
                          value={thoughtUpdates[index] !== undefined ? thoughtUpdates[index] : thought.thought}
                          onChange={(e) =>
                            setThoughtUpdates((prev) => ({
                              ...prev,
                              [index]: e.target.value,
                            }))
                          }
                          className="thought-edit-textarea"
                          style={{ borderColor: palette.mediumShade }}
                        />
                        <div className="thought-edit-controls">
                          <button 
                            onClick={() => handleUpdateThought(index)}
                            className="save-button"
                            style={{ backgroundColor: color, color: textColor }}
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => {
                              setEditingThoughtIndex(null);
                              setThoughtUpdates(prev => {
                                const updated = {...prev};
                                delete updated[index];
                                return updated;
                              });
                            }}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          className="thought-content"
                          onClick={() => {
                            setEditingThoughtIndex(index);
                            setThoughtUpdates((prev) => ({
                              ...prev,
                              [index]: thought.thought,
                            }));
                          }}
                        >
                          <p className="thought-text">{thought.thought}</p>
                          <div className="thought-id">ID: {thought.id}</div>
                        </div>
                        
                        <div className="thought-categories-container">
                          {thoughtCategories[index]?.map(catId => (
                            <span 
                              key={`${index}-${catId}`}
                              className="thought-category-pill"
                              style={{ 
                                backgroundColor: palette.lighterShade, 
                                color,
                                border: `1px solid ${palette.mediumShade}`
                              }}
                            >
                              {getCategoryName(catId)}
                              <span 
                                className="remove-category"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFromCategory(index, catId);
                                }}
                              >
                                ✕
                              </span>
                            </span>
                          ))}
                        </div>
                        
                        <div className="thought-footer">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteThought(index);
                            }}
                            className="delete-thought-button"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : selectedCatIds.length > 0 ? (
              <div className="empty-state">
                <p style={{ color: textColor }}>No thoughts found in the selected categories.</p>
              </div>
            ) : (
              <div className="empty-state">
                <p style={{ color: textColor }}>Select categories to view thoughts.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;