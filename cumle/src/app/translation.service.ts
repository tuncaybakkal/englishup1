import { Injectable } from '@angular/core';
import { SENTENCES, DifficultyLevel, PracticeSentence } from './sentences';

export interface TranslationFeedback {
  isCorrect: boolean;
  correctTranslation: string;
  userTranslation: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private lastSentence: PracticeSentence | null = null;
  
  getRandomSentence(level: DifficultyLevel = 'orta'): PracticeSentence {
    const filteredSentences = SENTENCES.filter(s => s.level === level);
    let availableSentences = filteredSentences;
    
    // Prevent showing the exact same sentence twice in a row
    if (this.lastSentence && availableSentences.length > 1) {
      availableSentences = availableSentences.filter(s => s.turkish !== this.lastSentence!.turkish);
    }
    
    const randomIndex = Math.floor(Math.random() * availableSentences.length);
    const selected = availableSentences[randomIndex];
    this.lastSentence = selected;
    
    return selected;
  }

  evaluateTranslation(sentence: PracticeSentence, userTranslation: string): TranslationFeedback {
    // Simple comparison (case insensitive, ignoring punctuation at the end)
    const cleanUser = userTranslation.trim().toLowerCase().replace(/[.,!?]$/, '');
    const cleanCorrect = sentence.english.trim().toLowerCase().replace(/[.,!?]$/, '');
    
    const isCorrect = cleanUser === cleanCorrect;

    return {
      isCorrect,
      correctTranslation: sentence.english,
      userTranslation: userTranslation
    };
  }
}

