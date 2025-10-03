export interface Scale {
  name: string;
  intervals: number[];
  description: string;
}

export interface ScaleInfo extends Scale {
  notes: string[];
  rootNote: string;
}

export const SCALES: Record<string, Scale> = {
  major: {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: 'Happy, bright sound. Most common scale in Western music.'
  },
  minor: {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'Sad, melancholic sound. Very common in emotional music.'
  },
  dorian: {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: 'Minor with a raised 6th. Used in jazz and folk music.'
  },
  mixolydian: {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    description: 'Major with a lowered 7th. Common in blues and rock.'
  },
  pentatonic: {
    name: 'Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    description: 'Five-note scale. Very common in Asian music and blues.'
  },
  blues: {
    name: 'Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'Essential for blues music. Contains the blue notes.'
  }
};

export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

export function generateScale(rootNote: string, scale: Scale): ScaleInfo {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);
  if (rootIndex === -1) {
    throw new Error(`Invalid root note: ${rootNote}`);
  }

  const notes = scale.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return CHROMATIC_NOTES[noteIndex];
  });

  return {
    ...scale,
    notes,
    rootNote
  };
}

export function getScaleDegrees(scale: ScaleInfo): string[] {
  const degrees = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];
  return scale.intervals.map(interval => degrees[interval]);
}

export function getRelativeMinor(majorKey: string): string {
  const majorIndex = CHROMATIC_NOTES.indexOf(majorKey);
  const minorIndex = (majorIndex + 9) % 12;
  return CHROMATIC_NOTES[minorIndex];
}

export function getRelativeMajor(minorKey: string): string {
  const minorIndex = CHROMATIC_NOTES.indexOf(minorKey);
  const majorIndex = (minorIndex + 3) % 12;
  return CHROMATIC_NOTES[majorIndex];
}

export function getKeySignature(key: string, isMinor: boolean = false): { sharps: string[], flats: string[] } {
  const sharpOrder = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'];
  const flatOrder = ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭'];
  
  const majorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭'];
  const sharpCounts = [0, 1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -4, -5, -6, -7];
  
  let targetKey = key;
  if (isMinor) {
    targetKey = getRelativeMajor(key);
  }
  
  const keyIndex = majorKeys.indexOf(targetKey);
  if (keyIndex === -1) return { sharps: [], flats: [] };
  
  const count = sharpCounts[keyIndex];
  
  if (count > 0) {
    return { sharps: sharpOrder.slice(0, count), flats: [] };
  } else if (count < 0) {
    return { sharps: [], flats: flatOrder.slice(0, Math.abs(count)) };
  }
  
  return { sharps: [], flats: [] };
}

export function getChordFromScale(scale: ScaleInfo, degree: number): string[] {
  if (degree < 1 || degree > scale.notes.length) {
    throw new Error(`Invalid degree: ${degree}`);
  }
  
  const chordNotes = [];
  for (let i = 0; i < 3; i++) {
    const noteIndex = (degree - 1 + i * 2) % scale.notes.length;
    chordNotes.push(scale.notes[noteIndex]);
  }
  
  return chordNotes;
}