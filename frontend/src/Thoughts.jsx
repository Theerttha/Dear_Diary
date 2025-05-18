import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

// Function to determine if a color is light or dark
const isLightColor = (color) => {
  // Convert hex to RGB
  let r, g, b;
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    return true; // Default to assuming light if not a hex color
  }
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

// Function to generate complementary color
const getComplementaryColor = (hexColor) => {
  // Convert hex to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate complementary color
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Function to get a lighter version of the color for accents
const getLighterColor = (hexColor, percent = 0.3) => {
  // Convert hex to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);
  
  // Make lighter
  r = Math.min(255, Math.floor(r + (255 - r) * percent));
  g = Math.min(255, Math.floor(g + (255 - g) * percent));
  b = Math.min(255, Math.floor(b + (255 - b) * percent));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Function to get a darker version of the color
const getDarkerColor = (hexColor, percent = 0.3) => {
  // Convert hex to RGB
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);
  
  // Make darker
  r = Math.max(0, Math.floor(r * (1 - percent)));
  g = Math.max(0, Math.floor(g * (1 - percent)));
  b = Math.max(0, Math.floor(b * (1 - percent)));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Trash can icon as SVG
const TrashIcon = ({ fill = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fill} viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const Thoughts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "Guest";
  const color = location.state?.color || "#6a5acd"; // Default to a nice purple if no color provided
  
  const [thoughts, setThoughts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thoughtCategories, setThoughtCategories] = useState({});
  const [showAddInput, setShowAddInput] = useState(false);
  const [newThought, setNewThought] = useState("");
  const [editingIds, setEditingIds] = useState(new Set());
  const [updatedThought, setUpdatedThought] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [hoveredThoughtId, setHoveredThoughtId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Calculate theme colors based on the base color
  const theme = useMemo(() => {
    const isLight = isLightColor(color);
    return {
      baseColor: color,
      complementColor: getComplementaryColor(color),
      bgColor: isLight ? "#1f1f1f" : "#ffffff",
      textColor: isLight ? "#ffffff" : "#1f1f1f",
      accentLight: getLighterColor(color, 0.2),
      accentDark: getDarkerColor(color, 0.2),
      cardBg: isLight ? "#2a2a2a" : "#f8f8f8",
      buttonBg: color,
      buttonText: isLightColor(color) ? "#1f1f1f" : "#ffffff",
      secondaryButtonBg: isLight ? "#3a3a3a" : "#e0e0e0",
      secondaryButtonText: isLight ? "#ffffff" : "#1f1f1f"
    };
  }, [color]);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchThoughts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/thoughts/`, {
        withCredentials: true,
      });
      setThoughts(response.data);
    } catch (error) {
      console.log("Error fetching thoughts", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories/`, {
        withCredentials: true,
      });
      setCategories(response.data);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const fetchThoughtCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/thoughts/categories`, {
        withCredentials: true,
      });
      
      // Organize thought categories by thoughtId
      const categoriesByThought = {};
      response.data.forEach(item => {
        if (!categoriesByThought[item.thoughtid]) {
          categoriesByThought[item.thoughtid] = [];
        }
        // Find the category details
        const categoryDetails = categories.find(cat => cat.id === item.categoryid);
        if (categoryDetails) {
          categoriesByThought[item.thoughtid].push({
            linkId: item.id, // The ID from cat_thoughts table
            categoryId: item.categoryid,
            category: categoryDetails.category
          });
        }
      });
      
      setThoughtCategories(categoriesByThought);
    } catch (error) {
      console.log("Error fetching thought categories", error);
    }
  };

  const addThought = async (event) => {
    event.preventDefault();
    if (!newThought.trim()) return;
    try {
      await axios.post(
        `${apiUrl}/thoughts/`,
        { thought: newThought },
        { withCredentials: true }
      );
      setNewThought("");
      setShowAddInput(false);
      fetchThoughts();
    } catch (error) {
      console.log("Error adding thought:", error);
    }
  };

  const updateThought = async (id) => {
    try {
      const newText = updatedThought[id];
      if (!newText?.trim()) return;

      await axios.put(
        `${apiUrl}/thoughts/${id}`,
        { thought: newText },
        { withCredentials: true }
      );

      const newEditingIds = new Set(editingIds);
      newEditingIds.delete(id);
      setEditingIds(newEditingIds);

      const updated = { ...updatedThought };
      delete updated[id];
      setUpdatedThought(updated);
      fetchThoughts();
    } catch (error) {
      console.log("Error updating thought:", error);
    }
  };

  const deleteThought = async (id) => {
    try {
      await axios.delete(`${apiUrl}/thoughts/${id}`, {
        withCredentials: true,
      });
      fetchThoughts();
    } catch (error) {
      console.log("Error deleting thought:", error);
    }
  };

  const addToCategory = async (thoughtId, categoryId) => {
    if (!categoryId) return;
    
    try {
      await axios.post(
        `${apiUrl}/thoughts/categories`,
        { thoughtId, categoryId },
        { withCredentials: true }
      );
      
      // Close dropdown and reset selection
      const newShowDropdown = { ...showCategoryDropdown };
      delete newShowDropdown[thoughtId];
      setShowCategoryDropdown(newShowDropdown);
      
      const newSelectedCategory = { ...selectedCategory };
      delete newSelectedCategory[thoughtId];
      setSelectedCategory(newSelectedCategory);
      
      // Refresh thought categories
      fetchThoughtCategories();
    } catch (error) {
      console.log("Error adding thought to category:", error);
    }
  };

  const removeFromCategory = async (linkId) => {
    try {
      await axios.delete(`${apiUrl}/thoughts/categories/${linkId}`, {
        withCredentials: true,
      });
      
      // Refresh thought categories
      fetchThoughtCategories();
    } catch (error) {
      console.log("Error removing thought from category:", error);
    }
  };

  const startEditing = (id, currentText) => {
    const newEditingIds = new Set(editingIds);
    newEditingIds.add(id);
    setEditingIds(newEditingIds);
    setUpdatedThought((prev) => ({ ...prev, [id]: currentText }));
  };

  const toggleCategoryDropdown = (id) => {
    setShowCategoryDropdown(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Get categories that haven't been added to the thought yet
  const getAvailableCategories = (thoughtId) => {
    const assignedCategoryIds = thoughtCategories[thoughtId] 
      ? thoughtCategories[thoughtId].map(tc => tc.categoryId) 
      : [];
      
    return categories.filter(cat => !assignedCategoryIds.includes(cat.id));
  };

  useEffect(() => {
    fetchThoughts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchThoughtCategories();
    }
  }, [categories]);

  // Determine grid columns based on window width
  const getGridColumns = () => {
    if (windowWidth < 600) return "repeat(1, 1fr)";
    if (windowWidth < 900) return "repeat(2, 1fr)";
    return "repeat(auto-fill, minmax(280px, 1fr))";
  };

  // Custom button styles
  const buttonStyle = {
    backgroundColor: theme.buttonBg,
    color: theme.buttonText,
    border: "none",
    borderRadius: "25px",
    padding: "10px 20px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };
  
  const secondaryButtonStyle = {
    backgroundColor: theme.secondaryButtonBg,
    color: theme.secondaryButtonText,
    border: "none",
    borderRadius: "25px",
    padding: "8px 16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "transform 0.2s, opacity 0.2s",
  };

  const hoverButtonStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
  };

  // Icon button style
  const iconButtonStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    borderRadius: "50%",
    transition: "background-color 0.2s",
    color: theme.textColor === "#ffffff" ? "#ff8a8a" : "#d32f2f",
  };

  return (
    <div style={{ 
      backgroundColor: theme.bgColor, 
      minHeight: "100vh",
      color: theme.textColor,
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Navbar username={username} color={color} />
      
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto", 
        padding: windowWidth < 600 ? "20px 15px" : "40px 20px"
      }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: windowWidth < 600 ? "20px" : "40px"
        }}>
          <h1 style={{ 
            fontSize: windowWidth < 600 ? "2rem" : "2.5rem",
            background: `linear-gradient(45deg, ${theme.baseColor}, ${theme.accentLight})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0
          }}>
            My Thoughts
          </h1>
          
          {!showAddInput ? (
            <button 
              onClick={() => setShowAddInput(true)}
              style={buttonStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, hoverButtonStyle);
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              Add Thought
            </button>
          ) : null}
        </header>

        {/* Add Thought Form */}
        {showAddInput && (
          <div style={{ 
            backgroundColor: theme.cardBg,
            borderRadius: "15px",
            padding: windowWidth < 600 ? "15px" : "20px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            transform: "translateY(0)",
            transition: "transform 0.3s, box-shadow 0.3s",
            border: `2px solid ${theme.accentLight}`
          }}>
            <form onSubmit={addThought}>
              <textarea
                value={newThought}
                placeholder="What's on your mind?"
                onChange={(e) => setNewThought(e.target.value)}
                autoFocus
                style={{ 
                  width: "100%", 
                  minHeight: "120px", 
                  padding: "15px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: isLightColor(theme.cardBg) ? "#f0f0f0" : "#2a2a2a",
                  color: theme.textColor,
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                  marginBottom: "15px",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
              />
              <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddInput(false)}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={buttonStyle}
                >
                  Save Thought
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Masonry-style thoughts grid */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: getGridColumns(),
          gap: windowWidth < 600 ? "15px" : "25px",
          gridAutoFlow: "dense"
        }}>
          {Array.isArray(thoughts) && thoughts.length > 0 ? (
            thoughts.map((item) => {
              // Determine height class - make some thoughts taller for visual interest
              // On mobile, make all heights uniform for better layout
              const heightClass = windowWidth > 600 && Math.random() > 0.6 ? "tall" : "normal";
              
              return (
                <div 
                  key={item.id} 
                  style={{ 
                    backgroundColor: theme.cardBg,
                    borderRadius: "12px",
                    padding: windowWidth < 600 ? "15px" : "20px",
                    boxShadow: hoveredThoughtId === item.id 
                      ? `0 15px 30px rgba(0, 0, 0, 0.2), 0 0 0 2px ${theme.accentLight}`
                      : "0 8px 20px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    transform: hoveredThoughtId === item.id ? "translateY(-5px)" : "translateY(0)",
                    gridRowEnd: (windowWidth > 600 && heightClass === "tall") ? "span 2" : "span 1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: editingIds.has(item.id) ? "default" : "pointer"
                  }}
                  onMouseEnter={() => setHoveredThoughtId(item.id)}
                  onMouseLeave={() => setHoveredThoughtId(null)}
                  onClick={(e) => {
                    // Prevent starting edit mode when clicking on buttons or category tags
                    if (
                      e.target.tagName === 'BUTTON' || 
                      e.target.tagName === 'svg' || 
                      e.target.tagName === 'path' ||
                      e.target.closest('.category-tag') ||
                      editingIds.has(item.id)
                    ) {
                      return;
                    }
                    startEditing(item.id, item.thought);
                  }}
                >
                  {editingIds.has(item.id) ? (
                    // Edit mode
                    <div style={{ height: "100%" }}>
                      <textarea
                        value={updatedThought[item.id]}
                        onChange={(e) =>
                          setUpdatedThought((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        autoFocus
                        style={{ 
                          width: "100%", 
                          height: "calc(100% - 60px)",
                          minHeight: "120px",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "none",
                          backgroundColor: isLightColor(theme.cardBg) ? "#f0f0f0" : "#2a2a2a",
                          color: theme.textColor,
                          fontSize: "1rem",
                          fontFamily: "inherit",
                          resize: "none",
                          marginBottom: "15px",
                          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                        }}
                      />
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => {
                            const ids = new Set(editingIds);
                            ids.delete(item.id);
                            setEditingIds(ids);
                          }}
                          style={secondaryButtonStyle}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateThought(item.id)}
                          style={buttonStyle}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div>
                        <p style={{ 
                          fontSize: "1.1rem", 
                          lineHeight: "1.6",
                          marginTop: 0,
                          wordBreak: "break-word"
                        }}>
                          {item.thought}
                        </p>
                        
                        {/* Display categories */}
                        {thoughtCategories[item.id] && thoughtCategories[item.id].length > 0 && (
                          <div style={{ 
                            display: "flex", 
                            flexWrap: "wrap", 
                            gap: "5px",
                            marginTop: "15px"
                          }}>
                            {thoughtCategories[item.id].map((cat) => (
                              <span 
                                key={cat.linkId}
                                className="category-tag" 
                                style={{ 
                                  backgroundColor: theme.accentLight,
                                  color: isLightColor(theme.accentLight) ? "#1f1f1f" : "#ffffff",
                                  padding: "3px 8px", 
                                  borderRadius: "20px",
                                  fontSize: "0.8rem",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px"
                                }}
                              >
                                {cat.category}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCategory(cat.linkId);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    color: "inherit",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 0,
                                    width: "16px",
                                    height: "16px",
                                    borderRadius: "50%"
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div style={{ 
                          fontSize: "0.8rem", 
                          color: isLightColor(theme.cardBg) ? "#888" : "#aaa",
                          marginBottom: "15px",
                          marginTop: "15px"
                        }}>
                          Updated: {item.lastdate} {item.lasttime}
                        </div>
                        
                        {/* Action buttons */}
                        <div style={{ 
                          display: "flex", 
                          gap: "10px", 
                          justifyContent: "space-between",
                          alignItems: "center",
                          opacity: hoveredThoughtId === item.id ? 1 : 0.6,
                          transition: "opacity 0.3s ease"
                        }}>
                          <div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteThought(item.id);
                              }}
                              style={iconButtonStyle}
                              title="Delete thought"
                            >
                              <TrashIcon fill={theme.textColor === "#ffffff" ? "#ff8a8a" : "#d32f2f"} />
                            </button>
                          </div>
                          
                          {/* Category dropdown */}
                          <div style={{ position: "relative" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCategoryDropdown(item.id);
                              }}
                              style={{
                                ...secondaryButtonStyle,
                                padding: "6px 12px",
                                fontSize: "0.9rem"
                              }}
                            >
                              + Category
                            </button>
                            
                            {showCategoryDropdown[item.id] && (
                              <div 
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  position: "absolute",
                                  zIndex: 10,
                                  right: 0,
                                  bottom: "calc(100% + 8px)",
                                  backgroundColor: theme.cardBg,
                                  border: `1px solid ${theme.accentLight}`,
                                  borderRadius: "10px",
                                  padding: "15px",
                                  minWidth: "220px",
                                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                                }}
                              >
                                {getAvailableCategories(item.id).length > 0 ? (
                                  <>
                                    <select
                                      value={selectedCategory[item.id] || ""}
                                      onChange={(e) => setSelectedCategory({
                                        ...selectedCategory,
                                        [item.id]: e.target.value
                                      })}
                                      style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        marginBottom: "12px",
                                        borderRadius: "6px",
                                        border: `1px solid ${theme.accentLight}`,
                                        backgroundColor: isLightColor(theme.cardBg) ? "#f0f0f0" : "#2a2a2a",
                                        color: theme.textColor,
                                        fontSize: "0.9rem"
                                      }}
                                    >
                                      <option value="">Select a category</option>
                                      {getAvailableCategories(item.id).map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                          {cat.category}
                                        </option>
                                      ))}
                                    </select>
                                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleCategoryDropdown(item.id);
                                        }}
                                        style={{
                                          ...secondaryButtonStyle,
                                          padding: "6px 12px",
                                          fontSize: "0.9rem"
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addToCategory(item.id, selectedCategory[item.id]);
                                        }}
                                        style={{
                                          ...buttonStyle,
                                          padding: "6px 12px",
                                          fontSize: "0.9rem"
                                        }}
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p style={{ margin: "0 0 10px" }}>All categories have been added.</p>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategoryDropdown(item.id);
                                      }}
                                      style={{
                                        ...secondaryButtonStyle,
                                        padding: "6px 12px",
                                        fontSize: "0.9rem",
                                        width: "100%"
                                      }}
                                    >
                                      Close
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ 
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px 0",
              backgroundColor: theme.cardBg,
              borderRadius: "15px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
            }}>
              <h3 style={{ 
                fontSize: "1.5rem",
                marginBottom: "20px",
                color: theme.accentLight
              }}>
                Your thought space is empty
              </h3>
              <p style={{ fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto 30px" }}>
                Capture your first thought by clicking the button above!
              </p>
              {!showAddInput && (
                <button 
                  onClick={() => setShowAddInput(true)}
                  style={{
                    ...buttonStyle,
                    padding: "12px 25px",
                    fontSize: "1.1rem"
                  }}
                >
                  Add Your First Thought
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Thoughts;