"use client";

import React from "react";

const ArtistList = ({ artists = [] }) => {
  if (!artists || artists.length === 0) return null;

  // Duplicate artists for seamless infinite scroll
  const duplicatedArtists = [...artists, ...artists];

  return (
    <div 
      style={{
        position: "relative",
        width: "100vw",
        height: "50vh",
        backgroundColor: "transparent",
        marginLeft: "calc(-50vw + 50%)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
      }}
    >
      <style>
        {`
          @keyframes scrollLeft {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
      
      {/* HORIZONTAL TRACK */}
      <div
        style={{
          display: "flex",
          flexDirection: "row", 
          flexWrap: "nowrap",   
          alignItems: "center",
          animation: "scrollLeft 40s linear infinite",
          willChange: "transform"
        }}
      >
        {duplicatedArtists.map((artist, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              flexShrink: 0, 
              width: "clamp(200px, 25vw, 350px)",
              height: "35vh",
              overflow: "visible",
              backgroundColor: "transparent",
              transform: index % 2 !== 0 ? "translateY(5vh)" : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
          >
            <img
              src={`/assets/imgs/artists/${artist.img}`}
              alt={artist.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none"
              }}
            />
            
            {/* Artist Name */}
            <h3 
              style={{
                position: "absolute",
                bottom: "0px",
                color: "white",
                fontSize: "2rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
                zIndex: 10,
                fontFamily: 'var(--heading-font)',
                textShadow: "0px 4px 10px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,1)" 
              }}
            >
              {artist.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistList;