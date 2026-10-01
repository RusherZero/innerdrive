import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  assessments,
  driveIds,
  type AssessmentId,
  type EnergySituation,
  type Section,
} from "./data";
import {
  complete,
  leaders,
  restore,
  score,
  total,
  valid,
  type Saved,
} from "./model";
import "./styles.css";
const initial = {
  workplace: restore(assessments.workplace),
  personal: restore(assessments.personal),
};
const assessmentIds: AssessmentId[] = ["workplace", "personal"];
const situationLabels: Record<EnergySituation, string> = {
  busy: "Busy days",
  change: "Unexpected changes",
  social: "Social situations",
};
type View = "intro" | "question" | "review" | "results";
function App() {
  const [mode, setMode] = useState<AssessmentId>("workplace");
  const [profiles, setProfiles] = useState({
    workplace: initial.workplace.saved,
    personal: initial.personal.saved,
  });
  const [notices, setNotices] = useState({
    workplace: initial.workplace.notice,
    personal: initial.personal.notice,
  });
  const [storageStates, setStorageStates] = useState({
    workplace: !initial.workplace.notice,
    personal: !initial.personal.notice,
  });
  const [view, setView] = useState<View>("intro");
  const [confirmReset, setConfirmReset] = useState(false);
  const [editing, setEditing] = useState(false);
  const assessment = assessments[mode];
  const { questions, drives } = assessment;
  const saved = profiles[mode];
  const notice = notices[mode];
  const storageOk = storageStates[mode];
  function setNotice(value: string) {
    setNotices((previous) => ({ ...previous, [mode]: value }));
  }
  function setSaved(value: Saved) {
    setProfiles((previous) => ({ ...previous, [mode]: value }));
    if (!Object.keys(value.answers).length) return;
    try {
      localStorage.setItem(assessment.storageKey, JSON.stringify(value));
      setStorageStates((previous) => ({ ...previous, [mode]: true }));
      setNotice("");
    } catch {
      setStorageStates((previous) => ({ ...previous, [mode]: false }));
      setNotice(
        "Browser storage is unavailable. You can continue, but progress will not be saved.",
      );
    }
  }
  const q = questions[saved.index];
  const answered = questions.filter((question) =>
    valid(question, saved.answers),
  ).length;
  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>("h1")?.focus();
  }, [view, view === "question" ? saved.index : null]);
  function allocate(id: string, value: number) {
    const old = saved.answers[q.id]?.[id] ?? 0;
    const next = Math.max(
      0,
      Math.min(12 - total(q, saved.answers) + old, Math.trunc(value) || 0),
    );
    setSaved({
      ...saved,
      completed: false,
      answers: {
        ...saved.answers,
        [q.id]: { ...saved.answers[q.id], [id]: next },
      },
    });
  }
  function reset() {
    try {
      localStorage.removeItem(assessment.storageKey);
      setStorageStates((previous) => ({ ...previous, [mode]: true }));
      setNotice("");
    } catch {
      setStorageStates((previous) => ({ ...previous, [mode]: false }));
      setNotice(
        "Saved browser data could not be removed. Clear this site’s data in your browser settings.",
      );
    }
    setSaved({ version: 1, answers: {}, index: 0, completed: false });
    setView("intro");
    setConfirmReset(false);
    setEditing(false);
  }
  function results() {
    if (complete(saved.answers, assessment)) {
      setSaved({ ...saved, completed: true });
      setView("results");
      setEditing(false);
    }
  }
  return (
    <>
      <header className="site-header">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView("intro");
          }}
        >
          <span className="brand-mark">i</span>innerdrive
          <span className="brand-period">.</span>
        </a>
        <span className="header-caption">
          A little reflection. A clearer perspective.
        </span>
        <span className="edition">
          {assessment.label.toUpperCase()} REFLECTION
        </span>
      </header>
      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}
      <main>
        {view === "intro" && (
          <div className="intro-grid">
            <section className="intro-copy">
              <p className="eyebrow">
                <span className="tiny-line" /> GET TO KNOW YOUR WHY
              </p>
              <h1 tabIndex={-1}>
                Understand what
                <br />
                moves <em>you.</em>
              </h1>
              <p className="lead">{assessment.lead}</p>
              <fieldset className="assessment-selector">
                <legend>Choose your reflection</legend>
                <div className="assessment-options">
                  {assessmentIds.map((id) => {
                    const option = assessments[id];
                    const progress = option.questions.filter((question) =>
                      valid(question, profiles[id].answers),
                    ).length;
                    return (
                      <label
                        key={id}
                        className={`assessment-option ${mode === id ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="assessment"
                          value={id}
                          checked={mode === id}
                          onChange={() => {
                            setMode(id);
                            setEditing(false);
                            setConfirmReset(false);
                          }}
                        />
                        <span>
                          <strong>{option.label}</strong>
                          <small>
                            {id === "workplace"
                              ? "How you work, lead, and collaborate."
                              : "Your routines, connections, and everyday energy."}
                          </small>
                          <span className="assessment-progress">
                            {profiles[id].completed
                              ? "Profile ready"
                              : Object.keys(profiles[id].answers).length
                                ? `${progress}/${option.questions.length} statements complete · In progress`
                                : "Ready to begin"}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="intro-actions">
                <button
                  className="primary"
                  onClick={() =>
                    setView(saved.completed ? "results" : "question")
                  }
                >
                  {saved.completed
                    ? "View your profile"
                    : answered || Object.keys(saved.answers).length
                      ? "Continue your reflection"
                      : "Discover your drives"}{" "}
                  <span>↗</span>
                </button>
                <span className="time-note">
                  {questions.length} statements · At your own pace
                </span>
              </div>
              <div className="intro-details">
                <div>
                  <span className="detail-number">01</span>
                  <strong>Reflect</strong>
                  <p>
                    Explore what energises
                    <br />
                    and frustrates you {assessment.context}.
                  </p>
                </div>
                <div>
                  <span className="detail-number">02</span>
                  <strong>Distribute</strong>
                  <p>
                    Share 12 points between
                    <br />
                    the responses that fit you.
                  </p>
                </div>
                <div>
                  <span className="detail-number">03</span>
                  <strong>Discover</strong>
                  <p>
                    Get your profile and practical
                    <br />
                    {mode === "personal"
                      ? "ideas for your everyday life."
                      : "ideas to work with it."}
                  </p>
                </div>
              </div>
            </section>
            <aside
              className="art-card"
              aria-label="Six drives, one unique perspective"
            >
              <div className="art-top">
                <span>
                  DIFFERENT DRIVES.
                  <br />
                  YOUR OWN COMBINATION.
                </span>
                <span className="art-star">✳</span>
              </div>
              <div className="flower" aria-hidden="true">
                {driveIds.map((id, i) => (
                  <span
                    key={id}
                    className={`petal petal-${i}`}
                    style={{ background: drives[id].color }}
                  />
                ))}
                <span className="flower-center" />
              </div>
              <div className="art-bottom">
                <span>
                  Six drives.
                  <br />
                  <em>One you.</em>
                </span>
                <div className="dot-grid">
                  {driveIds.map((id) => (
                    <i key={id} style={{ background: drives[id].color }} />
                  ))}
                </div>
              </div>
            </aside>
            <section className="intro-foot">
              <span className="privacy-icon">◇</span>
              <p>
                <strong>A space for honest reflection.</strong> There are no
                right or wrong answers. No account needed; your progress stays
                in this browser. This original reflection tool is inspired by
                six drives. It is not the official Management Drives assessment
                or a scientifically validated test.
              </p>
            </section>
          </div>
        )}
        {view === "question" && (
          <div className="question-layout">
            <aside className="question-sidebar">
              <p className="eyebrow">YOUR REFLECTION</p>
              <h2>
                A little closer
                <br />
                to your <em>why.</em>
              </h2>
              <div
                className={`section-step ${q.section === "motivation" ? "active" : ""}`}
              >
                <span>01</span>
                <div>
                  <strong>What energises you</strong>
                  <small>
                    Statements 1–
                    {questions.filter((q) => q.section === "motivation").length}
                  </small>
                </div>
              </div>
              <div
                className={`section-step ${q.section === "frustration" ? "active" : ""}`}
              >
                <span>02</span>
                <div>
                  <strong>What drains you</strong>
                  <small>
                    Statements{" "}
                    {questions.filter((q) => q.section === "motivation")
                      .length + 1}
                    –{questions.length}
                  </small>
                </div>
              </div>
              <div className="sidebar-help">
                <span>↗</span>
                <p>
                  Think about how you usually feel {assessment.context}, rather
                  than how you think you should feel.
                </p>
                <p>
                  Give more points to responses that resonate. Zero is fine, and
                  all 12 can go to one response.
                </p>
              </div>
            </aside>
            <section className="question-main">
              <div className="question-meta">
                <span>
                  {q.section === "motivation"
                    ? "WHAT ENERGISES YOU"
                    : "WHAT DRAINS YOU"}{" "}
                  <span className="meta-dot">/</span> {q.topic}
                </span>
                <span>
                  {String(saved.index + 1).padStart(2, "0")}{" "}
                  <span className="muted">/ {questions.length}</span>
                </span>
              </div>
              <div
                className="progress-track"
                aria-label={`${answered} of ${questions.length} statements completed`}
              >
                <div
                  style={{ width: `${(answered / questions.length) * 100}%` }}
                />
              </div>
              <h1 tabIndex={-1}>{q.prompt}</h1>
              <div className="allocation-instruction">
                <p>
                  Distribute <strong>12 points</strong> across the responses
                  below.
                </p>
                <span
                  className={`remaining ${total(q, saved.answers) === 12 ? "done" : ""}`}
                  role="status"
                  aria-live="polite"
                >
                  {12 - total(q, saved.answers) === 0
                    ? "✓ All points assigned"
                    : `${12 - total(q, saved.answers)} points left`}
                </span>
              </div>
              <div className="responses">
                {q.responses.map((r, i) => {
                  const value = saved.answers[q.id]?.[r.id] ?? 0;
                  return (
                    <div
                      className={`response ${value ? "has-points" : ""}`}
                      key={r.id}
                    >
                      <span className="response-letter">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <label htmlFor={r.id}>{r.text}</label>
                      <div className="stepper">
                        <button
                          aria-label={`Remove a point: ${r.text}`}
                          disabled={!value}
                          onClick={() => allocate(r.id, value - 1)}
                        >
                          −
                        </button>
                        <input
                          id={r.id}
                          type="number"
                          min="0"
                          max="12"
                          step="1"
                          inputMode="numeric"
                          value={value}
                          onChange={(e) =>
                            allocate(r.id, Number(e.target.value))
                          }
                        />
                        <button
                          aria-label={`Add a point: ${r.text}`}
                          disabled={total(q, saved.answers) === 12}
                          onClick={() => allocate(r.id, value + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="question-nav">
                <button
                  className="text-button"
                  onClick={() =>
                    saved.index === 0
                      ? setView("intro")
                      : setSaved({ ...saved, index: saved.index - 1 })
                  }
                >
                  ← Back
                </button>
                <span className="save-status">
                  {storageOk
                    ? "Saved on this device"
                    : "Not saved on this device"}
                </span>
                <button
                  className="primary"
                  disabled={!valid(q, saved.answers)}
                  onClick={() =>
                    editing || saved.index === questions.length - 1
                      ? setView("review")
                      : setSaved({ ...saved, index: saved.index + 1 })
                  }
                >
                  {editing
                    ? "Back to review"
                    : saved.index === questions.length - 1
                      ? "Review answers"
                      : "Next statement"}{" "}
                  <span>→</span>
                </button>
              </div>
            </section>
          </div>
        )}
        {view === "review" && (
          <section className="review-page">
            <p className="eyebrow">ONE LAST LOOK</p>
            <h1 tabIndex={-1}>
              Your reflection,
              <br />
              <em>ready to explore.</em>
            </h1>
            <p className="lead">
              Review your allocations or open your profile. You can always
              return and make changes.
            </p>
            <div className="review-list">
              {questions.map((question, index) => (
                <div className="review-row" key={question.id}>
                  <span className="muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{question.topic}</strong>
                    <small>
                      {question.section === "motivation"
                        ? "Motivation"
                        : "Frustration"}{" "}
                      · {total(question, saved.answers)}/12 points
                    </small>
                    <details>
                      <summary>View allocations</summary>
                      {question.responses.map((r) => (
                        <p key={r.id}>
                          <b>{saved.answers[question.id]?.[r.id] ?? 0}</b>{" "}
                          {r.text}
                        </p>
                      ))}
                    </details>
                  </div>
                  <button
                    className="text-button"
                    aria-label={`Edit statement ${index + 1}`}
                    onClick={() => {
                      setSaved({ ...saved, index });
                      setEditing(true);
                      setView("question");
                    }}
                  >
                    Edit ↗
                  </button>
                </div>
              ))}
            </div>
            <button
              className="primary"
              disabled={!complete(saved.answers, assessment)}
              onClick={results}
            >
              Reveal my profile <span>↗</span>
            </button>
          </section>
        )}
        {view === "results" && complete(saved.answers, assessment) && (
          <section className="results-page">
            <div className="result-heading">
              <div>
                <p className="eyebrow">
                  YOUR {assessment.label.toUpperCase()} REFLECTION
                </p>
                <h1 tabIndex={-1}>
                  A clearer picture
                  <br />
                  of <em>what drives you.</em>
                </h1>
              </div>
              <div className="result-actions no-print">
                <button className="secondary" onClick={() => window.print()}>
                  Print / Save PDF ↗
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    setEditing(true);
                    setView("review");
                  }}
                >
                  Review your answers →
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    setView("intro");
                    setEditing(false);
                  }}
                >
                  Choose another reflection →
                </button>
              </div>
            </div>
            <p className="lead results-lead">{assessment.resultsLead}</p>
            <div className="charts">
              {(["motivation", "frustration"] as Section[]).map((section) => {
                const scores = score(saved.answers, section, assessment);
                const sectionTotal =
                  questions.filter((q) => q.section === section).length * 12;
                return (
                  <article className="chart-card" key={section}>
                    <p className="eyebrow">
                      {section === "motivation"
                        ? "01 / MOTIVATION"
                        : "02 / FRUSTRATION"}
                    </p>
                    <h2>
                      {section === "motivation"
                        ? "What gives you energy"
                        : "What can drain your energy"}
                    </h2>
                    <p className="chart-description">
                      {section === "motivation"
                        ? `Your relative preference for each drive ${assessment.context}.`
                        : `Your reactions to the situations described in the questions. Higher scores highlight needs whose absence you found more draining. For example, a high Structure score points to frustration with ${mode === "personal" ? "unclear or unreliable everyday arrangements" : "unclear or unreliable ways of working"}.`}
                    </p>
                    <div className="bar-chart">
                      {driveIds.map((id) => (
                        <div className="bar-row" key={id}>
                          <div className="bar-label">
                            <span>
                              <i style={{ background: drives[id].color }} />
                              {drives[id].name}
                            </span>
                            <strong>
                              {((scores[id] / sectionTotal) * 100).toFixed(1)}
                              <small>%</small>
                            </strong>
                          </div>
                          <div className="bar-track">
                            <div
                              style={{
                                background: drives[id].color,
                                width: `${(scores[id] / sectionTotal) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="chart-note">
                      {leaders(scores).length === 6
                        ? "Your allocations are evenly distributed across all six drives."
                        : `${leaders(scores).length > 1 ? "Joint highest" : "Highest"}: ${leaders(
                            scores,
                          )
                            .map((id) => drives[id].name)
                            .join(", ")}.`}
                    </p>
                  </article>
                );
              })}
            </div>
            <p className="score-explanation">
              Each chart shows how you distributed{" "}
              {questions.filter((q) => q.section === "motivation").length * 12}{" "}
              motivation points and{" "}
              {questions.filter((q) => q.section === "frustration").length * 12}{" "}
              frustration points in their respective sections. Percentages
              describe your own answers, not a comparison with other people.
              Motivation and frustration are independent: the same drive can
              appear strongly in both. Rounded percentages may not add up to
              exactly 100%.
            </p>
            <div className="insight-heading">
              <p className="eyebrow">TURN REFLECTION INTO ACTION</p>
              <h2>
                {mode === "personal"
                  ? "Build routines around what energises you."
                  : "Your drives, in everyday life."}
              </h2>
              <p>
                Start with your leading motivations, then explore the rest of
                your profile.
              </p>
            </div>
            <div className="insights">
              {[...driveIds]
                .sort(
                  (a, b) =>
                    score(saved.answers, "motivation", assessment)[b] -
                    score(saved.answers, "motivation", assessment)[a],
                )
                .map((id) => (
                  <article
                    className="insight-card"
                    key={id}
                    style={{ borderTopColor: drives[id].color }}
                  >
                    <div className="drive-title">
                      <span
                        className="drive-dot"
                        style={{ background: drives[id].color }}
                      />
                      <h3>{drives[id].name}</h3>
                      {leaders(
                        score(saved.answers, "motivation", assessment),
                      ).includes(id) && (
                        <span className="leading-label">
                          {leaders(
                            score(saved.answers, "motivation", assessment),
                          ).length === 6
                            ? "Equal share"
                            : "Leading drive"}
                        </span>
                      )}
                    </div>
                    <p>{drives[id].description}</p>
                    <h4>Possible strength</h4>
                    <p>{drives[id].strength}</p>
                    <h4>Something to watch</h4>
                    <p>{drives[id].blindSpot}</p>
                    {assessment.guidance && (
                      <>
                        <h4>A routine to try</h4>
                        <p>{assessment.guidance[id].routine}</p>
                      </>
                    )}
                    <h4>Try this with others</h4>
                    <p>{drives[id].tip}</p>
                    {leaders(
                      score(saved.answers, "frustration", assessment),
                    ).includes(id) && (
                      <div className="friction-note">
                        <h4>
                          {leaders(
                            score(saved.answers, "frustration", assessment),
                          ).length === 6
                            ? "A reflection on frustration"
                            : "A leading source of frustration"}
                        </h4>
                        <p>{drives[id].friction}</p>
                      </div>
                    )}
                  </article>
                ))}
            </div>
            {assessment.guidance && (
              <section
                className="situation-guidance"
                aria-labelledby="situations-heading"
              >
                <div className="insight-heading">
                  <p className="eyebrow">
                    WHEN YOUR DAY NEEDS SOMETHING DIFFERENT
                  </p>
                  <h2 id="situations-heading">
                    Support your energy in the moment.
                  </h2>
                  <p>
                    {leaders(score(saved.answers, "frustration", assessment))
                      .length === 6
                      ? "Your drainers are evenly distributed. Explore these options and choose what fits the situation."
                      : "These suggestions reflect your leading drainers. Try the ones that fit your circumstances."}
                  </p>
                </div>
                <div className="insights">
                  {(Object.keys(situationLabels) as EnergySituation[]).map(
                    (situation) => (
                      <article
                        className="insight-card situation-card"
                        key={situation}
                      >
                        <h3>{situationLabels[situation]}</h3>
                        {leaders(
                          score(saved.answers, "frustration", assessment),
                        ).map((id) => (
                          <div key={id}>
                            <h4>{drives[id].name}</h4>
                            <p>
                              {assessment.guidance![id].situations[situation]}
                            </p>
                          </div>
                        ))}
                      </article>
                    ),
                  )}
                </div>
              </section>
            )}
            <aside className="reflection-prompt">
              <span>↗</span>
              <div>
                <h2>
                  {mode === "personal"
                    ? "Start with one small adjustment."
                    : "Make it a conversation."}
                </h2>
                <p>
                  {mode === "personal"
                    ? "Choose one routine idea that fits your life now. Try a small version, notice how it feels, and adjust it as your circumstances change."
                    : "What feels familiar? What surprised you? Choose one insight and discuss a recent example with someone you trust."}
                </p>
              </div>
            </aside>
            <p className="disclaimer">
              This is an original reflection tool inspired by six drives, not
              the official Management Drives assessment or a scientifically
              validated test. Treat the results as prompts for reflection, not
              fixed labels
              {mode === "workplace"
                ? " or a basis for employment decisions"
                : " or prescriptions for how to live"}
              .
            </p>
          </section>
        )}
      </main>
      <footer>
        <span>
          innerdrive<span className="brand-period">.</span>{" "}
          <span className="footer-tag">Room to understand yourself.</span>
        </span>
        <div>
          <span>Private by design. Stored in your browser.</span>
          {Object.keys(saved.answers).length > 0 && (
            <button
              className="text-button no-print"
              onClick={() => setConfirmReset(true)}
            >
              Reset {assessment.label.toLowerCase()} reflection
            </button>
          )}
        </div>
      </footer>
      {confirmReset && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-title"
          >
            <h2 id="reset-title">
              Restart your {assessment.label.toLowerCase()} reflection?
            </h2>
            <p>
              This deletes only your {assessment.label.toLowerCase()} answers
              and profile from this browser. Your other reflection is kept.
              Print your profile first if you want to keep it.
            </p>
            <div>
              <button
                className="secondary"
                autoFocus
                onClick={() => setConfirmReset(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setConfirmReset(false);
                  if (e.key === "Tab" && e.shiftKey) {
                    e.preventDefault();
                    document.getElementById("confirm-reset")?.focus();
                  }
                }}
              >
                Keep my answers
              </button>
              <button
                id="confirm-reset"
                className="primary"
                onClick={reset}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setConfirmReset(false);
                  if (e.key === "Tab" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.previousElementSibling instanceof
                      HTMLElement &&
                      e.currentTarget.previousElementSibling.focus();
                  }
                }}
              >
                Reset {assessment.label.toLowerCase()} reflection
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
