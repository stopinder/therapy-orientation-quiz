import { describe, expect, it } from 'vitest';
import { DIMENSIONS, THEME_DEFINITIONS } from '../dimensions.js';
import { therapistQuestions } from '../questions.js';
import { scoreAnswers } from '../scoring.js';
import { buildTherapistProfile } from '../buildTherapistProfile.js';
import { REPORT_HEADINGS, validateTherapistReport } from '../reportContract.js';
import { buildTherapistReportInput } from '../reportInstructions.js';

const all = (index = 0) => Object.fromEntries(therapistQuestions.map(question => [question.id, question.options[index].value]));
const contextOnly = () => Object.fromEntries(therapistQuestions.map(question => [question.id, 'context_dependent']));
const extreme = (dimension, sign) => Object.fromEntries(therapistQuestions.map(question => {
  const selected = question.options.filter(option => !option.unscored).reduce((best, option) =>
    sign * (option.weights[dimension] || 0) > sign * (best.weights[dimension] || 0) ? option : best);
  return [question.id, selected.value];
}));
const exampleReport = profile => ({
  ...Object.fromEntries(Object.keys(REPORT_HEADINGS).map(key => [key, {
    paragraphs: ['A bounded test paragraph, not a real report.'],
    evidenceIds: profile.evidence.length ? [profile.evidence[0].id] : []
  }])),
  reflectionQuestions: ['What feels recognisable?', 'What seems less applicable?']
});

describe('therapist question bank', () => {
  it('contains fifteen unique scenarios with stable options and unscored context', () => {
    expect(therapistQuestions).toHaveLength(15);
    expect(new Set(therapistQuestions.map(question => question.id)).size).toBe(15);
    for (const question of therapistQuestions) {
      expect(question.options).toHaveLength(5);
      expect(new Set(question.options.map(option => option.value)).size).toBe(5);
      expect(question.options.filter(option => option.unscored)).toHaveLength(1);
      for (const option of question.options) {
        for (const [dimension, weight] of Object.entries(option.weights)) {
          expect(Object.keys(DIMENSIONS)).toContain(dimension);
          expect(Number.isInteger(weight)).toBe(true);
          expect(weight).toBeGreaterThanOrEqual(-2);
          expect(weight).toBeLessThanOrEqual(2);
        }
        for (const theme of option.themes) expect(Object.keys(THEME_DEFINITIONS)).toContain(theme);
        if (option.unscored) {
          expect(option.weights).toEqual({});
          expect(option.themes).toEqual([]);
        }
      }
    }
  });

  it('offers both poles and at least three relevant scenarios for every dimension', () => {
    for (const key of Object.keys(DIMENSIONS)) {
      const relevant = therapistQuestions.filter(question => question.options.some(option => option.weights[key]));
      const weights = relevant.flatMap(question => question.options.map(option => option.weights[key] || 0));
      expect(relevant.length).toBeGreaterThanOrEqual(3);
      expect(weights.some(weight => weight < 0)).toBe(true);
      expect(weights.some(weight => weight > 0)).toBe(true);
    }
  });
});

describe('deterministic scoring', () => {
  it('rejects invalid, incomplete and extra inputs', () => {
    for (const value of [null, [], 'answers', {}, { ...all(), extra: 'anything' }, { ...all(), T01: 'invented' }, { ...all(), T01: 0 }]) {
      expect(() => scoreAnswers(value)).toThrow();
    }
    expect(() => scoreAnswers({ ...all(), email: 'not-needed@example.invalid' })).toThrow();
  });

  it('is deterministic, ignores insertion order and does not mutate inputs', () => {
    const input = all();
    const before = JSON.stringify(input);
    const reversed = Object.fromEntries(Object.entries(input).reverse());
    expect(scoreAnswers(input)).toEqual(scoreAnswers(reversed));
    expect(buildTherapistProfile(input)).toEqual(buildTherapistProfile(input));
    expect(JSON.stringify(input)).toBe(before);
  });

  it('can map one choice to multiple dimensions without assuming completeness', () => {
    const scored = scoreAnswers({ T01: 'weigh_together' }, { requireComplete: false });
    expect(scored.dimensions.direction.sum).toBe(2);
    expect(scored.dimensions.mode.sum).toBe(-1);
    expect(scored.dimensions.direction.band).toBe('insufficient_evidence');
  });

  it('does not manufacture a default profile from context-dependent responses', () => {
    const input = contextOnly();
    const scored = scoreAnswers(input);
    expect(scored.contextDependentAnswers).toBe(15);
    for (const dimension of Object.values(scored.dimensions)) {
      expect(dimension.normalised).toBeNull();
      expect(dimension.band).toBe('insufficient_evidence');
      expect(dimension.tendency).toBeNull();
    }
    const profile = buildTherapistProfile(input);
    expect(profile.primaryTendencies).toEqual([]);
    expect(profile.themes).toEqual([]);
    expect(profile.explorationPoints).toEqual([]);
    expect(profile.optionalLabel).toBeNull();
    expect(profile.limitedEvidence).toBe(true);
  });

  it('normalises each actual pole to its attainable maximum', () => {
    for (const key of Object.keys(DIMENSIONS)) {
      expect(scoreAnswers(extreme(key, 1)).dimensions[key].normalised).toBeCloseTo(1);
      expect(scoreAnswers(extreme(key, -1)).dimensions[key].normalised).toBeCloseTo(-1);
    }
  });

  it('keeps opposing observations rather than interpreting cancellation as balance', () => {
    const input = {
      ...contextOnly(), T01: 'offer_view', T05: 'make_space',
      T07: 'offer_tentatively', T09: 'design_together',
      T11: 'organise_threads', T14: 'compare_accounts'
    };
    const direction = scoreAnswers(input).dimensions.direction;
    expect(direction.sum).toBe(0);
    expect(direction.band).toBe('no_clear_lean');
    expect(direction.mixedSignals).toBe(true);
    expect(direction.tendency).toBeNull();
  });

  it('stays bounded over a deterministic sample of answer combinations', () => {
    let seed = 20260909;
    const next = () => {
      seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
      return seed >>> 0;
    };
    for (let trial = 0; trial < 200; trial += 1) {
      const input = Object.fromEntries(therapistQuestions.map(question => [question.id, question.options[next() % question.options.length].value]));
      for (const dimension of Object.values(scoreAnswers(input).dimensions)) {
        if (dimension.normalised !== null) {
          expect(Number.isFinite(dimension.normalised)).toBe(true);
          expect(dimension.normalised).toBeGreaterThanOrEqual(-1);
          expect(dimension.normalised).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe('profile and report boundaries', () => {
  it('exports qualitative dimensions with traceable sources, not confidence scores', () => {
    const profile = buildTherapistProfile(all());
    const ids = new Set(profile.evidence.map(item => item.id));
    expect(profile.explorationPoints.length).toBeLessThanOrEqual(2);
    for (const dimension of Object.values(profile.dimensions)) {
      expect(dimension).not.toHaveProperty('normalised');
      expect(dimension).not.toHaveProperty('confidence');
      expect(dimension.evidenceIds.every(id => ids.has(id))).toBe(true);
    }
    for (const theme of profile.themes) {
      expect(theme.evidenceIds.length).toBeGreaterThanOrEqual(2);
      expect(theme.evidenceIds.every(id => ids.has(id))).toBe(true);
    }
  });

  it('requires more than one answer to infer a contextual theme', () => {
    const profile = buildTherapistProfile({ ...contextOnly(), T01: 'offer_view' });
    expect(profile.themes).toEqual([]);
  });

  it('builds model input from the canonical scorer', () => {
    const request = buildTherapistReportInput(all());
    expect(JSON.parse(request.messages[1].content)).toEqual(buildTherapistProfile(all()));
    expect(request.responseFormat.json_schema.strict).toBe(true);
  });

  it('accepts complete structured reports and rejects unknown evidence or fields', () => {
    const profile = buildTherapistProfile(all());
    expect(validateTherapistReport(exampleReport(profile), profile)).not.toBeNull();
    const unknown = exampleReport(profile);
    unknown.therapeuticStance.evidenceIds = ['invented'];
    expect(validateTherapistReport(unknown, profile)).toBeNull();
    expect(validateTherapistReport({ ...exampleReport(profile), diagnosis: 'not allowed' }, profile)).toBeNull();
    expect(validateTherapistReport('not JSON', profile)).toBeNull();
    expect(validateTherapistReport('x'.repeat(32001), profile)).toBeNull();
  });

  it('rejects missing, empty and excessively long narrative sections', () => {
    const profile = buildTherapistProfile(all());
    const missing = exampleReport(profile);
    delete missing.expertise;
    expect(validateTherapistReport(missing, profile)).toBeNull();
    const empty = exampleReport(profile);
    empty.strengths.paragraphs = [''];
    expect(validateTherapistReport(empty, profile)).toBeNull();
    const oversized = exampleReport(profile);
    oversized.strengths.paragraphs = ['x'.repeat(2001)];
    expect(validateTherapistReport(oversized, profile)).toBeNull();
  });
});
