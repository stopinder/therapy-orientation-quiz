import { buildTherapistProfile } from '../buildTherapistProfile.js';

// The view imports this module only inside import.meta.env.DEV. The production
// browser check also asserts that this sentinel and fixture copy are absent.
export const DEVELOPMENT_FIXTURE_SENTINEL = 'THERAPIST_STYLE_DEV_FIXTURE_ONLY';

function pause(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new Error('Cancelled')); return; }
    const abort = () => { clearTimeout(timer); reject(new Error('Cancelled')); };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, milliseconds);
    signal?.addEventListener('abort', abort, { once: true });
  });
}

/** Layout fixture, not AI output. Never used as a production fallback. */
export function createDevelopmentReportAdapter({ failFirst = false, delayMs = 450 } = {}) {
  if (!import.meta.env.DEV) throw new Error('Development reports are unavailable in production');
  let attempts = 0;
  return {
    kind: 'development-mock',
    sentinel: DEVELOPMENT_FIXTURE_SENTINEL,
    async generate(answers, { signal } = {}) {
      attempts += 1;
      await pause(delayMs, signal);
      if (failFirst && attempts === 1) throw new Error('Deliberate development preview failure');
      const profile = buildTherapistProfile(answers);
      const section = (...paragraphs) => ({ paragraphs, evidenceIds: [] });
      const caveat = profile.limitedEvidence
        ? 'These selections provide limited directional evidence. A real report should stay brief and leave space for context, rather than manufacture a therapeutic identity.'
        : 'The local scorer has prepared a versioned profile. This sample demonstrates the reading experience; it does not interpret that profile or stand in for a generated report.';
      return {
        therapeuticStance: section('DEVELOPMENT SAMPLE — not an AI report.', caveat),
        howYouWork: section('The finished reflection will consider how direction, structure and ways of attending to experience meet in your work. These are different questions: offering structure need not mean taking ownership of the client’s direction.'),
        expertise: section('This section will explore what the selected scenarios support about offering a perspective, keeping a hypothesis provisional or making inquiry shared. Where the evidence is thin, the report should say so.'),
        clientExperience: section('Different clients may meet the same therapeutic stance differently. The finished report will offer possibilities to consider, not claim to know what clients experience or how well the therapy works.'),
        strengths: section('A useful reflection connects a possible strength to the conditions in which it helps. It should not turn a preference into proof of competence or reassure the reader simply because the language sounds familiar.'),
        tensions: section('Two inclinations can sit together without being a contradiction. The finished report will hold apparent tensions lightly and ask how they are negotiated in particular moments.'),
        lessHelpfulContexts: section('This space is for considering when a usual way of working might need more room, a different emphasis or a conversation with the client. It is not a prescription to change modality.'),
        identityDescription: section('A description of therapeutic identity should be something to try on, revise or decline. It is a snapshot of selected inclinations, not a fixed account of the person behind the practice.'),
        reflectionQuestions: [
          'Which inclination feels familiar, and when does your experience differ?',
          'When does a usually helpful preference become less useful in the room?',
          'What would you want a future reflection to leave open rather than decide for you?'
        ]
      };
    }
  };
}
