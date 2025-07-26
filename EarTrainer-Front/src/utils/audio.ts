import { Note, AudioContextRef } from '../types';

// Mapeo de archivos mp3 locales
const audioFiles: { [key in Note]: string } = {
  'C': '/audio/c.mp3',
  'D': '/audio/d.mp3',
  'E': '/audio/e.mp3',
  'F': '/audio/f.mp3',
  'G': '/audio/g.mp3',
  'A': '/audio/a.mp3',
  'B': '/audio/b.mp3'
};

// Función para asegurar que el AudioContext esté inicializado correctamente
export const ensureAudioContext = (audioContextRef: AudioContextRef): boolean => {
  try {
    if (!audioContextRef.audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;
      audioContextRef.audioContext = new AudioContextClass();
      audioContextRef.gainNode = audioContextRef.audioContext.createGain();
      audioContextRef.gainNode.gain.value = 0.5;
      audioContextRef.gainNode.connect(audioContextRef.audioContext.destination);
    }
    if (audioContextRef.audioContext.state === 'suspended') {
      audioContextRef.audioContext.resume();
    }
    return audioContextRef.audioContext.state === 'running' || audioContextRef.audioContext.state === 'suspended';
  } catch (e) {
    console.error('Error ensuring audio context:', e);
    return false;
  }
};

let lastAudio: HTMLAudioElement | null = null;

// Detener todos los audios activos (solo para Web Audio API, no mp3)
export const stopAllAudio = () => {
  if (lastAudio) {
    lastAudio.pause();
    lastAudio.currentTime = 0;
    lastAudio = null;
  }
};

// Reproducir una nota usando solo mp3
export const playNote = (
  audioContextRef: AudioContextRef,
  note: Note,
  duration: number = 1
) => {
  // Detener el audio anterior si sigue sonando
  if (lastAudio) {
    lastAudio.pause();
    lastAudio.currentTime = 0;
    lastAudio = null;
  }
  const audio = new window.Audio(audioFiles[note]);
  audio.currentTime = 0;
  audio.volume = 0.7;
  audio.play();
  lastAudio = audio;
};

// Reproducir la escala de Do mayor usando mp3
export const playScale = (
  audioContextRef: AudioContextRef,
  onComplete: () => void
) => {
  const notes: Note[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  let index = 0;
  let timeoutId: NodeJS.Timeout;

  const playNextNote = () => {
    if (index < notes.length) {
      playNote(audioContextRef, notes[index], 0.6);
      index++;
      timeoutId = setTimeout(playNextNote, 700);
    } else {
      timeoutId = setTimeout(onComplete, 600);
    }
  };

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  playNextNote();
  return cleanup;
};

// Reproducir el acorde de Do mayor usando mp3
export const playTriad = (
  audioContextRef: AudioContextRef,
  onComplete: () => void
) => {
  const triadSequence: Note[] = ['C', 'E', 'G', 'E', 'C'];
  let index = 0;
  let timeoutId: NodeJS.Timeout;

  const playNextNote = () => {
    if (index < triadSequence.length) {
      playNote(audioContextRef, triadSequence[index], 0.6);
      index++;
      timeoutId = setTimeout(playNextNote, 700);
    } else {
      timeoutId = setTimeout(onComplete, 600);
    }
  };

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  playNextNote();
  return cleanup;
};
