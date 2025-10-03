import React, { useState } from 'react';
import './PianoKeyboard.css';

export interface Note {
  name: string;
  frequency: number;
  isSharp: boolean;
  keyCode?: string;
}

const notes: Note[] = [
  { name: 'C', frequency: 261.63, isSharp: false, keyCode: 'KeyA' },
  { name: 'C#', frequency: 277.18, isSharp: true, keyCode: 'KeyW' },
  { name: 'D', frequency: 293.66, isSharp: false, keyCode: 'KeyS' },
  { name: 'D#', frequency: 311.13, isSharp: true, keyCode: 'KeyE' },
  { name: 'E', frequency: 329.63, isSharp: false, keyCode: 'KeyD' },
  { name: 'F', frequency: 349.23, isSharp: false, keyCode: 'KeyF' },
  { name: 'F#', frequency: 369.99, isSharp: true, keyCode: 'KeyT' },
  { name: 'G', frequency: 392.00, isSharp: false, keyCode: 'KeyG' },
  { name: 'G#', frequency: 415.30, isSharp: true, keyCode: 'KeyY' },
  { name: 'A', frequency: 440.00, isSharp: false, keyCode: 'KeyH' },
  { name: 'A#', frequency: 466.16, isSharp: true, keyCode: 'KeyU' },
  { name: 'B', frequency: 493.88, isSharp: false, keyCode: 'KeyJ' },
];

interface PianoKeyboardProps {
  highlightedNotes?: string[];
  onNotePlay?: (note: Note) => void;
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ 
  highlightedNotes = [], 
  onNotePlay 
}) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const handleKeyPress = (note: Note) => {
    setActiveKeys(prev => new Set(prev).add(note.name));
    onNotePlay?.(note);
    
    setTimeout(() => {
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note.name);
        return newSet;
      });
    }, 200);
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const note = notes.find(n => n.keyCode === event.code);
      if (note && !activeKeys.has(note.name)) {
        handleKeyPress(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeKeys]);

  const whiteKeys = notes.filter(note => !note.isSharp);
  const blackKeys = notes.filter(note => note.isSharp);

  return (
    <div className="piano-keyboard">
      <div className="white-keys">
        {whiteKeys.map((note) => (
          <button
            key={note.name}
            className={`white-key ${
              activeKeys.has(note.name) ? 'active' : ''
            } ${
              highlightedNotes.includes(note.name) ? 'highlighted' : ''
            }`}
            onMouseDown={() => handleKeyPress(note)}
            onTouchStart={() => handleKeyPress(note)}
          >
            <span className="note-label">{note.name}</span>
          </button>
        ))}
      </div>
      
      <div className="black-keys">
        {blackKeys.map((note, index) => {
          const positions = [8.5, 25, 58.5, 75, 91.5];
          return (
            <button
              key={note.name}
              className={`black-key ${
                activeKeys.has(note.name) ? 'active' : ''
              } ${
                highlightedNotes.includes(note.name) ? 'highlighted' : ''
              }`}
              style={{ left: `${positions[index]}%` }}
              onMouseDown={() => handleKeyPress(note)}
              onTouchStart={() => handleKeyPress(note)}
            >
              <span className="note-label">{note.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PianoKeyboard;