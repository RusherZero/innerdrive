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

export type AssessmentId = "workplace" | "personal";
export type EnergySituation = "busy" | "change" | "social";
export interface PersonalGuidance {
  routine: string;
  situations: Record<EnergySituation, string>;
}
export interface Assessment {
  id: AssessmentId;
  label: string;
  storageKey: string;
  questions: Question[];
  drives: Record<DriveId, Drive>;
  lead: string;
  context: string;
  resultsLead: string;
  guidance?: Record<DriveId, PersonalGuidance>;
}

const personalSituations: [Section, string, string, string[]][] = [
  [
    "motivation",
    "Daily routines",
    "An everyday routine feels good to me when it leaves room to…",
    [
      "Learn something or explore an idea that interests me.",
      "Connect with someone and exchange a little care.",
      "Notice progress on something that matters to me.",
      "Follow a dependable rhythm with clear next steps.",
      "Choose what needs doing and get started.",
      "Return to familiar rituals that help me feel at home.",
    ],
  ],
  [
    "motivation",
    "Free time",
    "When I have some time to myself, I am drawn to…",
    [
      "Follow my curiosity without needing a particular outcome.",
      "Spend time connecting with people I enjoy.",
      "Develop a skill or move a personal project forward.",
      "Make space for an activity I have planned and prepared for.",
      "Pick something that appeals to me and jump into it.",
      "Enjoy a familiar place, pastime, or tradition.",
    ],
  ],
  [
    "motivation",
    "Relationships",
    "Time with other people energises me when we…",
    [
      "Share ideas and discover different ways of seeing things.",
      "Listen with care and make room for each other's feelings.",
      "Encourage each other's hopes and recognise progress.",
      "Make clear plans and keep our agreements.",
      "Say what we mean and feel free to make choices.",
      "Build trust through shared memories and familiar rituals.",
    ],
  ],
  [
    "motivation",
    "Personal goals",
    "A personal goal draws me in when it…",
    [
      "Gives me something interesting to understand or explore.",
      "Helps me care for people or strengthen a connection.",
      "Offers a meaningful challenge with visible progress.",
      "Can be approached through manageable, reliable steps.",
      "Lets me take ownership and make a tangible change.",
      "Connects with my roots or something I want to preserve.",
    ],
  ],
  [
    "motivation",
    "Changing plans",
    "When my plans change, I find energy in…",
    [
      "Discovering possibilities I had not considered.",
      "Talking it through with someone who listens.",
      "Finding another way to move towards what matters to me.",
      "Putting a workable new plan in place.",
      "Making a choice about what I can do next.",
      "Keeping a familiar anchor while other things shift.",
    ],
  ],
  [
    "motivation",
    "Everyday demands",
    "When there is a lot to take care of, it helps me to…",
    [
      "Understand what is creating the demands and rethink my approach.",
      "Share how things feel and give or receive support.",
      "Focus on one meaningful outcome and notice small wins.",
      "Organise what needs doing into a clear sequence.",
      "Set a boundary and take action on what I can influence.",
      "Lean on trusted habits and people who know me well.",
    ],
  ],
  [
    "frustration",
    "Daily routines",
    "My everyday routine drains me when…",
    [
      "There is no room for curiosity or a different approach.",
      "There is little space for meaningful connection.",
      "My effort feels disconnected from anything that matters to me.",
      "Basic tasks stay unpredictable and I keep having to reorganise.",
      "I have little say over my time or my next step.",
      "I cannot make room for familiar things that ground me.",
    ],
  ],
  [
    "frustration",
    "Free time",
    "Free time leaves me less refreshed when…",
    [
      "I cannot follow an interest or explore something in depth.",
      "I want connection but feel unheard or left out.",
      "Something I hoped to make progress on keeps going nowhere.",
      "Unclear arrangements make it hard to settle into an activity.",
      "I spend the time waiting for someone else to decide.",
      "Familiar places or pastimes that matter to me are dismissed.",
    ],
  ],
  [
    "frustration",
    "Relationships",
    "In my relationships, I find it draining when…",
    [
      "Questions or different perspectives are brushed aside.",
      "Feelings are dismissed and listening gives way to judgement.",
      "Things I am working towards are belittled or ignored.",
      "Agreements are vague or repeatedly forgotten.",
      "People avoid saying what they mean or disregard my boundaries.",
      "Shared history and trust are treated as unimportant.",
    ],
  ],
  [
    "frustration",
    "Personal goals",
    "Working towards something personal becomes frustrating when…",
    [
      "I follow steps without understanding their purpose.",
      "Pursuing it leaves no room for the people I care about.",
      "I put in effort but cannot see meaningful progress.",
      "The next steps stay unclear or keep shifting.",
      "I feel unable to make decisions or get past a blockage.",
      "It feels disconnected from my values and sense of belonging.",
    ],
  ],
  [
    "frustration",
    "Changing plans",
    "An unexpected change is especially draining when…",
    [
      "I cannot understand why it is happening or explore alternatives.",
      "Its effect on people's feelings receives little care.",
      "It interrupts something important without a clear benefit.",
      "I have no practical information to organise around.",
      "I cannot influence anything and no next step is decided.",
      "It removes familiar anchors without recognising their meaning.",
    ],
  ],
  [
    "frustration",
    "Everyday demands",
    "When life gets busy, my energy drops most when…",
    [
      "I have to keep reacting without time to think.",
      "I feel alone with the demands and unable to ask for support.",
      "Urgent tasks crowd out everything that feels worthwhile.",
      "Loose ends and unreliable arrangements pile up.",
      "I cannot protect my time or act on problems within my reach.",
      "The habits and connections that ground me get pushed aside.",
    ],
  ],
];
export const personalQuestions: Question[] = personalSituations.map(
  ([section, topic, prompt, texts], i) => {
    const responses = texts.map((text, j) => ({
      id: `personal-${i + 1}-${driveIds[j]}`,
      drive: driveIds[j],
      text,
    }));
    const offset = i % driveIds.length;
    return {
      id: `personal-q${i + 1}`,
      section,
      topic,
      prompt,
      responses: [...responses.slice(offset), ...responses.slice(0, offset)],
    };
  },
);

const personalDrives: Record<DriveId, Drive> = {
  yellow: {
    ...drives.yellow,
    description:
      "Curiosity, understanding yourself, and exploring possibilities.",
    strength:
      "You may find fresh perspectives and make thoughtful choices about how you live.",
    blindSpot:
      "Looking for the perfect explanation can keep an idea from becoming a useful habit.",
    tip: "Share what you are curious about and make room for another perspective.",
    friction:
      "Little time to think or explore may feel draining. Try making a small space for one question that matters to you.",
  },
  green: {
    ...drives.green,
    description: "Care, mutual support, and meaningful connection.",
    strength:
      "You may notice emotional needs and create moments where people feel heard.",
    blindSpot:
      "Being available to everyone can leave too little space for your own needs.",
    tip: "Say what kind of connection you would enjoy, and check what the other person has room for.",
    friction:
      "Feeling unheard or unsupported may drain you. Try naming one specific kind of support you would welcome.",
  },
  orange: {
    ...drives.orange,
    description: "Meaningful personal goals and a sense of progress.",
    strength:
      "You may turn things you care about into achievable steps and recognise growth.",
    blindSpot:
      "Measuring every moment by its results can make free time feel like another task.",
    tip: "Share a small win with someone who supports you, without needing to compare progress.",
    friction:
      "Effort without visible progress may drain you. Try shrinking a goal until the next step feels worthwhile and possible.",
  },
  blue: {
    ...drives.blue,
    description:
      "A dependable rhythm, clear arrangements, and thoughtful preparation.",
    strength:
      "You may create routines that make everyday responsibilities easier to carry.",
    blindSpot:
      "A routine can become demanding if there is no room for a different kind of day.",
    tip: "Make practical agreements explicit, including what can change when circumstances do.",
    friction:
      "Unclear or unreliable arrangements may drain you. Try clarifying one agreement and leaving some room around it.",
  },
  red: {
    ...drives.red,
    description: "Agency, directness, and taking a useful next step.",
    strength:
      "You may protect your priorities and act when something needs to change.",
    blindSpot:
      "Acting quickly can leave little time to notice your feelings or hear another person.",
    tip: "State a boundary clearly and kindly, then leave space for a response.",
    friction:
      "Feeling stuck or unable to influence your time may drain you. Try separating what you can act on from what needs to wait.",
  },
  purple: {
    ...drives.purple,
    description: "Trusted connections, familiar rituals, and a sense of home.",
    strength:
      "You may create continuity and keep meaningful memories and traditions alive.",
    blindSpot:
      "Holding on to a familiar pattern can make it harder to try something that fits your life now.",
    tip: "Explain why a ritual matters to you and invite others to help it evolve.",
    friction:
      "Losing familiar anchors may drain you. Try keeping one meaningful element while allowing its form to change.",
  },
};
export const personalGuidance: Record<DriveId, PersonalGuidance> = {
  yellow: {
    routine:
      "Try a small curiosity window: read, make, or explore one question, then choose a stopping point. On a crowded day, just note the question for later.",
    situations: {
      busy: "Pause to identify what is creating the pressure. Choose one question worth thinking about and park the rest.",
      change:
        "Ask what changed and why, then sketch two workable possibilities without needing to explore every option.",
      social:
        "Bring a question you are interested in, invite another perspective, and leave yourself a quiet moment afterwards to reflect.",
    },
  },
  green: {
    routine:
      "Try a regular, low-pressure moment of connection: a message, a shared activity, or a check-in. Include a check-in with your own needs too.",
    situations: {
      busy: "Tell someone you trust what feels heavy and ask for one specific kind of help. Check your capacity before offering more.",
      change:
        "Make room to name how the change feels with someone who can listen, before trying to solve everything.",
      social:
        "Choose a setting where you can have the kind of conversation you want. You can care about others and still leave when you need to.",
    },
  },
  orange: {
    routine:
      "Try choosing one small, meaningful milestone for the day. Notice what moved forward, then give yourself time that does not need to produce anything.",
    situations: {
      busy: "Choose the one outcome that matters most today and define a smaller version that would still count. Let other ambitions wait.",
      change:
        "Reconnect with why your goal matters. Adjust the route or the size of the next milestone to fit the new circumstances.",
      social:
        "Share something you are pleased about and invite someone else's story. Make room for simply enjoying each other's company.",
    },
  },
  blue: {
    routine:
      "Try anchoring one useful habit to something you already do. Give it a short version for disrupted days so the routine can bend.",
    situations: {
      busy: "Put loose ends in one place, choose a short sequence, and leave a little unscheduled room between commitments.",
      change:
        "Clarify what is known and choose a temporary plan. Decide when to revisit it instead of replanning continuously.",
      social:
        "Agree the practical details that help you settle in, such as timing or location, while leaving the activity itself some flexibility.",
    },
  },
  red: {
    routine:
      "Try naming one choice that is yours to make and taking a small first step. Pause afterwards to check whether continuing serves you.",
    situations: {
      busy: "Choose one boundary you can set and one action within your control. You do not need to take responsibility for every demand.",
      change:
        "Separate what you can influence from what you cannot. Take one reversible step and check what you learn from it.",
      social:
        "Say clearly what you would enjoy or prefer to skip. Ask what others want too, before deciding the next step together.",
    },
  },
  purple: {
    routine:
      "Try keeping a familiar ritual that feels like home: a favourite place, activity, or connection. Keep its meaning even when you need a shorter version.",
    situations: {
      busy: "Protect one small familiar anchor, even if its usual form needs to shrink. A brief return can help you feel connected to your day.",
      change:
        "Name what you want to preserve and carry one part of it into the new situation. Give unfamiliar routines time to become your own.",
      social:
        "Start with a trusted person or a familiar setting. Share a memory or ritual while making space for someone else's way of joining in.",
    },
  },
};
export const assessments: Record<AssessmentId, Assessment> = {
  workplace: {
    id: "workplace",
    label: "Workplace",
    storageKey: "innerdrive-v1",
    questions,
    drives,
    lead: "The way you lead, collaborate, and make decisions starts with what drives you. Take a moment to discover your own pattern.",
    context: "at work",
    resultsLead:
      "A starting point for understanding yourself, and a better conversation with the people you work with.",
  },
  personal: {
    id: "personal",
    label: "Personal life",
    storageKey: "innerdrive-personal-v1",
    questions: personalQuestions,
    drives: personalDrives,
    lead: "Discover what gives you energy in everyday life. Explore ideas for routines, relationships, and days that do not go to plan.",
    context: "in your personal life",
    resultsLead:
      "A starting point for shaping routines that suit you and finding ways to support your energy through everyday situations.",
    guidance: personalGuidance,
  },
};
