/* =====================================================================
   BEYOND THE NUMBERS — EPISODE DATA
   ---------------------------------------------------------------------
   This file is the single source of truth for every episode.
   The episode cards, topic tiles, filter bar, details modal and the
   bottom audio player are all generated from this list.

   To add audio:  drop "episode-N.mp3" into the /audio folder.
                  Nothing else needs to change. Duration fills in
                  automatically from the MP3's metadata.

   To edit text:  change the strings below. Keep the quotes and commas.

   To use a photo: put the file in /assets (e.g. assets/episode-1.jpg)
                   and change that episode's `image` value.
   ===================================================================== */

/* Topics, in display order. `id` is used for filtering and must match
   each episode's `topic` field. `gradient` names a CSS class (see the
   "Gradient fills" block in css/styles.css). */
window.TOPICS = [
  { id: "daily-life",  label: "Daily Life & Behavior",   icon: "drop",   gradient: "grad-teal"  },
  { id: "tools",       label: "Tools & Devices",         icon: "sensor", gradient: "grad-sky"   },
  { id: "ai",          label: "Artificial Intelligence", icon: "ai",     gradient: "grad-blue"  },
  { id: "privacy",     label: "Privacy & Data",          icon: "shield", gradient: "grad-coral" },
  { id: "access",      label: "Access & Equity",         icon: "people", gradient: "grad-mint"  },
  { id: "connection",  label: "Human Connection",        icon: "heart",  gradient: "grad-rose"  },
  { id: "future",      label: "The Future of Care",      icon: "spark",  gradient: "grad-violet" }
];

window.EPISODES = [
  {
    id: "episode-1",
    number: 1,
    host: "Sa Faumuina",
    title: "A Day with Digital Healthcare: How Digital Tools Impact Behavior",
    topic: "daily-life",
    description:
      "We follow a person living with diabetes through a full day of CGM alerts, app reminders, and data. How does constant feedback change habits, motivation, and stress?",
    longDescription:
      "From the first glucose reading in the morning to the last alert before bed, digital tools are a constant companion for many people managing diabetes. In this episode we walk through a typical day and look closely at how continuous feedback, notifications, and tracking shape daily behavior. When does real-time data build confidence and better habits, and when does it tip into alarm fatigue, anxiety, or burnout? We also ask where family, friends, peer communities, and care teams fit in, because technology works best when a human support system surrounds it.",
    keyQuestions: [
      "How do constant CGM alerts and app notifications affect motivation and stress?",
      "What does 'data burnout' look like, and how can people manage it?",
      "Which habits do digital reminders actually help build?",
      "Where does the human support system fit alongside the technology?"
    ],
    guests: [
      "Person living with Type 1 diabetes",
      "Certified Diabetes Educator",
      "Health psychologist"
    ],
    duration: "—:—",
    source: {
      authors: "Vallis, M., Ryan, H., Berard, L., Cosson, E., Kristensen, F. B., Levrat-Guillen, F., Naiditch, N., Rabasa-Lhoret, R., & Polonsky, W.",
      year: "2023",
      title: "How continuous glucose monitoring can motivate self-management: Can motivation follow behaviour?",
      journal: "Canadian Journal of Diabetes, 47(5), 435–444",
      url: "https://doi.org/10.1016/j.jcjd.2023.04.001"
    },
    audio: "audio/episode-1.m4a",
    image: "assets/episode-1.svg",
    transcript: ""
  },
  {
    id: "episode-2",
    number: 2,
    host: "Makayla Johnson",
    title: "Which Tools Actually Help?",
    topic: "tools",
    description:
      "CGMs, insulin pumps, and mobile health apps compared side by side. We look at which features make a real difference and how today's apps could work better together.",
    longDescription:
      "There is no shortage of diabetes technology, but which tools genuinely make life easier? This episode compares continuous glucose monitors, insulin pumps, and mobile health apps, focusing on the features people say matter most: meal planning, nutrition tracking, medication reminders, and sharing data directly with care teams. We discuss what gets in the way, including devices that don't talk to each other, cluttered interfaces, and the extra work of logging, and share ideas for how existing apps could improve or integrate better.",
    keyQuestions: [
      "What practical differences do CGMs and insulin pumps make day to day?",
      "Which app features (meal planning, nutrition tracking, reminders) are most useful?",
      "How valuable is sharing data directly with a care team?",
      "How could existing apps improve or integrate more smoothly?"
    ],
    guests: [
      "Endocrinologist",
      "Certified Diabetes Educator",
      "Person living with Type 2 diabetes"
    ],
    duration: "—:—",
    source: {
      authors: "Ebekozien, O., Fantasia, K., Farrokhi, F., Sabharwal, A., & Kerr, D.",
      year: "2024",
      title: "Technology and health inequities in diabetes care: How do we widen access to underserved populations and utilize technology to improve outcomes for all?",
      journal: "Diabetes, Obesity and Metabolism, 26(Suppl. 1), 3–13",
      url: "https://doi.org/10.1111/dom.15470"
    },
    audio: "audio/episode-2.mp3",
    image: "assets/episode-2.svg",
    transcript: ""
  },
  {
    id: "episode-3",
    number: 3,
    host: "Kelsey Harper",
    title: "How Is AI Currently Being Used for Diabetes Management?",
    topic: "ai",
    description:
      "Predictive glucose alerts, automated insulin delivery, and AI-driven insights: what's working today? We weigh the real benefits against the limits, and explain why AI should support clinical judgment, not replace it.",
    longDescription:
      "Artificial intelligence already plays a role in diabetes care, from predictive glucose alerts to automated insulin delivery systems and apps that surface patterns in personal data. In this episode we separate real, present-day benefits from hype. We examine the limits too: bias in training data that may not represent every population, a lack of integration with clinical workflows, and a regulatory landscape that is still evolving. Throughout, we return to one principle: AI should support, not replace, the judgment of clinicians and the lived expertise of patients.",
    keyQuestions: [
      "Where is AI already used in diabetes care today?",
      "What are the real benefits of predictive alerts and automated insulin delivery?",
      "How can bias in training data affect different patient groups?",
      "Why should AI support rather than replace clinical judgment?"
    ],
    guests: [
      "Endocrinologist",
      "Health informatics researcher",
      "Person using an automated insulin delivery system"
    ],
    duration: "—:—",
    source: {
      authors: "Guan, Z., Li, H., Liu, R., Cai, C., Liu, Y., Li, J., Wang, X., Huang, S., Wu, L., Liu, D., Yu, S., Wang, Z., Shu, J., Hou, X., Yang, X., Jia, W., & Sheng, B.",
      year: "2023",
      title: "Artificial intelligence in diabetes management: Advancements, opportunities, and challenges",
      journal: "Cell Reports Medicine, 4(10), Article 101213",
      url: "https://search.lib.asu.edu/permalink/01ASU_INST/1da5cgk/cdi_webofscience_primary_001102136800001"
    },
    audio: "audio/episode-3.mp3",
    image: "assets/episode-3.svg",
    transcript: ""
  },
  {
    id: "episode-4",
    number: 4,
    host: "Eliza Pierre",
    title: "Who Sees My Health Data?",
    topic: "privacy",
    description:
      "What do health apps and devices collect, who can access it, and how might it be shared or sold? We cover the ethics, consent, and practical steps for protecting your data.",
    longDescription:
      "Every glucose reading, meal log, and dose record creates personal health information. This episode looks at what diabetes apps and devices collect, who can see that data, and how it may be shared with third parties or sold. We explore the ethical questions around patient consent, the gaps between what privacy policies say and what users understand, and how protections differ depending on who holds the data. We close with practical tips listeners can use to review permissions and protect their information.",
    keyQuestions: [
      "What personal health information do apps and devices collect?",
      "Who can access that data, and how might it be shared or sold?",
      "What does meaningful patient consent look like?",
      "What practical steps can people take to protect their data?"
    ],
    guests: [
      "Health privacy and ethics specialist",
      "Clinical nurse",
      "Person living with Type 1 diabetes"
    ],
    duration: "—:—",
    source: {
      authors: "Lee, Y.-B., Kim, G., Jun, J. E., Park, H., Lee, W. J., Hwang, Y.-C., & Kim, J. H.",
      year: "2023",
      title: "An integrated digital health care platform for diabetes management with AI-based dietary management: 48-week results from a randomized controlled trial",
      journal: "Diabetes Care, 46(5), 959–966",
      url: "https://doi.org/10.2337/dc22-1929"
    },
    audio: "audio/episode-4.mp3",
    image: "assets/episode-4.svg",
    transcript: ""
  },
  {
    id: "episode-5",
    number: 5,
    host: "Umme Rooman",
    title: "Who Gets Left Out?",
    topic: "access",
    description:
      "Seniors, people with limited internet access, low-income or underinsured patients, and people whose languages aren't supported can all be left behind. How do we keep affordability and accessibility at the forefront as AI advances?",
    longDescription:
      "Digital health promises better care, but not everyone gets the same access. This episode focuses on the people most likely to be left out: older adults, people with limited or no internet access, low-income and underinsured patients, and people whose languages are not supported by apps and devices. We discuss cost, usability, and digital literacy barriers, and ask how designers, clinicians, and policymakers can keep affordability and accessibility at the forefront as AI advances. We also point listeners toward resources that can help.",
    keyQuestions: [
      "Which groups are most at risk of being left behind by digital health tools?",
      "How do cost, connectivity, and language create barriers?",
      "How can affordability and accessibility stay central as AI advances?",
      "What resources are available to help close the gap?"
    ],
    guests: [
      "Community health worker",
      "Certified Diabetes Educator",
      "Older adult managing Type 2 diabetes"
    ],
    duration: "—:—",
    source: {
      authors: "Figueroa, C. A., Luo, T., Aguilera, A., & Lyles, C. R.",
      year: "2021",
      title: "The need for feminist intersectionality in digital health",
      journal: "The Lancet Digital Health, 3(8), e526–e533",
      url: "https://doi.org/10.1016/S2589-7500(21)00118-7"
    },
    audio: "audio/episode-5.mp3",
    image: "assets/episode-5.svg",
    transcript: ""
  },
  {
    id: "episode-6",
    number: 6,
    host: "Heather Christensen",
    title: "Keeping Care Human: Connection in a Digital World",
    topic: "connection",
    description:
      "Telehealth visits, patient portals, and remote monitoring change how patients and care teams connect. How do we keep empathy, trust, and real conversation at the heart of care?",
    longDescription:
      "Digital tools can bring care teams closer: a quick portal message, a shared glucose report, or a video visit from home. They can also make care feel distant, rushed, or automated. In this episode we explore how technology is reshaping the relationship between people living with diabetes and the clinicians, educators, and loved ones who support them. We talk about what makes a digital interaction feel caring, how to avoid feeling like 'just a number', and why listening and trust still matter most.",
    keyQuestions: [
      "How do telehealth and remote monitoring change the patient–clinician relationship?",
      "What makes a digital interaction feel caring rather than automated?",
      "How can families and peer communities use technology to offer support?",
      "How do we make sure people never feel like 'just a number'?"
    ],
    guests: [
      "Primary care physician",
      "Certified Diabetes Educator",
      "Caregiver of a person with diabetes"
    ],
    duration: "—:—",
    source: {
      authors: "Chundamala, P. J.",
      year: "2026",
      title: "Connecting through credibility: Health care workers' trust towards health care apps",
      journal: "Genetics and Molecular Research, 25(8S), Article 40",
      url: "https://doi.org/10.4238/w95anz40"
    },
    audio: "audio/episode-6.mp3",
    image: "assets/episode-6.svg",
    transcript: ""
  },
  {
    id: "episode-7",
    number: 7,
    host: "Sarah Cote",
    title: "What Comes Next? The Future of Diabetes Care",
    topic: "future",
    description:
      "Smarter sensors, connected insulin pens, and AI health coaches are on the horizon. We look ahead with hope and caution, and ask what a more human future of diabetes care could look like.",
    longDescription:
      "To close the series, we look toward the future. Researchers and companies are working on smarter sensors, connected insulin pens, more automated insulin delivery, and AI tools that coach and personalize care. In this episode we separate realistic near-term changes from long-term possibilities, and we revisit the themes of the whole series: behavior, usefulness, AI, privacy, equity, and human connection. What should patients, clinicians, designers, and policymakers do now so that tomorrow's tools are safe, fair, and genuinely helpful?",
    keyQuestions: [
      "Which emerging diabetes technologies are closest to everyday use?",
      "How might AI coaching and personalization change self-management?",
      "What safeguards are needed as care becomes more automated?",
      "What would a truly human-centered future of diabetes care look like?"
    ],
    guests: [
      "Biomedical engineering researcher",
      "Endocrinologist",
      "Person living with Type 1 diabetes"
    ],
    duration: "—:—",
    source: {
      authors: "Adnan, A., Irvine, R. E., Williams, A., Harris, M., & Antonacci, G.",
      year: "2025",
      title: "Improving acceptability of mHealth apps—The use of the Technology Acceptance Model to assess the acceptability of mHealth apps: Systematic review",
      journal: "Journal of Medical Internet Research, 27, e66432",
      url: "https://doi.org/10.2196/66432"
    },
    audio: "audio/episode-7.mp3",
    image: "assets/episode-7.svg",
    transcript: ""
  }
];
