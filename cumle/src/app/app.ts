import { ChangeDetectionStrategy, Component, inject, signal, OnInit, afterNextRender } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TranslationService, TranslationFeedback } from './translation.service';
import { DifficultyLevel, PracticeSentence } from './sentences';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private translationService = inject(TranslationService);

  difficulty = signal<DifficultyLevel>('orta');
  currentSentence = signal<PracticeSentence | null>(null);
  isEvaluating = signal<boolean>(false);
  feedback = signal<TranslationFeedback | null>(null);

  translationControl = new FormControl('', { validators: [Validators.required], nonNullable: true });

  constructor() {
    // Ensure the initial sentence is loaded only in the browser (client-side).
    // This prevents Server-Side Rendering (SSR) from caching the exact same random sentence for every user.
    afterNextRender(() => {
      this.loadNewSentence(true);
    });
  }

  ngOnInit() {
  }

  setDifficulty(level: DifficultyLevel) {
    if (this.isEvaluating()) return;
    this.difficulty.set(level);
    this.loadNewSentence();
  }

  loadNewSentence(isInitial = false) {
    this.feedback.set(null);
    if (!isInitial) {
      this.translationControl.reset();
    }
    const sentence = this.translationService.getRandomSentence(this.difficulty());
    this.currentSentence.set(sentence);
  }

  evaluate() {
    if (this.translationControl.invalid || this.isEvaluating()) {
      return;
    }

    this.isEvaluating.set(true);
    this.feedback.set(null);
    
    const sentence = this.currentSentence();
    if (sentence) {
      const result = this.translationService.evaluateTranslation(
        sentence,
        this.translationControl.value
      );
      this.feedback.set(result);
    }
    
    this.isEvaluating.set(false);
  }
}



