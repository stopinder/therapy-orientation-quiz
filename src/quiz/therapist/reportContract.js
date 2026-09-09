export const REPORT_VERSION = 'therapist-style-report-v1-draft';

export const REPORT_HEADINGS = Object.freeze({
  therapeuticStance: 'Your therapeutic stance',
  howYouWork: 'How you tend to work',
  expertise: 'Your relationship with expertise',
  clientExperience: 'What clients may experience',
  strengths: 'Likely strengths',
  tensions: 'Possible tensions or blind spots',
  lessHelpfulContexts: 'When your usual style may be less helpful',
  identityDescription: 'A possible description of your therapeutic identity'
});

const sectionSchema = () => ({
  type: 'object',
  additionalProperties: false,
  properties: {
    paragraphs: { type: 'array', items: { type: 'string' } },
    evidenceIds: { type: 'array', items: { type: 'string' } }
  },
  required: ['paragraphs', 'evidenceIds']
});

export const REPORT_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ...Object.fromEntries(Object.keys(REPORT_HEADINGS).map(key => [key, sectionSchema()])),
    reflectionQuestions: { type: 'array', items: { type: 'string' } }
  },
  required: [...Object.keys(REPORT_HEADINGS), 'reflectionQuestions']
};

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const exactKeys = (value, keys) => record(value) && Object.keys(value).length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value, key));

/** Structural/evidence validation, NOT a guarantee of narrative accuracy or tone. */
export function validateTherapistReport(content, profile) {
  try {
    if (typeof content === 'string' && content.length > 32000) return null;
    const report = typeof content === 'string' ? JSON.parse(content) : content;
    const required = REPORT_JSON_SCHEMA.required;
    if (!exactKeys(report, required)) return null;
    if (!Array.isArray(profile?.evidence)) return null;
    const permitted = new Set(profile.evidence.map(item => item.id));
    const validated = {};
    for (const key of Object.keys(REPORT_HEADINGS)) {
      const section = report[key];
      if (!exactKeys(section, ['paragraphs', 'evidenceIds'])) return null;
      if (!Array.isArray(section.paragraphs) || section.paragraphs.length < 1 || section.paragraphs.length > 3) return null;
      if (!section.paragraphs.every(paragraph => text(paragraph, 2000))) return null;
      if (!Array.isArray(section.evidenceIds) || section.evidenceIds.length > permitted.size) return null;
      if (new Set(section.evidenceIds).size !== section.evidenceIds.length) return null;
      if (!section.evidenceIds.every(id => typeof id === 'string' && permitted.has(id))) return null;
      validated[key] = {
        paragraphs: section.paragraphs.map(paragraph => paragraph.trim()),
        evidenceIds: [...section.evidenceIds]
      };
    }
    if (!Array.isArray(report.reflectionQuestions) || report.reflectionQuestions.length < 2 || report.reflectionQuestions.length > 4) return null;
    if (!report.reflectionQuestions.every(question => text(question, 600))) return null;
    validated.reflectionQuestions = report.reflectionQuestions.map(question => question.trim());
    if (JSON.stringify(validated).length > 32000) return null;
    return validated;
  } catch {
    return null;
  }
}
