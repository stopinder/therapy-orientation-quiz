import { CONTENT_VERSION, DIMENSIONS, DISCLAIMER, SCHEMA_VERSION, SCORING_RULES, SCORING_VERSION, THEME_DEFINITIONS } from './dimensions.js';
import { scoreAnswers, validateAnswers } from './scoring.js';

/**
 * Authoritative server use: recompute from allow-listed answer IDs.
 * Never trust a browser-submitted profile for storage or report generation.
 * No names, emails, client data, timestamps or free-text input enter this builder.
 */
export function buildTherapistProfile(answers) {
  const scored = scoreAnswers(answers);
  const selections = validateAnswers(answers);
  const evidence = selections.filter(({ option }) => !option.unscored).map(({ question, option }) => ({
    id: `${question.id}:${option.value}`,
    questionId: question.id,
    observation: `In the scenario “${question.text}”, the selected inclination was: ${option.label}`
  }));
  const dimensions = Object.fromEntries(Object.entries(scored.dimensions).map(([id, dimension]) => [id, {
    label: DIMENSIONS[id].label,
    poles: [DIMENSIONS[id].left, DIMENSIONS[id].right],
    tendency: dimension.tendency,
    band: dimension.band,
    mixedSignals: dimension.mixedSignals,
    supportingResponses: dimension.directionalResponses,
    availableQuestions: dimension.availableQuestions,
    evidenceIds: [...dimension.evidenceIds]
  }]));

  // Stable ordering breaks display ties, not ties in an asserted therapist type.
  const leans = Object.entries(scored.dimensions)
    .filter(([, dimension]) => dimension.tendency !== null)
    .sort((a, b) => Math.abs(b[1].normalised) - Math.abs(a[1].normalised))
    .map(([dimensionId, dimension]) => ({ dimensionId, tendency: dimension.tendency, band: dimension.band }));

  const themes = Object.entries(THEME_DEFINITIONS).flatMap(([id, observation]) => {
    const supporting = selections.filter(({ option }) => !option.unscored && option.themes.includes(id));
    if (supporting.length < SCORING_RULES.themeMinimumQuestions) return [];
    return [{ id, observation, evidenceIds: supporting.map(({ question, option }) => `${question.id}:${option.value}`) }];
  });

  // These are possibilities to explore, not evidence of a defect or contradiction.
  const explorationPoints = [];
  if (dimensions.direction.tendency === 'collaborative' && dimensions.structure.tendency === 'structured') {
    explorationPoints.push({
      id: 'collaboration_and_structure',
      observation: 'Your choices combine shared direction with some preference for structure. These can work comfortably together; it may be interesting to notice how the structure is negotiated.',
      evidenceIds: [...new Set([...dimensions.direction.evidenceIds, ...dimensions.structure.evidenceIds])]
    });
  }
  for (const [id, dimension] of Object.entries(dimensions)) {
    if (!dimension.mixedSignals || dimension.band === 'insufficient_evidence') continue;
    explorationPoints.push({
      id: `contextual_variation_${id}`,
      observation: `Your choices approached “${DIMENSIONS[id].label}” differently across scenarios. This may reflect context; it does not establish flexibility, inconsistency or a hidden conflict.`,
      evidenceIds: [...dimension.evidenceIds]
    });
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    contentVersion: CONTENT_VERSION,
    scoringVersion: SCORING_VERSION,
    sourceKind: 'self_report_quiz',
    answeredQuestions: scored.answeredQuestions,
    contextDependentAnswers: scored.contextDependentAnswers,
    dimensions,
    primaryTendencies: leans.slice(0, 2),
    secondaryTendencies: leans.slice(2),
    themes,
    explorationPoints: explorationPoints.slice(0, 2),
    optionalLabel: null,
    evidence,
    limitedEvidence: Object.values(dimensions).filter(dimension => dimension.band !== 'insufficient_evidence').length < 3,
    limitations: [
      DISCLAIMER,
      'A snapshot of selected inclinations in imagined situations, not direct observation of practice.',
      'The weights and wording bands are editorial rules, not validated measurements or confidence estimates.',
      'No clear lean is not evidence of superior balance. Context-dependent responses are not scored as neutral.',
      'Absence of a theme does not establish its opposite. Current therapist-authored reflection takes priority.'
    ]
  };
}
