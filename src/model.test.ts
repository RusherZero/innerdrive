import { test } from "node:test";
import assert from "node:assert/strict";
import { assessments, driveIds, type Assessment } from "./data";
import {
  complete,
  decode,
  leaders,
  restore,
  score,
  valid,
  type Answers,
} from "./model";
const answers = (
  assessment: Assessment,
  motivation: number[],
  frustration = motivation,
): Answers =>
  Object.fromEntries(
    assessment.questions.map((q) => [
      q.id,
      Object.fromEntries(
        q.responses.map((r) => [
          r.id,
          (q.section === "motivation" ? motivation : frustration)[
            driveIds.indexOf(r.drive)
          ],
        ]),
      ),
    ]),
  );

for (const assessment of Object.values(assessments)) {
  const { questions, id } = assessment;
  test(`${id}: content balances both sections, topics, and drives`, () => {
    assert.equal(questions.length, 12);
    assert.equal(new Set(questions.map((q) => q.id)).size, 12);
    assert.equal(
      new Set(questions.flatMap((q) => q.responses.map((r) => r.id))).size,
      72,
    );
    for (const section of ["motivation", "frustration"]) {
      const sectionQuestions = questions.filter((q) => q.section === section);
      assert.equal(sectionQuestions.length, 6);
      assert.equal(new Set(sectionQuestions.map((q) => q.topic)).size, 6);
    }
    for (const q of questions) {
      assert.equal(q.responses.length, 6);
      assert.ok(q.prompt.trim());
      assert.deepEqual(
        [...q.responses.map((r) => r.drive)].sort(),
        [...driveIds].sort(),
      );
      assert.ok(q.responses.every((r) => r.text.trim()));
    }
  });
  test(`${id}: all points may go to one drive; sections remain independent`, () => {
    const a = answers(assessment, [12, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 12]);
    assert.ok(complete(a, assessment));
    assert.equal(score(a, "motivation", assessment).yellow, 72);
    assert.equal(score(a, "frustration", assessment).purple, 72);
    assert.equal(score(a, "motivation", assessment).purple, 0);
  });
  test(`${id}: ties retain all leading drives`, () => {
    assert.deepEqual(
      leaders(
        score(
          answers(assessment, [6, 6, 0, 0, 0, 0]),
          "motivation",
          assessment,
        ),
      ),
      ["yellow", "green"],
    );
    assert.deepEqual(
      leaders(
        score(
          answers(assessment, [2, 2, 2, 2, 2, 2]),
          "motivation",
          assessment,
        ),
      ),
      driveIds,
    );
  });
  test(`${id}: rejects incomplete, fractional, negative and excessive allocations`, () => {
    for (const values of [
      [0, 0, 0, 0, 0, 0],
      [13, 0, 0, 0, 0, 0],
      [-1, 13, 0, 0, 0, 0],
      [1.5, 10.5, 0, 0, 0, 0],
      [12, 1, 0, 0, 0, 0],
    ]) {
      const a = answers(assessment, values);
      assert.equal(valid(questions[0], a), false);
      assert.throws(() => score(a, "motivation", assessment));
    }
  });
  test(`${id}: restores partial allocations, progress and complete results`, () => {
    const saved = {
      version: 1,
      answers: answers(assessment, [2, 2, 2, 2, 2, 2]),
      index: 11,
      completed: true,
    };
    assert.deepEqual(decode(JSON.stringify(saved), assessment), saved);
    const partial = {
      version: 1,
      answers: { [questions[0].id]: { [questions[0].responses[0].id]: 3 } },
      index: 0,
      completed: false,
    };
    assert.deepEqual(decode(JSON.stringify(partial), assessment), partial);
  });
  test(`${id}: rejects corrupt, incompatible, or invalid saved data`, () => {
    for (const data of [
      null,
      {},
      { version: 2 },
      { version: 1, answers: {}, index: 12, completed: false },
      { version: 1, answers: {}, index: 0, completed: true },
      {
        version: 1,
        answers: { [questions[0].id]: { [questions[0].responses[0].id]: 13 } },
        index: 0,
        completed: false,
      },
      {
        version: 1,
        answers: { [questions[0].id]: { unexpected: 2 } },
        index: 0,
        completed: false,
      },
      { version: 1, answers: [], index: 0, completed: false },
    ])
      assert.throws(() => decode(JSON.stringify(data), assessment));
    assert.throws(() => decode("broken", assessment));
  });
  test(`${id}: editing answers changes derived results`, () => {
    const a = answers(assessment, [2, 2, 2, 2, 2, 2]);
    const q = questions[0];
    a[q.id][q.responses.find((r) => r.drive === "yellow")!.id] = 4;
    a[q.id][q.responses.find((r) => r.drive === "green")!.id] = 0;
    assert.equal(score(a, "motivation", assessment).yellow, 14);
    assert.equal(score(a, "motivation", assessment).green, 10);
  });
}
test("workplace keeps legacy storage key and answer identifiers", () => {
  assert.equal(assessments.workplace.storageKey, "innerdrive-v1");
  const legacy = {
    version: 1,
    index: 0,
    completed: false,
    answers: { q1: { "1-yellow": 5, "1-purple": 7 } },
  };
  assert.deepEqual(
    decode(JSON.stringify(legacy), assessments.workplace),
    legacy,
  );
});
test("answers cannot be restored or scored against the other assessment", () => {
  for (const assessment of Object.values(assessments)) {
    const other =
      assessment.id === "personal"
        ? assessments.workplace
        : assessments.personal;
    const a = answers(assessment, [2, 2, 2, 2, 2, 2]);
    assert.equal(complete(a, other), false);
    assert.throws(() => score(a, "motivation", other));
    assert.throws(() =>
      decode(
        JSON.stringify({ version: 1, answers: a, index: 0, completed: false }),
        other,
      ),
    );
  }
});
test("personal guidance covers every drive and everyday situation", () => {
  for (const id of driveIds) {
    const guidance = assessments.personal.guidance![id];
    assert.ok(guidance.routine.trim());
    for (const situation of ["busy", "change", "social"] as const)
      assert.ok(guidance.situations[situation].trim());
    assert.notEqual(
      assessments.personal.drives[id].description,
      assessments.workplace.drives[id].description,
    );
  }
});
test("storage restores each mode independently and handles corruption or unavailability", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const stored = new Map<string, string>();
  try {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: (key: string) => stored.get(key) ?? null },
    });
    for (const assessment of Object.values(assessments)) {
      assert.deepEqual(restore(assessment).saved.answers, {});
      stored.set(
        assessment.storageKey,
        JSON.stringify({
          version: 1,
          index: 0,
          completed: false,
          answers: { [assessment.questions[0].id]: {} },
        }),
      );
    }
    assert.deepEqual(restore(assessments.workplace).saved.answers, { q1: {} });
    assert.deepEqual(restore(assessments.personal).saved.answers, {
      "personal-q1": {},
    });
    stored.delete(assessments.personal.storageKey);
    assert.deepEqual(restore(assessments.personal).saved.answers, {});
    assert.deepEqual(restore(assessments.workplace).saved.answers, { q1: {} });
    stored.set(assessments.personal.storageKey, "broken");
    assert.match(restore(assessments.personal).notice, /could not be restored/);
    assert.equal(restore(assessments.workplace).notice, "");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });
    for (const assessment of Object.values(assessments)) {
      assert.match(restore(assessment).notice, /unavailable/);
      assert.deepEqual(restore(assessment).saved.answers, {});
    }
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
