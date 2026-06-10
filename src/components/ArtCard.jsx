import React from 'react';

const ArtCard = ({ painting }) => {
  return (
    <article className="art-card">
      <div className="card-image">
        <img src={painting.imageUrl} alt={painting.title} className="art-image" />
        
        <div className="text-block">
          <div className="vertical-bar-start"></div>
          <div className="text-content-wrapper">
            <div className="text-content default-content">
              <h3 className="painting-title">{painting.title}</h3>
              <p className="painting-year">{painting.year}</p>
            </div>
            <div className="text-content hover-content">
              <h3 className="painting-title">{painting.artist}</h3>
              <p className="painting-year">{painting.location}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArtCard;