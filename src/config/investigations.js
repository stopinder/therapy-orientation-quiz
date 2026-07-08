/**
 * @typedef {Object} InvestigationConfig
 * @property {string} id
 * @property {string} title
 * @property {string} observation
 * @property {string} explanation
 * @property {string[]} recognitionBullets
 * @property {string} uncertaintyStatement
 * @property {string} investigationIntro
 * @property {string} investigationPrompt
 * @property {string[]} followUpQuestions
 * @property {string} closingLine
 */

/** @type {InvestigationConfig[]} */
export const investigations = [
  {
    id: "interruptions",
    title: "A possible starting point",
    observation:
      "Several of your answers point towards situations where an interruption is followed by a change in what happens next.",
    explanation:
      "That doesn’t necessarily mean the interruption explains what happened next.",
    recognitionBullets: [
      "Something interrupted what you were doing.",
      "Your attention shifted before the task was finished.",
      "Getting back into the task felt harder than expected.",
      "The task remained unfinished longer than you expected."
    ],
    uncertaintyStatement:
      "These experiences may be related.\n\nOr they may be completely separate.\n\nThe only way to know is to compare them with real examples.",
    investigationIntro:
      "Think about the most recent time this happened.\n\nNot the biggest example.\n\nJust the most recent one.",
    investigationPrompt:
      "Then answer:",
    followUpQuestions: [
      "What were you doing?",
      "What interrupted it?",
      "What happened immediately afterwards?",
      "Did you return to the task? If so, when?"
    ],
    closingLine:
      "One recent example is enough to begin the investigation."
  },
  {
    id: "interrupted_momentum",
    title: "A possible starting point",
    observation:
      "Several of your answers point towards situations where an interruption is followed by a change in what happens next.",
    explanation:
      "That doesn’t necessarily mean the interruption explains what happened next.",
    recognitionBullets: [
      "Something interrupted what you were doing.",
      "Your attention shifted before the task was finished.",
      "Getting back into the task felt harder than expected.",
      "The task remained unfinished longer than you expected."
    ],
    uncertaintyStatement:
      "These experiences may be related.\n\nOr they may be completely separate.\n\nThe only way to know is to compare them with real examples.",
    investigationIntro:
      "Think about the most recent time this happened.\n\nNot the biggest example.\n\nJust the most recent one.",
    investigationPrompt:
      "Then answer:",
    followUpQuestions: [
      "What were you doing?",
      "What interrupted it?",
      "What happened immediately afterwards?",
      "Did you return to the task? If so, when?"
    ],
    closingLine:
      "One recent example is enough to begin the investigation."
  }
];

export const getInvestigationById = (id) => {
  return investigations.find(i => i.id === id) || investigations[0];
};
