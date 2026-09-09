import { DIMENSIONS, SCORING_RULES } from './dimensions.js';
import { therapistQuestions } from './questions.js';

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/** Reject unknown IDs/values. Missing answers are not neutral answers. */
export function validateAnswers(answers, { requireComplete = true } = {}) {
  if (!isRecord(answers)) throw new TypeError('Answers must be an object of question and option IDs.');
  const allowedIds = new Set(therapistQuestions.map(question => question.id));
  if (Object.keys(answers).some(id => !allowedIds.has(id))) throw new Error('Unknown question ID.');
  const selections = [];
  for (const question of therapistQuestions) {
    if (!hasOwn(answers, question.id)) {
      if (requireComplete) throw new Error('Complete every question before generating a reflection.');
      continue;
    }
    const value = answers[question.id];
    if (typeof value !== 'string') throw new TypeError('Option IDs must be strings.');
    const option = question.options.find(item => item.value === value);
    if (!option) throw new Error('Unknown option ID.');
    selections.push({ question, option });
  }
  return selections;
}

/**
 * Internal arithmetic only. Not a confidence estimate, norm or clinical score.
 * Normalise each pole against its actual attainable total across answered,
 * non-context-dependent items. This avoids assuming equal opportunities on both
 * sides of a dimension. It does not establish psychometric validity.
 * Zero weights and context-dependent answers provide no directional evidence.
 */
export function scoreAnswers(answers, options = {}) {
  const selections = validateAnswers(answers, options);
  const dimensions = {};
  for (const [key, definition] of Object.entries(DIMENSIONS)) {
    const possible = therapistQuestions.filter(question => question.options.some(option => (option.weights[key] || 0) !== 0));
    let sum = 0;
    let leftCapacity = 0;
    let rightCapacity = 0;
    let directionalResponses = 0;
    let leftCount = 0;
    let rightCount = 0;
    const evidenceIds = [];
    for (const { question, option } of selections) {
      if (option.unscored) continue;
      const availableWeights = question.options.map(item => item.weights[key] || 0);
      leftCapacity += Math.max(0, -Math.min(...availableWeights));
      rightCapacity += Math.max(0, Math.max(...availableWeights));
      const weight = option.weights[key] || 0;
      sum += weight;
      if (weight === 0) continue;
      directionalResponses += 1;
      if (weight < 0) leftCount += 1;
      else rightCount += 1;
      evidenceIds.push(`${question.id}:${option.value}`);
    }
    const capacity = sum < 0 ? leftCapacity : sum > 0 ? rightCapacity : Math.max(leftCapacity, rightCapacity);
    const normalised = capacity > 0 ? sum / capacity : null;
    const coverage = possible.length ? directionalResponses / possible.length : 0;
    const sufficient = directionalResponses >= SCORING_RULES.minimumDirectionalResponses && coverage >= SCORING_RULES.minimumCoverage;
    let band = 'insufficient_evidence';
    let tendency = null;
    if (sufficient) {
      const magnitude = Math.abs(normalised || 0);
      band = magnitude < SCORING_RULES.slightLean ? 'no_clear_lean'
        : magnitude < SCORING_RULES.moderateLean ? 'slight'
          : magnitude < SCORING_RULES.clearLean ? 'moderate' : 'clear';
      if (band !== 'no_clear_lean') tendency = normalised < 0 ? definition.left : definition.right;
    }
    dimensions[key] = {
      sum, capacity, leftCapacity, rightCapacity, normalised, coverage,
      availableQuestions: possible.length,
      directionalResponses, leftCount, rightCount,
      mixedSignals: leftCount >= 2 && rightCount >= 2,
      tendency, band, evidenceIds
    };
  }
  return {
    answeredQuestions: selections.length,
    totalQuestions: therapistQuestions.length,
    contextDependentAnswers: selections.filter(({ option }) => option.unscored).length,
    dimensions
  };
}
