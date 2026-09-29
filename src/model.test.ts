import { test } from "node:test";
import assert from "node:assert/strict";
import { questions, driveIds } from "./data";
import { complete, decode, leaders, score, valid, type Answers } from "./model";
const answers = (motivation: number[], frustration = motivation): Answers =>
  Object.fromEntries(
    questions.map((q) => [
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
test("content balances both sections and all drives", () => {
  assert.equal(questions.length, 12);
  for (const section of ["motivation", "frustration"])
    assert.equal(questions.filter((q) => q.section === section).length, 6);
  for (const q of questions) {
    assert.equal(q.responses.length, 6);
    assert.deepEqual(
      [...q.responses.map((r) => r.drive)].sort(),
      [...driveIds].sort(),
    );
  }
});
test("all points can be allocated to one response; dimensions remain independent", () => {
  const a = answers([12, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 12]);
  assert.ok(complete(a));
  assert.equal(score(a, "motivation").yellow, 72);
  assert.equal(score(a, "frustration").purple, 72);
  assert.equal(score(a, "motivation").purple, 0);
});
test("ties and even profiles retain all leading drives", () => {
  assert.deepEqual(leaders(score(answers([6, 6, 0, 0, 0, 0]), "motivation")), [
    "yellow",
    "green",
  ]);
  assert.deepEqual(
    leaders(score(answers([2, 2, 2, 2, 2, 2]), "motivation")),
    driveIds,
  );
});
test("reject incomplete, fractional, negative and excessive allocations", () => {
  for (const values of [
    [0, 0, 0, 0, 0, 0],
    [13, 0, 0, 0, 0, 0],
    [-1, 13, 0, 0, 0, 0],
    [1.5, 10.5, 0, 0, 0, 0],
    [12, 1, 0, 0, 0, 0],
  ]) {
    const a = answers(values);
    assert.equal(valid(questions[0], a), false);
    assert.throws(() => score(a, "motivation"));
  }
});
test("restoration preserves progress and latest complete results", () => {
  const saved = {
    version: 1,
    answers: answers([2, 2, 2, 2, 2, 2]),
    index: 11,
    completed: true,
  };
  assert.deepEqual(decode(JSON.stringify(saved)), saved);
  assert.deepEqual(
    decode(
      JSON.stringify({
        ...saved,
        answers: { q1: {} },
        index: 0,
        completed: false,
      }),
    ).answers,
    { q1: {} },
  );
});
test("restoration rejects corrupt, incompatible, or invalid saved data", () => {
  for (const data of [
    null,
    {},
    { version: 2 },
    { version: 1, answers: {}, index: 12, completed: false },
    { version: 1, answers: {}, index: 0, completed: true },
    {
      version: 1,
      answers: { q1: { "1-yellow": 13 } },
      index: 0,
      completed: false,
    },
    {
      version: 1,
      answers: { q1: { unexpected: 2 } },
      index: 0,
      completed: false,
    },
    { version: 1, answers: [], index: 0, completed: false },
  ])
    assert.throws(() => decode(JSON.stringify(data)));
  assert.throws(() => decode("broken"));
});
test("editing answers changes derived results", () => {
  const a = answers([2, 2, 2, 2, 2, 2]);
  a.q1["1-yellow"] = 4;
  a.q1["1-green"] = 0;
  assert.equal(score(a, "motivation").yellow, 14);
  assert.equal(score(a, "motivation").green, 10);
});
