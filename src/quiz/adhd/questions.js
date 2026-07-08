export const adhdQuestions = [

    // Section 1 — Where Things Change
    {
        id: "Q1",
        text: "When something starts to matter, what usually happens first?",
        options: [
            { label: "I delay getting started.", value: "delay" },
            { label: "I prepare a little longer.", value: "prepare" },
            { label: "I keep thinking about the best way to begin.", value: "thinking" },
            { label: "I start straight away.", value: "straight_away" },
            { label: "It depends.", value: "it_depends" }
        ],
        investigationIds: {
            delay: "pressure_before_action",
            prepare: "preparation_before_beginning",
            thinking: "preparation_before_beginning"
        }
    },

    {
        id: "Q2",
        text: "When you're interrupted halfway through something important, what usually happens?",
        options: [
            { label: "It's difficult to get going again.", value: "difficult_restart" },
            { label: "I restart from the beginning.", value: "restart_beginning" },
            { label: "I switch to something else.", value: "switch" },
            { label: "I continue without much trouble.", value: "continue" },
            { label: "It depends.", value: "it_depends" }
        ],
        investigationIds: {
            difficult_restart: "interrupted_momentum",
            restart_beginning: "interrupted_momentum",
            switch: "interrupted_momentum"
        }
    },

    {
        id: "Q3",
        text: "When plans suddenly change, what are you most likely to do?",
        options: [
            { label: "Rework everything.", value: "rework" },
            { label: "Pause before deciding.", value: "pause" },
            { label: "Carry on differently.", value: "carry_on" },
            { label: "Wait for more information.", value: "wait" },
            { label: "It depends.", value: "it_depends" }
        ],
        investigationIds: {
            rework: "control_seeking",
            pause: "uncertainty_pause"
        }
    },

    // Section 2 — What Repeats
    {
        id: "Q4",
        text: "Which feels most familiar?",
        options: [
            { label: "Important tasks take longer to begin.", value: "tasks_longer" },
            { label: "Small interruptions become long delays.", value: "interruptions_delays" },
            { label: "Conversations stay in my head afterwards.", value: "conversations_head" },
            { label: "I keep preparing but don't feel ready.", value: "preparing_not_ready" },
            { label: "None of these.", value: "none" }
        ],
        investigationIds: {
            tasks_longer: "pressure_before_action",
            interruptions_delays: "interrupted_momentum",
            conversations_head: "replay_loop",
            preparing_not_ready: "preparation_before_beginning"
        }
    },

    {
        id: "Q5",
        text: "After making a mistake, what usually comes next?",
        options: [
            { label: "I replay it repeatedly.", value: "replay" },
            { label: "I become more careful.", value: "careful" },
            { label: "I fix it immediately.", value: "fix" },
            { label: "I move on.", value: "move_on" },
            { label: "It depends.", value: "it_depends" }
        ],
        investigationIds: {
            replay: "replay_loop",
            careful: "control_seeking"
        }
    },

    {
        id: "Q6",
        text: "When someone misunderstands you, what usually happens?",
        options: [
            { label: "I explain again.", value: "explain" },
            { label: "I withdraw.", value: "withdraw" },
            { label: "I keep thinking about it afterwards.", value: "thinking_afterwards" },
            { label: "I let it go.", value: "let_it_go" },
            { label: "It depends.", value: "it_depends" }
        ],
        investigationIds: {
            withdraw: "replay_loop",
            thinking_afterwards: "replay_loop"
        }
    },

    // Section 3 — Momentum
    {
        id: "Q7",
        text: "When something is going well, what usually changes that?",
        options: [
            { label: "I begin questioning what I'm doing.", value: "questioning" },
            { label: "Something interrupts me.", value: "interruption" },
            { label: "I lose momentum.", value: "lose_momentum" },
            { label: "Another priority appears.", value: "another_priority" },
            { label: "Nothing in particular.", value: "nothing" }
        ],
        investigationIds: {
            questioning: "uncertainty_pause",
            interruption: "interrupted_momentum",
            lose_momentum: "interrupted_momentum",
            another_priority: "external_momentum"
        }
    },

    {
        id: "Q8",
        text: "Near the end of a project, what usually happens?",
        options: [
            { label: "Finishing becomes difficult.", value: "difficult_finishing" },
            { label: "I keep improving details.", value: "improving_details" },
            { label: "I rush to finish.", value: "rush" },
            { label: "I finish normally.", value: "finish" },
            { label: "It depends.", value: "it_depends" }
        ],
        investigationIds: {
            difficult_finishing: "completion_resistance",
            improving_details: "control_seeking",
            rush: "external_momentum"
        }
    },

    {
        id: "Q9",
        text: "Looking back, which feels most familiar?",
        options: [
            { label: "Things become harder once they're important.", value: "harder_important" },
            { label: "I lose momentum more than motivation.", value: "momentum_over_motivation" },
            { label: "I prepare more than I begin.", value: "prepare_over_begin" },
            { label: "Interruptions affect me more than expected.", value: "interruptions_impact" },
            { label: "I'm not sure.", value: "not_sure" }
        ],
        investigationIds: {
            harder_important: "pressure_before_action",
            momentum_over_motivation: "interrupted_momentum",
            prepare_over_begin: "preparation_before_beginning",
            interruptions_impact: "interrupted_momentum"
        }
    }
]