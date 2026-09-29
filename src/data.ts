export const driveIds = [
  "yellow",
  "green",
  "orange",
  "blue",
  "red",
  "purple",
] as const;
export type DriveId = (typeof driveIds)[number];
export type Section = "motivation" | "frustration";
export interface Drive {
  name: string;
  color: string;
  description: string;
  strength: string;
  blindSpot: string;
  tip: string;
  friction: string;
}
export const drives: Record<DriveId, Drive> = {
  yellow: {
    name: "Understanding",
    color: "#c59c2c",
    description:
      "Making sense of complexity, exploring ideas, and seeing possibilities.",
    strength:
      "You may bring curiosity and fresh perspectives to complex problems.",
    blindSpot: "Exploring every possibility can delay a useful first step.",
    tip: "Share the reasoning behind your ideas, then agree on a time to decide.",
    friction:
      "Decisions without explanation or room for inquiry may be draining. Ask for the reasoning and name the questions that matter most.",
  },
  green: {
    name: "People",
    color: "#548568",
    description: "Connection, inclusion, and working well with others.",
    strength:
      "You may notice how decisions affect people and help others feel heard.",
    blindSpot:
      "Seeking agreement can make difficult conversations take longer.",
    tip: "Make room for different views while being clear about your own needs.",
    friction:
      "Dismissive or exclusionary behaviour may be draining. Make space for affected people to speak and agree how concerns will be heard.",
  },
  orange: {
    name: "Achievement",
    color: "#d28646",
    description: "Progress, meaningful goals, and visible results.",
    strength: "You may turn ambition into momentum and keep outcomes in sight.",
    blindSpot:
      "A strong focus on outcomes can overshadow learning or recovery.",
    tip: "Agree what success means and recognise the contributions behind it.",
    friction:
      "Lack of progress or recognition may be draining. Clarify the desired outcome and make contributions visible without turning everything into a competition.",
  },
  blue: {
    name: "Structure",
    color: "#5f87aa",
    description: "Clarity, reliability, and doing things with care.",
    strength:
      "You may create dependable plans and follow through on agreements.",
    blindSpot: "Sticking closely to a plan can make adaptation harder.",
    tip: "Clarify responsibilities and distinguish essential standards from flexible methods.",
    friction:
      "Unclear agreements or unreliable follow-through may be draining. Ask for explicit responsibilities and a shared definition of done.",
  },
  red: {
    name: "Decisiveness",
    color: "#b86157",
    description: "Taking action, speaking directly, and facing challenges.",
    strength: "You may bring courage and clarity when action is needed.",
    blindSpot:
      "Moving quickly can leave others without enough time to contribute.",
    tip: "Explain your intent, invite a challenge, and then make the next step clear.",
    friction:
      "Avoidance or prolonged indecision may be draining. Identify who can decide and propose a concrete next step while allowing relevant concerns to surface.",
  },
  purple: {
    name: "Belonging",
    color: "#92769f",
    description: "Shared identity, continuity, and a trusted foundation.",
    strength:
      "You may preserve valuable traditions and build loyalty over time.",
    blindSpot:
      "Protecting familiar ways can make new perspectives harder to welcome.",
    tip: "Explain what is worth preserving while welcoming new people and approaches.",
    friction:
      "Disregard for trust or shared history may be draining. Explain what the team values and discuss how to preserve it through change.",
  },
};
export interface Question {
  id: string;
  section: Section;
  topic: string;
  prompt: string;
  responses: { id: string; drive: DriveId; text: string }[];
}
const situations: [Section, string, string, string[]][] = [
  [
    "motivation",
    "Decisions",
    "When an important decision needs to be made, I feel most engaged when we…",
    [
      "Explore the underlying problem and consider different possibilities.",
      "Give everyone affected a chance to be heard.",
      "Choose the option that moves us closest to an ambitious goal.",
      "Use clear criteria and check the relevant details.",
      "Make a firm choice and take action.",
      "Build on our shared experience and what we trust.",
    ],
  ],
  [
    "motivation",
    "Collaboration",
    "I do my best work with a team that…",
    [
      "Exchanges ideas and challenges assumptions.",
      "Supports one another and makes space for different voices.",
      "Sets stretching goals and celebrates progress.",
      "Makes clear agreements and follows through.",
      "Speaks directly and tackles obstacles head-on.",
      "Creates a strong sense of loyalty and shared identity.",
    ],
  ],
  [
    "motivation",
    "Change",
    "A change at work energises me when it…",
    [
      "Opens up new possibilities to investigate.",
      "Improves how people connect and work together.",
      "Creates a chance to achieve better results.",
      "Comes with a thoughtful plan and clear responsibilities.",
      "Gives us the momentum to break through a blockage.",
      "Protects what matters to us while building on our history.",
    ],
  ],
  [
    "motivation",
    "Delivery",
    "When working on a project, I get satisfaction from…",
    [
      "Understanding a difficult challenge in a new way.",
      "Helping colleagues contribute and succeed together.",
      "Reaching a meaningful milestone and seeing the impact.",
      "Delivering careful work that meets our commitments.",
      "Taking ownership and getting things moving.",
      "Contributing to something our team can be proud to belong to.",
    ],
  ],
  [
    "motivation",
    "Conflict",
    "During a disagreement, I am motivated to…",
    [
      "Find the assumptions behind the different viewpoints.",
      "Help people feel understood and reconnect.",
      "Find a solution that keeps the important goal within reach.",
      "Establish the facts and agree a fair process.",
      "Address the issue directly and settle the next action.",
      "Restore trust and honour our shared commitments.",
    ],
  ],
  [
    "motivation",
    "Leadership",
    "A leader brings out my best when they…",
    [
      "Give me space to question, learn, and develop ideas.",
      "Show care and invite people into the conversation.",
      "Set an inspiring target and recognise contributions.",
      "Make expectations clear and act consistently.",
      "Show courage and make timely decisions.",
      "Build trust and respect the identity of the group.",
    ],
  ],
  [
    "frustration",
    "Decisions",
    "When decisions are being made, I find it draining when…",
    [
      "Questions are dismissed and reasoning is not explained.",
      "People affected are excluded from the discussion.",
      "We lose sight of the outcome we are trying to achieve.",
      "Criteria shift and nobody records what was agreed.",
      "A decision is repeatedly postponed without a clear reason.",
      "Established trust and shared experience are disregarded.",
    ],
  ],
  [
    "frustration",
    "Collaboration",
    "Working with others becomes frustrating when…",
    [
      "There is no room to explore a different perspective.",
      "People dismiss one another’s needs or contributions.",
      "Effort goes unnoticed and the team makes little progress.",
      "Commitments are forgotten and responsibilities stay unclear.",
      "People avoid saying what they mean or taking ownership.",
      "Loyalty is taken for granted and newcomers are given no sense of our history.",
    ],
  ],
  [
    "frustration",
    "Change",
    "I find a change at work difficult when…",
    [
      "We are told to comply without understanding why.",
      "Its effect on people receives little attention.",
      "It consumes effort without a clear benefit.",
      "It is introduced without preparation or practical guidance.",
      "We keep discussing it but never take a first step.",
      "It discards valued practices without understanding their purpose.",
    ],
  ],
  [
    "frustration",
    "Delivery",
    "On a project, my energy drops when…",
    [
      "There is no time to understand recurring problems.",
      "Competition undermines mutual support.",
      "Activity continues but meaningful results do not follow.",
      "Careless handovers create avoidable errors.",
      "Obstacles remain because nobody will confront them.",
      "People break trust with the team to pursue their own interests.",
    ],
  ],
  [
    "frustration",
    "Conflict",
    "In a disagreement, I find it especially frustrating when…",
    [
      "People refuse to examine their assumptions.",
      "Personal attacks replace listening and respect.",
      "The argument prevents us from achieving anything useful.",
      "Facts and prior agreements are ignored.",
      "Everyone sidesteps the issue and it remains unresolved.",
      "Long-standing relationships are treated as disposable.",
    ],
  ],
  [
    "frustration",
    "Leadership",
    "A leader makes it harder for me to contribute when they…",
    [
      "Discourage questions and independent thought.",
      "Show little interest in how people are doing.",
      "Provide no direction or recognition for progress.",
      "Apply expectations inconsistently and break agreements.",
      "Avoid difficult decisions and leave problems unattended.",
      "Undermine the team’s trust and sense of belonging.",
    ],
  ],
];
export const questions: Question[] = situations.map(
  ([section, topic, prompt, texts], i) => {
    const responses = texts.map((text, j) => ({
      id: `${i + 1}-${driveIds[j]}`,
      drive: driveIds[j],
      text,
    }));
    const offset = i % 6;
    return {
      id: `q${i + 1}`,
      section,
      topic,
      prompt,
      responses: [...responses.slice(offset), ...responses.slice(0, offset)],
    };
  },
);
