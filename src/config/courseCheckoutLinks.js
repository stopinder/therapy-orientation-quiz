export const COURSE_CHECKOUT = {
    key: 'mindworksProgramme',

    title: 'MindWorks Programme',

    description:
        'Full access to the complete MindWorks programme. The material is designed to be moved through gradually, but all course sections become available immediately after purchase.',

    checkoutUrl:
        'https://gpttherapyassist.lemonsqueezy.com/checkout/buy/3d1439e1-bbba-4fc9-8810-04cdda84ca89',
}

export const COURSE_WEEKS = [
    {
        key: 'week1',
        weekNumber: 1,
        title: 'Recognition & Fragmentation',
    },

    {
        key: 'week2',
        weekNumber: 2,
        title: 'Pressure & Avoidance',
    },

    {
        key: 'week3',
        weekNumber: 3,
        title: 'Emotional Interruption',
    },

    {
        key: 'week4',
        weekNumber: 4,
        title: 'Reaction & Compensation',
    },

    {
        key: 'week5',
        weekNumber: 5,
        title: 'Embodied Continuity',
    },

    {
        key: 'week6',
        weekNumber: 6,
        title: 'Integration',
    },
]

export function getCourseCheckoutUrl() {
    return COURSE_CHECKOUT.checkoutUrl
}