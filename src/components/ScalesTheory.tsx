import React, { useState } from 'react';
import { generateScale, SCALES, CHROMATIC_NOTES, getScaleDegrees, getKeySignature, ScaleInfo } from '../utils/musicTheory';
import './ScalesTheory.css';

interface ScalesTheoryProps {
  onScaleSelect: (scale: ScaleInfo) => void;
}

const ScalesTheory: React.FC<ScalesTheoryProps> = ({ onScaleSelect }) => {
  const [selectedRoot, setSelectedRoot] = useState('C');
  const [selectedScale, setSelectedScale] = useState('major');
  const [currentScale, setCurrentScale] = useState<ScaleInfo | null>(null);

  const handleGenerateScale = () => {
    const scale = generateScale(selectedRoot, SCALES[selectedScale]);
    setCurrentScale(scale);
    onScaleSelect(scale);
  };

  React.useEffect(() => {
    handleGenerateScale();
  }, [selectedRoot, selectedScale]);

  const keySignature = currentScale ? getKeySignature(currentScale.rootNote, selectedScale === 'minor') : { sharps: [], flats: [] };
  const scaleDegrees = currentScale ? getScaleDegrees(currentScale) : [];

  return (
    <div className="scales-theory">
      <h2>Scale Theory</h2>
      
      <div className="scale-controls">
        <div className="control-group">
          <label htmlFor="root-select">Root Note:</label>
          <select
            id="root-select"
            value={selectedRoot}
            onChange={(e) => setSelectedRoot(e.target.value)}
          >
            {CHROMATIC_NOTES.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="scale-select">Scale Type:</label>
          <select
            id="scale-select"
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
          >
            {Object.entries(SCALES).map(([key, scale]) => (
              <option key={key} value={key}>{scale.name}</option>
            ))}
          </select>
        </div>
      </div>

      {currentScale && (
        <div className="scale-info">
          <h3>{currentScale.rootNote} {currentScale.name}</h3>
          <p className="scale-description">{currentScale.description}</p>
          
          <div className="scale-notes">
            <h4>Notes in Scale:</h4>
            <div className="notes-list">
              {currentScale.notes.map((note, index) => (
                <div key={index} className="note-item">
                  <span className="note-name">{note}</span>
                  <span className="scale-degree">{scaleDegrees[index]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="intervals">
            <h4>Intervals:</h4>
            <div className="intervals-list">
              {currentScale.intervals.map((interval, index) => (
                <span key={index} className="interval">
                  {interval === 0 ? 'R' : interval}
                  {index < currentScale.intervals.length - 1 && ' - '}
                </span>
              ))}
            </div>
          </div>

          {(keySignature.sharps.length > 0 || keySignature.flats.length > 0) && (
            <div className="key-signature">
              <h4>Key Signature:</h4>
              <div className="signature-accidentals">
                {keySignature.sharps.length > 0 && (
                  <span>Sharps: {keySignature.sharps.join(', ')}</span>
                )}
                {keySignature.flats.length > 0 && (
                  <span>Flats: {keySignature.flats.join(', ')}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="theory-tips">
        <h4>Quick Tips:</h4>
        <ul>
          <li>Major scales have a bright, happy sound</li>
          <li>Minor scales have a darker, sadder sound</li>
          <li>Use the keyboard shortcuts (A-J keys) to play notes</li>
          <li>Watch the highlighted keys to see the scale pattern</li>
        </ul>
      </div>
    </div>
  );
};

export default ScalesTheory;