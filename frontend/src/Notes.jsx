import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import './Notes.css';

const Notes = () => {
    const location = useLocation();
    const [username, setUsername] = useState(location.state?.username || "Guest");
    const [color, setColor] = useState(location.state?.color || "#6366f1");
    const [password, setPassword] = useState(location.state?.password || "default");
    
    // Determine if the color is light or dark to set contrasting text color
    const isLight = () => {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calculate perceived brightness (using relative luminance)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128;
    };
    
    // Get lighter and darker versions of the color for gradient
    const getLighterColor = () => {
        const hex = color.replace('#', '');
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);
        
        // Make color lighter
        r = Math.min(255, r + 60);
        g = Math.min(255, g + 60);
        b = Math.min(255, b + 60);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // Words for background
    const diaryWords = [
        "Memories", "Thoughts", "Dreams", "Ideas", "Secrets", 
        "Feelings", "Stories", "Moments", "Adventures", "Wishes",
        "Hopes", "Journeys", "Emotions", "Reflections", "Notes",
        "Confessions", "Inspirations", "Experiences", "Musings", "Wonders"
    ];

    const textColorClass = isLight() ? 'dark-text' : 'light-text';

    return (
        <div className="diary-container">
            <Navbar username={username} password={password} color={color} />
            
            {/* Background words */}
            <div className="background-words">
                {diaryWords.map((word, index) => (
                    <div 
                        key={index}
                        className="word"
                        style={{
                            top: `${(index * 5) % 100}%`,
                            left: `${(index * 7) % 95}%`,
                            transform: `rotate(${(index * 13) % 40 - 20}deg)`,
                            fontSize: `${Math.max(12, (index % 3 + 1) * 10)}px`
                        }}
                    >
                        {word}
                    </div>
                ))}
            </div>
            
            <div className="diary-content-container">
                <div 
                    className="diary-box"
                    style={{ 
                        background: `linear-gradient(to bottom, ${color}, ${getLighterColor()})`,
                    }}
                >
                    {/* Dear Diary text - top left */}
                    <div className={`diary-header ${textColorClass}`}>
                        Dear Diary,
                    </div>
                    
                    {/* Content area */}
                    <div className="diary-title-container">
                        <h1 className={`diary-title ${textColorClass}`}>
                            {username}'s Journal
                        </h1>
                    </div>
                    
                    {/* Signature - bottom right */}
                    <div className={`diary-signature ${textColorClass}`}>
                        <div>Yours,</div>
                        <div>{username}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notes;