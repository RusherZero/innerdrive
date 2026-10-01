import {
  driveIds,
  type Assessment,
  type DriveId,
  type Question,
  type Section,
} from "./data";
export type Answers = Record<string, Record<string, number>>;
export interface Saved {
  version: 1;
  answers: Answers;
  index: number;
  completed: boolean;
}
export const total = (question: Question, answers: Answers) =>
  question.responses.reduce(
    (sum, r) => sum + (answers[question.id]?.[r.id] ?? 0),
    0,
  );
export const valid = (question: Question, answers: Answers) =>
  question.responses.every((r) => {
    const n = answers[question.id]?.[r.id] ?? 0;
    return Number.isInteger(n) && n >= 0 && n <= 12;
  }) && total(question, answers) === 12;
export const complete = (answers: Answers, assessment: Assessment) =>
  assessment.questions.every((q) => valid(q, answers));
export function score(
  answers: Answers,
  section: Section,
  assessment: Assessment,
): Record<DriveId, number> {
  if (!complete(answers, assessment))
    throw new Error("Complete all allocations before scoring.");
  const sums = Object.fromEntries(driveIds.map((id) => [id, 0])) as Record<
    DriveId,
    number
  >;
  assessment.questions
    .filter((q) => q.section === section)
    .forEach((q) =>
      q.responses.forEach((r) => {
        sums[r.drive] += answers[q.id]?.[r.id] ?? 0;
      }),
    );
  return sums;
}
export const leaders = (scores: Record<DriveId, number>) =>
  driveIds.filter((id) => scores[id] === Math.max(...Object.values(scores)));
export function decode(raw: string, assessment: Assessment): Saved {
  const { questions } = assessment;
  const data = JSON.parse(raw);
  if (
    !data ||
    data.version !== 1 ||
    !Number.isInteger(data.index) ||
    data.index < 0 ||
    data.index >= questions.length ||
    typeof data.completed !== "boolean" ||
    !data.answers ||
    typeof data.answers !== "object" ||
    Array.isArray(data.answers)
  )
    throw new Error("Invalid saved questionnaire");
  const answers: Answers = {};
  for (const [qid, allocation] of Object.entries(data.answers)) {
    const question = questions.find((q) => q.id === qid);
    if (
      !question ||
      !allocation ||
      typeof allocation !== "object" ||
      Array.isArray(allocation)
    )
      throw new Error("Invalid saved answers");
    answers[qid] = {};
    for (const [rid, value] of Object.entries(allocation)) {
      if (
        !question.responses.some((r) => r.id === rid) ||
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < 0 ||
        value > 12
      )
        throw new Error("Invalid saved allocation");
      answers[qid][rid] = value;
    }
    if (total(question, answers) > 12) throw new Error("Invalid saved total");
  }
  if (data.completed && !complete(answers, assessment))
    throw new Error("Incomplete saved result");
  return { version: 1, answers, index: data.index, completed: data.completed };
}
export function restore(assessment: Assessment): {
  saved: Saved;
  notice: string;
} {
  const empty: Saved = { version: 1, answers: {}, index: 0, completed: false };
  let raw: string | null;
  try {
    raw = localStorage.getItem(assessment.storageKey);
  } catch {
    return {
      saved: empty,
      notice:
        "Browser storage is unavailable. You can continue, but progress will not be saved.",
    };
  }
  if (!raw) return { saved: empty, notice: "" };
  try {
    return { saved: decode(raw, assessment), notice: "" };
  } catch {
    return {
      saved: empty,
      notice:
        "The saved questionnaire could not be restored. Please start a new reflection.",
    };
  }
}
