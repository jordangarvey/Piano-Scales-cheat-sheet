import React, { useState } from 'react';
import { CIRCLE_OF_FIFTHS, getKeySignature } from '../utils/musicTheory';
import './CircleOfFifths.css';

interface CircleOfFifthsProps {
  onKeySelect: (key: string, isMinor: boolean) => void;
}

const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({ onKeySelect }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isMinorMode, setIsMinorMode] = useState(false);

  const majorKeys = CIRCLE_OF_FIFTHS;
  const minorKeys = majorKeys.map(key => {
    const keyIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(key);
    const minorIndex = (keyIndex + 9) % 12;
    return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][minorIndex];
  });

  const handleKeyClick = (key: string) => {
    setSelectedKey(key);
    onKeySelect(key, isMinorMode);
  };

  const getKeyPosition = (index: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const radius = 120;
    const x = Math.cos(angle) * radius + 150;
    const y = Math.sin(angle) * radius + 150;
    return { x, y };
  };

  const getKeySignatureDisplay = (key: string) => {
    const signature = getKeySignature(key, isMinorMode);
    if (signature.sharps.length > 0) {
      return `${signature.sharps.length}♯`;
    } else if (signature.flats.length > 0) {
      return `${signature.flats.length}♭`;
    }
    return '0';
  };

  const currentKeys = isMinorMode ? minorKeys : majorKeys;

  return (
    <div className="circle-of-fifths-container">
      <h2>Circle of Fifths</h2>
      
      <div className="mode-toggle">
        <button
          className={!isMinorMode ? 'active' : ''}
          onClick={() => setIsMinorMode(false)}
        >
          Major Keys
        </button>
        <button
          className={isMinorMode ? 'active' : ''}
          onClick={() => setIsMinorMode(true)}
        >
          Minor Keys
        </button>
      </div>

      <div className="circle-container">
        <svg width="300" height="300" className="circle-svg">
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="2"
          />
          
          {currentKeys.map((key, index) => {
            const position = getKeyPosition(index);
            const isSelected = selectedKey === key;
            
            return (
              <g key={key}>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="25"
                  fill={isSelected ? '#3498db' : '#f8f9fa'}
                  stroke={isSelected ? '#2980b9' : '#bdc3c7'}
                  strokeWidth="2"
                  className="key-circle"
                  onClick={() => handleKeyClick(key)}
                />
                <text
                  x={position.x}
                  y={position.y - 5}
                  textAnchor="middle"
                  className="key-text"
                  fill={isSelected ? 'white' : '#2c3e50'}
                  onClick={() => handleKeyClick(key)}
                >
                  {key}
                </text>
                <text
                  x={position.x}
                  y={position.y + 8}
                  textAnchor="middle"
                  className="signature-text"
                  fill={isSelected ? 'white' : '#7f8c8d'}
                  onClick={() => handleKeyClick(key)}
                >
                  {getKeySignatureDisplay(key)}
                </text>
              </g>
            );
          })}
          
          <text
            x="150"
            y="155"
            textAnchor="middle"
            className="center-text"
            fill="#2c3e50"
          >
            Circle of
          </text>
          <text
            x="150"
            y="175"
            textAnchor="middle"
            className="center-text"
            fill="#2c3e50"
          >
            Fifths
          </text>
        </svg>
      </div>

      {selectedKey && (
        <div className="key-info">
          <h3>{selectedKey} {isMinorMode ? 'Minor' : 'Major'}</h3>
          <div className="signature-info">
            {(() => {
              const signature = getKeySignature(selectedKey, isMinorMode);
              if (signature.sharps.length > 0) {
                return (
                  <p>
                    <strong>Sharps:</strong> {signature.sharps.join(', ')}
                  </p>
                );
              } else if (signature.flats.length > 0) {
                return (
                  <p>
                    <strong>Flats:</strong> {signature.flats.join(', ')}
                  </p>
                );
              } else {
                return <p><strong>No sharps or flats</strong></p>;
              }
            })()}
          </div>
        </div>
      )}

      <div className="circle-explanation">
        <h4>How it works:</h4>
        <ul>
          <li>Each key is a perfect fifth away from the next (clockwise)</li>
          <li>Moving clockwise adds sharps to the key signature</li>
          <li>Moving counter-clockwise adds flats</li>
          <li>Opposite keys are tritones apart (most distant relationship)</li>
          <li>Adjacent keys share the most common notes</li>
        </ul>
      </div>
    </div>
  );
};

export default CircleOfFifths;