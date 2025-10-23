import React, { useState } from 'react';
import './App.css';
import PianoKeyboard from './components/PianoKeyboard';
import ScalesTheory from './components/ScalesTheory';
import Lessons from './components/Lessons';
import CircleOfFifths from './components/CircleOfFifths';
import Quiz from './components/Quiz';
import { audioEngine } from './utils/audioEngine';
import { ScaleInfo, generateScale, SCALES } from './utils/musicTheory';
import type { Note } from './components/PianoKeyboard';

type TabType = 'scales' | 'lessons' | 'circle' | 'quiz';

function App() {
  const [currentScale, setCurrentScale] = useState<ScaleInfo | null>(null);
  const [highlightedNotes, setHighlightedNotes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('scales');

  const handleScaleSelect = (scale: ScaleInfo) => {
    setCurrentScale(scale);
    setHighlightedNotes(scale.notes);
  };

  const handleNotePlay = (note: Note) => {
    audioEngine.ensureAudioContext().then(() => {
      audioEngine.playNote(note.frequency);
    });
  };

  const handlePracticeScale = (root: string, scaleType: string) => {
    if (SCALES[scaleType]) {
      const scale = generateScale(root, SCALES[scaleType]);
      handleScaleSelect(scale);
      setActiveTab('scales');
    }
  };

  const handleCircleKeySelect = (key: string, isMinor: boolean) => {
    const scaleType = isMinor ? 'minor' : 'major';
    if (SCALES[scaleType]) {
      const scale = generateScale(key, SCALES[scaleType]);
      handleScaleSelect(scale);
    }
  };

  const handleQuizHighlight = (notes: string[]) => {
    setHighlightedNotes(notes);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Learn piano scales and keys!</h1>
        <p>Learn piano keys, scales, and music theory interactively</p>
      </header>
      
      <nav className="App-nav">
        <button
          className={activeTab === 'scales' ? 'active' : ''}
          onClick={() => setActiveTab('scales')}
        >
          Scales Theory
        </button>
        <button
          className={activeTab === 'lessons' ? 'active' : ''}
          onClick={() => setActiveTab('lessons')}
        >
          Lessons
        </button>
        <button
          className={activeTab === 'circle' ? 'active' : ''}
          onClick={() => setActiveTab('circle')}
        >
          Circle of Fifths
        </button>
        <button
          className={activeTab === 'quiz' ? 'active' : ''}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz
        </button>
      </nav>
      
      <main className="App-main">
        {activeTab === 'scales' && (
          <ScalesTheory onScaleSelect={handleScaleSelect} />
        )}
        
        {activeTab === 'lessons' && (
          <Lessons onPracticeScale={handlePracticeScale} />
        )}
        
        {activeTab === 'circle' && (
          <CircleOfFifths onKeySelect={handleCircleKeySelect} />
        )}
        
        {activeTab === 'quiz' && (
          <Quiz onScaleHighlight={handleQuizHighlight} />
        )}
        
        <div className="keyboard-section">
          <h2>Interactive Piano</h2>
          <p>Click keys or use keyboard (A-J) to play notes</p>
          <PianoKeyboard 
            highlightedNotes={highlightedNotes}
            onNotePlay={handleNotePlay}
          />
        </div>
        
        {currentScale && (
          <div className="current-scale-display">
            <h3>Currently Showing: {currentScale.rootNote} {currentScale.name}</h3>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
