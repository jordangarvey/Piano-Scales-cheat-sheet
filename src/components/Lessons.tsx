import React, { useState } from 'react';
import { ScaleInfo } from '../utils/musicTheory';
import './Lessons.css';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string[];
  practiceScale?: { root: string; scale: string };
}

const lessons: Lesson[] = [
  {
    id: 'piano-basics',
    title: 'Piano Keyboard Basics',
    description: 'Learn the layout of the piano keyboard and note names',
    content: [
      'The piano keyboard consists of white and black keys arranged in a specific pattern.',
      'White keys represent natural notes: C, D, E, F, G, A, B.',
      'Black keys represent sharps and flats (e.g., C# or D♭).',
      'The pattern of black keys repeats every 12 keys (one octave).',
      'Middle C is a reference point - it\'s usually located near the center of the keyboard.'
    ]
  },
  {
    id: 'major-scales',
    title: 'Understanding Major Scales',
    description: 'Learn the structure and sound of major scales',
    content: [
      'Major scales have a bright, happy sound and follow the pattern: W-W-H-W-W-W-H.',
      'W = Whole step (2 semitones), H = Half step (1 semitone).',
      'All major scales use the same interval pattern, just starting from different notes.',
      'The C major scale uses only white keys: C-D-E-F-G-A-B-C.',
      'Try playing different major scales to hear their similar character.'
    ],
    practiceScale: { root: 'C', scale: 'major' }
  },
  {
    id: 'minor-scales',
    title: 'Understanding Minor Scales',
    description: 'Explore the emotional depth of minor scales',
    content: [
      'Minor scales have a sad, melancholic sound and follow the pattern: W-H-W-W-H-W-W.',
      'The natural minor scale is the most common type of minor scale.',
      'A minor is the relative minor of C major - they share the same notes.',
      'Minor scales are essential for emotional expression in music.',
      'Compare major and minor scales built on the same root note to hear the difference.'
    ],
    practiceScale: { root: 'A', scale: 'minor' }
  },
  {
    id: 'intervals',
    title: 'Musical Intervals',
    description: 'Learn about the distances between notes',
    content: [
      'An interval is the distance between two notes.',
      'Common intervals: Unison (0), Minor 2nd (1), Major 2nd (2), Minor 3rd (3), Major 3rd (4).',
      'Perfect intervals: Unison, 4th, 5th, and Octave are called "perfect".',
      'Major and minor intervals: 2nd, 3rd, 6th, and 7th can be major or minor.',
      'Intervals are the building blocks of chords and scales.'
    ]
  },
  {
    id: 'circle-of-fifths',
    title: 'Circle of Fifths',
    description: 'Understand key relationships and signatures',
    content: [
      'The Circle of Fifths shows the relationship between all 12 keys.',
      'Moving clockwise adds sharps: C(0♯) → G(1♯) → D(2♯) → A(3♯) → E(4♯) → B(5♯).',
      'Moving counter-clockwise adds flats: C(0♭) → F(1♭) → B♭(2♭) → E♭(3♭) → A♭(4♭).',
      'Each key is a perfect fifth away from the next.',
      'This tool helps understand key signatures and chord progressions.'
    ]
  },
  {
    id: 'chord-basics',
    title: 'Basic Chords',
    description: 'Introduction to triads and chord construction',
    content: [
      'A chord is three or more notes played together.',
      'Triads are three-note chords built using every other note from a scale.',
      'Major triad: Root + Major 3rd + Perfect 5th (happy sound).',
      'Minor triad: Root + Minor 3rd + Perfect 5th (sad sound).',
      'In C major: C-E-G (C major), D-F-A (D minor), E-G-B (E minor), etc.'
    ]
  }
];

interface LessonsProps {
  onPracticeScale?: (root: string, scale: string) => void;
}

const Lessons: React.FC<LessonsProps> = ({ onPracticeScale }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handlePractice = (lesson: Lesson) => {
    if (lesson.practiceScale && onPracticeScale) {
      onPracticeScale(lesson.practiceScale.root, lesson.practiceScale.scale);
    }
  };

  return (
    <div className="lessons-container">
      <h2>Piano Lessons</h2>
      
      <div className="lessons-layout">
        <div className="lessons-list">
          <h3>Choose a Lesson</h3>
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`lesson-card ${selectedLesson?.id === lesson.id ? 'active' : ''}`}
              onClick={() => setSelectedLesson(lesson)}
            >
              <h4>{lesson.title}</h4>
              <p>{lesson.description}</p>
            </div>
          ))}
        </div>
        
        {selectedLesson && (
          <div className="lesson-content">
            <h3>{selectedLesson.title}</h3>
            <p className="lesson-description">{selectedLesson.description}</p>
            
            <div className="lesson-text">
              {selectedLesson.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {selectedLesson.practiceScale && (
              <div className="practice-section">
                <h4>Practice Time!</h4>
                <p>Try playing the {selectedLesson.practiceScale.root} {selectedLesson.practiceScale.scale} scale.</p>
                <button
                  className="practice-button"
                  onClick={() => handlePractice(selectedLesson)}
                >
                  Load Practice Scale
                </button>
              </div>
            )}
            
            <div className="lesson-tips">
              <h4>💡 Practice Tips</h4>
              <ul>
                <li>Start slowly and focus on accuracy</li>
                <li>Use both hands when comfortable</li>
                <li>Listen carefully to the sound of each interval</li>
                <li>Practice regularly, even if just for a few minutes</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;