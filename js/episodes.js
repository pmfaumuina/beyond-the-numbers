/* =====================================================================
   THE HUMAN PULSE — EPISODE DATA
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
  { id: "access",      label: "Access & Equity",         icon: "people", gradient: "grad-mint"  }
];

window.EPISODES = [
  {
    id: "episode-1",
    number: 1,
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
    audio: "audio/episode-1.m4a",
    image: "assets/episode-1.svg",
    transcript: ""
  },
  {
    id: "episode-2",
    number: 2,
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
    audio: "audio/episode-2.mp3",
    image: "assets/episode-2.svg",
    transcript: ""
  },
  {
    id: "episode-3",
    number: 3,
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
    audio: "audio/episode-3.mp3",
    image: "assets/episode-3.svg",
    transcript: ""
  },
  {
    id: "episode-4",
    number: 4,
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
    audio: "audio/episode-4.mp3",
    image: "assets/episode-4.svg",
    transcript: ""
  },
  {
    id: "episode-5",
    number: 5,
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
    audio: "audio/episode-5.mp3",
    image: "assets/episode-5.svg",
    transcript: ""
  }
];
