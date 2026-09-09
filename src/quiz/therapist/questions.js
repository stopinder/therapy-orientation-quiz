/**
 * Draft content for review, not a competence test or psychometric instrument.
 * Values are stable IDs; answer order never determines scoring.
 * All options assume appropriate consent, safety and work within competence.
 */
export const QUIZ_INTRO = 'What kind of therapist are you?';
export const QUIZ_GUIDANCE = 'Think about what usually attracts your attention, not the answer you feel you ought to give. Assume the work is safe and within your competence. Several responses may fit; choose the closest, or say that the context matters too much to choose.';

const option = (value, label, weights, themes = []) => ({ value, label, weights, themes });
const contextual = () => ({
  value: 'context_dependent',
  label: 'The context would change my response too much to choose one.',
  weights: {}, themes: [], unscored: true
});
const question = (id, text, options) => ({ id, text, options: [...options, contextual()] });

export const therapistQuestions = [
  question('T01', 'A client asks, “What do you honestly think I should do?” What are you most drawn to doing next?', [
    option('offer_view', 'Offer a considered view, including its limits, and ask how it lands.', { direction: -2 }, ['offer_perspective']),
    option('weigh_together', 'Help them weigh the options against what matters to them.', { direction: 2, mode: -1 }, ['shared_inquiry']),
    option('notice_request', 'Explore what it is like to want an answer from me at this moment.', { direction: 1, meaningMaking: 1 }, ['relationship_attention', 'personal_meaning']),
    option('suggest_experiment', 'Suggest a small experiment that might make the decision clearer.', { direction: -1, therapeuticAim: -1 }, ['practical_experiment'])
  ]),
  question('T02', 'A client wonders whether a diagnosis would help them understand their experience. Which starting point appeals most?', [
    option('framework', 'Consider together what a diagnostic framework might explain and where it might fall short.', { meaningMaking: -1 }, ['diagnostic_framework', 'provisional_hypothesis']),
    option('meaning', 'Ask what having a name for the experience would mean to them.', { meaningMaking: 1 }, ['personal_meaning']),
    option('history', 'Explore how the experience has developed across their life before organising it around a label.', { timeOrientation: 2 }, ['contextual_meaning']),
    option('current_context', 'Begin with the circumstances in which the difficulty appears, and what the name would help them do now.', { timeOrientation: -2, therapeuticAim: -1 }, ['contextual_meaning'])
  ]),
  question('T03', 'A session becomes emotionally intense. The client remains able to choose whether to continue. Where does your attention go first?', [
    option('stay_with_feeling', 'Towards staying with the feeling and noticing how it changes.', { mode: 2, therapeuticAim: 1 }),
    option('make_sense', 'Towards helping put words and a workable understanding around the experience.', { mode: -2 }),
    option('between_us', 'Towards what the client needs from our contact right now.', { mode: 1, direction: 1 }, ['relationship_attention']),
    option('organise_next', 'Towards finding a manageable focus and deciding together what to work on next.', { structure: -2, therapeuticAim: -1 }, ['shared_inquiry'])
  ]),
  question('T04', 'A client gives an articulate explanation of a recurring difficulty but seems distant from the feeling of it. What interests you most?', [
    option('follow_meaning', 'Follow their explanation closely; an important distinction may still be emerging.', { mode: -2, therapeuticAim: 1 }),
    option('experience_now', 'Invite attention to what happens in them as they describe it here.', { mode: 2, timeOrientation: -1 }),
    option('history_of_distance', 'Wonder together when explaining became a familiar way of approaching difficult experiences.', { timeOrientation: 2, meaningMaking: -1 }, ['provisional_hypothesis']),
    option('try_something', 'Explore a small change they could try, even while their feelings remain hard to access.', { therapeuticAim: -2, timeOrientation: -1 }, ['practical_experiment'])
  ]),
  question('T05', 'There is a long silence. It does not seem unsafe, and its meaning is not yet clear. What is your usual inclination?', [
    option('make_space', 'Leave some space and see what the client brings next.', { structure: 2, direction: 1 }),
    option('ask_experience', 'Ask what the silence is like for them, without suggesting an explanation.', { meaningMaking: 2 }, ['personal_meaning']),
    option('offer_link', 'Tentatively offer a possible link between the silence and what was just happening between us.', { meaningMaking: -2 }, ['provisional_hypothesis', 'relationship_attention']),
    option('offer_focus', 'Suggest returning to a particular thread and check whether that would help.', { structure: -2, direction: -1 }, ['offer_perspective'])
  ]),
  question('T06', 'A client says, “You are the reason things have changed.” What would you most want to explore?', [
    option('specific_work', 'Which parts of our work they think made a difference.', { mode: -1, therapeuticAim: -1 }, ['shared_inquiry']),
    option('their_agency', 'How their own choices and efforts contributed to the change.', { direction: 2 }),
    option('meaning_of_us', 'What receiving something helpful from this relationship means to them.', { meaningMaking: 2, therapeuticAim: 1 }, ['relationship_attention', 'personal_meaning']),
    option('wider_pattern', 'Whether this way of locating change in another person connects with other important relationships.', { timeOrientation: 1, meaningMaking: -2 }, ['provisional_hypothesis'])
  ]),
  question('T07', 'You have a strong working hypothesis, but not much evidence for it yet. What feels most natural?', [
    option('offer_tentatively', 'Offer it explicitly as a possibility and invite the client to disagree.', { meaningMaking: -2, direction: -1 }, ['provisional_hypothesis', 'offer_perspective']),
    option('wait_for_more', 'Keep it in mind while inviting a fuller description of the client’s experience.', { meaningMaking: 2 }, ['withhold_interpretation']),
    option('test_together', 'Name the uncertainty and agree how we might examine the idea together.', { structure: -1, direction: 2 }, ['shared_inquiry', 'provisional_hypothesis']),
    option('stay_here', 'Set the hypothesis aside for now and follow what feels alive in the session.', { structure: 2, meaningMaking: 1 }, ['withhold_interpretation'])
  ]),
  question('T08', 'You suspect that something important in the client’s other relationships is also happening between you. How might you approach it?', [
    option('name_pattern', 'Offer the possible connection and see whether the client recognises it.', { meaningMaking: -2, timeOrientation: 1 }, ['provisional_hypothesis', 'relationship_attention']),
    option('describe_here', 'Describe what I notice between us, without yet linking it to a wider pattern.', { meaningMaking: 2, timeOrientation: -1 }, ['relationship_attention']),
    option('invite_history', 'Invite an example from another relationship and explore the similarities together.', { timeOrientation: 2, direction: 1 }, ['shared_inquiry']),
    option('different_experience', 'Focus on how we could respond differently to one another in this moment.', { timeOrientation: -2, therapeuticAim: -1 }, ['relationship_attention'])
  ]),
  question('T09', 'A client asks for structured exercises between sessions. Which response is closest to your preference?', [
    option('select_exercise', 'Offer a specific exercise linked to our agreed focus and arrange to review it.', { structure: -2, direction: -1 }, ['practical_experiment']),
    option('design_together', 'Develop an experiment together from something the client is curious about.', { direction: 2, therapeuticAim: -1 }, ['shared_inquiry', 'practical_experiment']),
    option('explore_request', 'Explore what they hope an exercise would provide before deciding on its form.', { structure: 1, therapeuticAim: 1 }, ['personal_meaning']),
    option('try_in_session', 'Try an experiential exercise together first and let that inform what happens outside the room.', { mode: 2, structure: 1 }, ['practical_experiment'])
  ]),
  question('T10', 'A present-day difficulty seems connected to earlier experiences. Where would you most want to put the session’s emphasis?', [
    option('current_sequence', 'On the sequence unfolding in the client’s current life.', { timeOrientation: -2 }),
    option('development', 'On how this response developed and what has carried forward.', { timeOrientation: 2, therapeuticAim: 1 }),
    option('test_link', 'On testing a possible connection between past and present.', { timeOrientation: 1, meaningMaking: -2 }, ['provisional_hypothesis']),
    option('present_experience', 'On describing the experience as it happens now, leaving its origins open.', { timeOrientation: -1, meaningMaking: 2 }, ['withhold_interpretation'])
  ]),
  question('T11', 'Several worthwhile directions emerge in the same session. What most often helps you find your way?', [
    option('agreed_focus', 'Return to an agreed focus and choose what best serves it.', { structure: -2, therapeuticAim: -1 }),
    option('client_choice', 'Ask which thread the client most wants to follow.', { direction: 2, structure: 1 }, ['shared_inquiry']),
    option('live_thread', 'Follow the thread that seems most alive, even if its significance is not clear yet.', { structure: 2, therapeuticAim: 1 }),
    option('organise_threads', 'Offer a way of organising the threads and check whether it feels useful.', { structure: -1, direction: -2 }, ['offer_perspective'])
  ]),
  question('T12', 'The work feels stuck, although the relationship feels steady. What are you most curious to try next?', [
    option('review_goals', 'Review our goals and identify a small change that would show movement.', { therapeuticAim: -2, structure: -1 }),
    option('understand_stuck', 'Explore more fully what “stuck” means and what remains difficult to understand.', { therapeuticAim: 2, mode: -1 }),
    option('experience_together', 'Attend to how stuckness feels between us, rather than explaining it immediately.', { mode: 2, timeOrientation: -1 }, ['relationship_attention']),
    option('earlier_patterns', 'Look at how this impasse resembles earlier ways of approaching change or relationships.', { timeOrientation: 2, meaningMaking: -1 }, ['provisional_hypothesis'])
  ]),
  question('T13', 'A client brings something unexpected that seems important, just as you are about to use an agreed exercise. What is your usual preference?', [
    option('keep_structure', 'Acknowledge it and check whether keeping today’s agreed exercise would still be useful.', { structure: -2, direction: 1 }),
    option('follow_new', 'Set the exercise aside and follow the new material.', { structure: 2 }),
    option('integrate', 'Adapt the exercise so it helps us examine what has just emerged.', { structure: -1, mode: -1 }, ['practical_experiment']),
    option('feel_significance', 'Pause with the feeling of this new material before choosing a direction.', { structure: 1, mode: 2 })
  ]),
  question('T14', 'Two explanations seem plausible: a familiar clinical formulation and an account centred on the person’s circumstances. Where do you tend to begin?', [
    option('framework_as_map', 'Use the clinical framework provisionally, while looking for what it leaves out.', { meaningMaking: -2 }, ['diagnostic_framework', 'provisional_hypothesis']),
    option('particular_context', 'Stay close to the person’s circumstances and their own account of what is happening.', { meaningMaking: 2, timeOrientation: -1 }, ['contextual_meaning']),
    option('compare_accounts', 'Set both accounts alongside the client’s experience and compare where each fits.', { direction: 2, mode: -1 }, ['shared_inquiry']),
    option('how_it_developed', 'Explore how the pattern developed across their relationships and circumstances.', { timeOrientation: 2 }, ['contextual_meaning'])
  ]),
  question('T15', 'After a worthwhile session, what most often gives you a sense that the work has moved?', [
    option('practical_shift', 'A concrete possibility for doing something differently has emerged.', { therapeuticAim: -2 }),
    option('new_understanding', 'Something previously hard to understand feels more intelligible.', { therapeuticAim: 2, mode: -1 }),
    option('felt_shift', 'The client has encountered a feeling or experience in a new way.', { mode: 2 }),
    option('contact_shift', 'Something between us has become more open, even without a clear next step.', { therapeuticAim: 1, structure: 1 }, ['relationship_attention'])
  ])
];
