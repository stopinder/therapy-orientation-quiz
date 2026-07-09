import type { DecisionPackage } from '../investigationBrain/types';
import type { Question, QuestionOptions, QuestionCategory } from './types';
import { QUESTION_LIBRARY } from './questionLibrary';

export function getQuestionForDecision(
  decision: DecisionPackage,
  options: QuestionOptions = {}
): Question {
  const category = decision.questionCategory as QuestionCategory;

  // 1. Filter by category and active status
  let candidates = QUESTION_LIBRARY.filter(
    (q) => q.category === category && q.active
  );

  // 2. Fallback if no matching category
  if (candidates.length === 0) {
    return {
      id: 'SAFE_FALLBACK',
      category: 'example_collection',
      intent: 'establish',
      text: 'Tell me more about what is happening.',
      purpose: 'Safe fallback question',
      active: true,
    };
  }

  // 3. Prefer triggerContext if supplied
  if (options.triggerContext) {
    const triggerMatches = candidates.filter(
      (q) => q.triggerContext === options.triggerContext
    );
    if (triggerMatches.length > 0) {
      candidates = triggerMatches;
    }
  }

  // 4. Prefer intent if supplied
  if (options.intent) {
    const intentMatches = candidates.filter((q) => q.intent === options.intent);
    if (intentMatches.length > 0) {
      candidates = intentMatches;
    }
  }

  // 5. Return deterministically (first one from the filtered list)
  return candidates[0];
}
