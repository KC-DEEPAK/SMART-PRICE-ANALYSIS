import React, { useState } from 'react';
import './SeasonalRecommendation.css';
import { getCurrentSeason, cropSeasonMap } from '../utils/cropSeasons';
import { getCropAdvantages } from '../utils/cropAdvantages';

const seasonInfo = {
    "Kharif": "Monsoon crops planted in June and harvested in October. High water requirement.",
    "Rabi": "Winter crops planted in Nov/Dec and harvested in spring. Grown mostly under irrigation or winter rain.",
    "Zaid": "Summer crops grown between Rabi and Kharif. Typically short-duration vegetables and fruits.",
    "All Year": "Perennial crops, trees, or crops that can be grown year-round depending on the region."
};

const allSeasonsList = ["Kharif", "Rabi", "Zaid", "All Year"];

const SeasonalRecommendation = () => {
    const activeSeason = getCurrentSeason();
    const [selectedCrop, setSelectedCrop] = useState(null);

    return (
        <div>
            {allSeasonsList.map(season => {
                const info = seasonInfo[season] || "";
                const crops = Object.keys(cropSeasonMap).filter(crop => cropSeasonMap[crop] === season);
                
                return (
                    <div key={season} className="seasonal-rec-card">
                        <div className="seasonal-rec-header">
                            <h3>🌾 {season} Crops</h3>
                            {season === activeSeason && <span className="season-badge" style={{background: '#ff9800'}}>Current</span>}
                        </div>
                        
                        {info && <p className="season-info">{info}</p>}
                        
                        <div className="seasonal-crops-grid">
                            {crops.length > 0 ? (
                                crops.map((crop, idx) => (
                                    <div 
                                        key={idx} 
                                        className="season-crop-card"
                                        onClick={() => setSelectedCrop(crop)}
                                    >
                                        {crop}
                                    </div>
                                ))
                            ) : (
                                <div>No specific recommendations found.</div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Crop Advantage Modal */}
            {selectedCrop && (
                <div className="crop-modal-overlay" onClick={() => setSelectedCrop(null)}>
                    <div className="crop-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="crop-modal-close" onClick={() => setSelectedCrop(null)}>&times;</button>
                        <h3 className="crop-modal-title">🌾 {selectedCrop}</h3>
                        <p className="crop-modal-body">{getCropAdvantages(selectedCrop)}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeasonalRecommendation;
