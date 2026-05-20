<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 pt-10 pb-16">
    <div class="max-w-3xl mx-auto px-6 pt-6 pb-20 space-y-8">

      <!-- HERO -->
      <section class="space-y-4">
        <p class="text-sm uppercase tracking-[0.22em] text-slate-500">
          MindWorks
        </p>

        <h1 class="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
          A structured reflection on attention, emotional load, and the hidden patterns behind inconsistency.
        </h1>

        <p class="text-lg leading-relaxed text-slate-700 max-w-2xl">
          MindWorks helps you recognise how attention fragments, how momentum gets interrupted,
          and how protective patterns shape everyday functioning.
        </p>

        <p class="text-lg leading-relaxed text-slate-700 max-w-2xl">
          It begins with a free reflection tool and leads into a guided programme of psychological
          reflection, body sensing, and practical self-observation.
        </p>

        <div class="pt-3 flex flex-wrap gap-3">
          <router-link
              to="/adhd-quiz"
              class="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700 transition"
          >
            Begin the free reflection
          </router-link>

          <router-link
              to="/programme"
              class="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition"
          >
            View the guided programme
          </router-link>
        </div>
      </section>

      <!-- WHAT THIS IS -->
      <section class="space-y-3 max-w-2xl">
        <h2 class="section-heading">
          What this is
        </h2>

        <p>
          MindWorks is a psychologically informed reflection tool for people who recognise patterns
          of interrupted focus, emotional avoidance, inconsistent follow-through, overwhelm, and inner
          contradiction.
        </p>

        <p>
          It does not diagnose you or reduce your experience to a label. It helps you see recurring
          patterns with more precision, especially where effort, intention, emotion, and avoidance
          become tangled.
        </p>

        <p>
          The paid programme extends this reflection into weekly exercises based on embodied attention,
          self-observation, and preparation before deeper psychological work.
        </p>
      </section>

      <!-- WHY THIS EXISTS -->
      <section class="space-y-3 max-w-2xl">
        <h2 class="section-heading">
          Why this exists
        </h2>

        <p>
          Many people do not simply struggle with attention. They struggle with continuity.
        </p>

        <p>
          They begin with clarity, lose contact with themselves, drift into automatic behaviour,
          react emotionally, then return later with frustration or self-criticism.
        </p>

        <p>
          MindWorks exists for that space: the gap between intention and follow-through,
          between insight and actual lived continuity.
        </p>
      </section>

      <!-- APPROACH -->
      <section class="space-y-3 max-w-2xl">
        <h2 class="section-heading">
          The approach
        </h2>

        <p>
          The work is informed by Internal Family Systems, embodied attention practices,
          interpersonal nursing theory, trauma-informed reflection, and clinical experience.
        </p>

        <p>
          It draws particularly on preparation, body sensing, and the observation of automaticity:
          learning to notice when awareness disappears, when emotion takes over, and when protective
          patterns organise behaviour.
        </p>

        <p>
          The aim is not to perform therapy on yourself. It is to develop a clearer relationship
          with your own functioning before conclusions are made.
        </p>
      </section>

      <!-- WHY CLARITY MATTERS -->
      <section class="space-y-3 max-w-2xl">
        <h2 class="section-heading">
          Why clarity matters
        </h2>

        <p>
          When patterns are poorly understood, they often feel like personal failure.
        </p>

        <p>
          When they are seen more clearly, they can be approached with less shame and more accuracy.
          Not fixed. Not explained away. Simply seen with more honesty.
        </p>

        <p>
          For many people, that shift is already significant: the movement from vague self-blame
          to precise recognition.
        </p>
      </section>

      <!-- WHO THIS IS FOR -->
      <section class="space-y-3 max-w-2xl">
        <h2 class="section-heading">
          Who this is for
        </h2>

        <ul class="space-y-2 list-disc pl-5 text-slate-700">
          <li>You recognise recurring inconsistency rather than occasional bad days</li>
          <li>You often understand yourself afterwards, but lose contact in the moment</li>
          <li>You want something more grounded than social media explanations</li>
          <li>You are curious about attention, avoidance, and emotional load without needing a label</li>
          <li>You want reflective structure rather than productivity advice</li>
        </ul>

        <p>
          Uncertainty is a legitimate place to begin.
        </p>
      </section>

      <!-- PROGRAMME PREVIEW -->
      <section class="space-y-4 max-w-2xl rounded-2xl bg-white/75 border border-slate-200 px-6 py-6 shadow-sm">
        <h2 class="section-heading mt-0">
          The guided programme
        </h2>

        <p>
          The paid programme is built around weekly reflection and embodied attention practice.
          Each week focuses on one layer of the pattern.
        </p>

        <div class="grid gap-3 text-sm text-slate-700">
          <div class="programme-row">
            <span>Week 1</span>
            <p>Recognising automaticity and interrupted awareness</p>
          </div>

          <div class="programme-row">
            <span>Week 2</span>
            <p>Attention, fragmentation, and internal contradiction</p>
          </div>

          <div class="programme-row">
            <span>Week 3</span>
            <p>Protective patterns and emotional avoidance</p>
          </div>

          <div class="programme-row">
            <span>Week 4</span>
            <p>Relational pressure and loss of self-contact</p>
          </div>

          <div class="programme-row">
            <span>Week 5</span>
            <p>Body sensing, regulation, and grounded presence</p>
          </div>

          <div class="programme-row">
            <span>Week 6</span>
            <p>Continuity, integration, and ordinary-life practice</p>
          </div>
        </div>

        <router-link
            to="/programme"
            class="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700 transition"
        >
          Explore the programme
        </router-link>
      </section>

      <!-- WHO BUILT THIS -->
      <section class="space-y-3 max-w-2xl bg-slate-100/80 rounded-2xl px-6 py-6 border border-slate-200">
        <h2 class="section-heading mt-0">
          Who built this
        </h2>

        <p>
          MindWorks was developed by <strong>Robert Ormiston</strong>,
          a UK-trained psychotherapist and registered mental health nurse.
        </p>

        <p>
          His work brings together clinical mental health experience, Internal Family Systems,
          embodied attention practice, interpersonal nursing theory, and long-term study of
          Fourth Way self-observation.
        </p>

        <p>
          The emphasis is practical: how people function, lose contact, protect themselves,
          and return to awareness in ordinary life.
        </p>
      </section>

      <!-- FAQ -->
      <section class="space-y-3 max-w-2xl pt-2">
        <h2 class="section-heading">
          Frequently asked questions
        </h2>

        <details class="faq-item">
          <summary>
            Is this a diagnostic assessment?
          </summary>
          <p>
            No. MindWorks is deliberately non-diagnostic. It offers psychological reflection,
            not assessment or clinical conclusions.
          </p>
        </details>

        <details class="faq-item">
          <summary>
            What will I receive from the free reflection?
          </summary>
          <p>
            You will receive a written reflection based on your responses, describing patterns,
            trade-offs, emotional load, and areas of interrupted functioning.
          </p>
        </details>

        <details class="faq-item">
          <summary>
            What is the paid programme?
          </summary>
          <p>
            A structured six-week reflective programme with short lessons, body sensing exercises,
            written prompts, and ordinary-life integration tasks.
          </p>
        </details>

        <details class="faq-item">
          <summary>
            Is this therapy?
          </summary>
          <p>
            No. It is a guided reflection and self-observation programme. It may support personal
            insight, but it is not a substitute for therapy, diagnosis, or medical care.
          </p>
        </details>
      </section>

      <!-- TESTIMONIALS -->
      <section class="space-y-3 max-w-3xl pt-2">
        <h2 class="section-heading">
          What people say
        </h2>

        <div class="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          <div class="testimonial-card">
            <p>
              “Grounded, calm, and genuinely useful.”
            </p>
            <span>— User feedback</span>
          </div>

          <div class="testimonial-card">
            <p>
              “Helped me see patterns without being told what to think.”
            </p>
            <span>— User feedback</span>
          </div>

          <div class="testimonial-card">
            <p>
              “Serious, adult, and not hype-driven.”
            </p>
            <span>— User feedback</span>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="mt-16 border-t border-slate-200 pt-10 text-sm text-slate-600">
        <div class="space-y-8">

          <div class="space-y-1">
            <p class="font-medium text-slate-800">MindWorks</p>
            <p>A non-diagnostic psychological reflection tool and guided programme.</p>
            <p>Affiliated with Chrysalis Therapy Services.</p>
          </div>

          <div class="space-y-1">
            <p class="font-medium text-slate-700">Professional standing</p>
            <ul class="space-y-0.5">
              <li>
                <a
                    href="https://www.bacp.co.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link"
                >
                  British Association for Counselling and Psychotherapy (MBACP)
                </a>
              </li>
              <li>
                <a
                    href="https://www.nmc.org.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link"
                >
                  UK Nursing and Midwifery Council (NMC)
                </a>
              </li>
            </ul>
          </div>

          <div class="space-y-1">
            <p class="font-medium text-slate-700">Scope &amp; limits</p>
            <p class="leading-relaxed">
              MindWorks provides non-diagnostic psychological reflection for self-understanding only.
              It does not provide emergency support, diagnosis, treatment, or medical advice.
            </p>

            <nav class="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              <router-link to="/terms" class="footer-link">
                Terms of Use
              </router-link>
              <router-link to="/privacy" class="footer-link">
                Privacy Policy
              </router-link>
            </nav>
          </div>

          <div class="space-y-1">
            <p class="font-medium text-slate-700">Contact &amp; transparency</p>
            <nav class="flex flex-wrap gap-x-4 gap-y-1">
              <router-link to="/contact" class="footer-link">
                Contact / Feedback
              </router-link>
              <a
                  href="https://robormiston.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-link"
              >
                robormiston.com
              </a>
            </nav>
          </div>

        </div>
      </footer>

    </div>
  </main>
</template>

<script setup>
// About page — static content only
</script>

<style scoped>
.section-heading {
  @apply text-xl font-semibold relative inline-block mt-6 text-slate-900;
}

.section-heading::after {
  content: "";
  @apply absolute left-0 -bottom-1 h-px w-8 bg-slate-300;
}

.programme-row {
  @apply rounded-xl border border-slate-200 bg-stone-50/80 px-4 py-3;
}

.programme-row span {
  @apply block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500;
}

.programme-row p {
  @apply mt-1 text-slate-700;
}

.faq-item {
  @apply border-b border-slate-200 py-3;
}

.faq-item summary {
  @apply cursor-pointer font-medium text-slate-700;
}

.faq-item p {
  @apply mt-2 text-slate-600 leading-relaxed;
}

.testimonial-card {
  @apply min-w-[220px] bg-white/80 rounded-xl p-4 shadow-sm border border-slate-200;
}

.testimonial-card p {
  @apply text-slate-700 text-sm leading-relaxed;
}

.testimonial-card span {
  @apply mt-2 block text-xs text-slate-500;
}

.footer-link {
  @apply underline hover:text-slate-800;
}
</style>