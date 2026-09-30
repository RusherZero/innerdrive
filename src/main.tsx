import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { drives, driveIds, questions, type Section } from "./data";
import {
  complete,
  leaders,
  restore,
  score,
  storageKey,
  total,
  valid,
  type Saved,
} from "./model";
import "./styles.css";
const initial = restore();
type View = "intro" | "question" | "review" | "results";
function App() {
  const [saved, setSaved] = useState<Saved>(initial.saved);
  const [notice, setNotice] = useState(initial.notice);
  const [view, setView] = useState<View>(
    initial.saved.completed ? "results" : "intro",
  );
  const [confirmReset, setConfirmReset] = useState(false);
  const [storageOk, setStorageOk] = useState(!initial.notice);
  const [editing, setEditing] = useState(false);
  const q = questions[saved.index];
  const answered = questions.filter((question) =>
    valid(question, saved.answers),
  ).length;
  useEffect(() => {
    if (!Object.keys(saved.answers).length) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(saved));
      setStorageOk(true);
    } catch {
      setStorageOk(false);
      setNotice(
        "Browser storage is unavailable. You can continue, but progress will not be saved.",
      );
    }
  }, [saved]);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>("h1")?.focus();
  }, [view, saved.index]);
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
      localStorage.removeItem(storageKey);
      setNotice("");
    } catch {
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
    if (complete(saved.answers)) {
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
        <span className="edition">THE WORKPLACE REFLECTION</span>
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
              <p className="lead">
                The way you lead, collaborate, and make decisions starts with
                what drives you. Take a moment to discover your own pattern.
              </p>
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
                  12 statements · At your own pace
                </span>
              </div>
              <div className="intro-details">
                <div>
                  <span className="detail-number">01</span>
                  <strong>Reflect</strong>
                  <p>
                    Explore what energises
                    <br />
                    and frustrates you at work.
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
                    ideas to work with it.
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
                six workplace drives. It is not the official Management Drives
                assessment or a scientifically validated test.
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
                  <small>Statements 1–6</small>
                </div>
              </div>
              <div
                className={`section-step ${q.section === "frustration" ? "active" : ""}`}
              >
                <span>02</span>
                <div>
                  <strong>What drains you</strong>
                  <small>Statements 7–12</small>
                </div>
              </div>
              <div className="sidebar-help">
                <span>↗</span>
                <p>
                  Think about how you usually feel at work, rather than how you
                  think you should feel.
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
                  <span className="muted">/ 12</span>
                </span>
              </div>
              <div
                className="progress-track"
                aria-label={`${answered} of 12 statements completed`}
              >
                <div style={{ width: `${(answered / 12) * 100}%` }} />
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
                    editing || saved.index === 11
                      ? setView("review")
                      : setSaved({ ...saved, index: saved.index + 1 })
                  }
                >
                  {editing
                    ? "Back to review"
                    : saved.index === 11
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
              disabled={!complete(saved.answers)}
              onClick={results}
            >
              Reveal my profile <span>↗</span>
            </button>
          </section>
        )}
        {view === "results" && complete(saved.answers) && (
          <section className="results-page">
            <div className="result-heading">
              <div>
                <p className="eyebrow">YOUR PERSONAL REFLECTION</p>
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
              </div>
            </div>
            <p className="lead results-lead">
              A starting point for understanding yourself, and a better
              conversation with the people you work with.
            </p>
            <div className="charts">
              {(["motivation", "frustration"] as Section[]).map((section) => {
                const scores = score(saved.answers, section);
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
                        ? "Your relative preference for each workplace drive."
                        : "Your reactions to the behaviours described in the questions. Higher scores highlight needs whose absence you found more draining in the situations described. For example, a high Structure score points to frustration with unclear or unreliable ways of working."}
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
                              {((scores[id] / 72) * 100).toFixed(1)}
                              <small>%</small>
                            </strong>
                          </div>
                          <div className="bar-track">
                            <div
                              style={{
                                background: drives[id].color,
                                width: `${(scores[id] / 72) * 100}%`,
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
              Each chart shows how you distributed 72 points in that section.
              Percentages describe your own answers, not a comparison with other
              people. Motivation and frustration are independent: the same drive
              can appear strongly in both. Rounded percentages may not add up to
              exactly 100%.
            </p>
            <div className="insight-heading">
              <p className="eyebrow">TURN REFLECTION INTO ACTION</p>
              <h2>Your drives, in everyday life.</h2>
              <p>
                Start with your leading motivations, then explore the rest of
                your profile.
              </p>
            </div>
            <div className="insights">
              {[...driveIds]
                .sort(
                  (a, b) =>
                    score(saved.answers, "motivation")[b] -
                    score(saved.answers, "motivation")[a],
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
                      {leaders(score(saved.answers, "motivation")).includes(
                        id,
                      ) && (
                        <span className="leading-label">
                          {leaders(score(saved.answers, "motivation"))
                            .length === 6
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
                    <h4>Try this with others</h4>
                    <p>{drives[id].tip}</p>
                    {leaders(score(saved.answers, "frustration")).includes(
                      id,
                    ) && (
                      <div className="friction-note">
                        <h4>
                          {leaders(score(saved.answers, "frustration"))
                            .length === 6
                            ? "A reflection on frustration"
                            : "A leading source of frustration"}
                        </h4>
                        <p>{drives[id].friction}</p>
                      </div>
                    )}
                  </article>
                ))}
            </div>
            <aside className="reflection-prompt">
              <span>↗</span>
              <div>
                <h2>Make it a conversation.</h2>
                <p>
                  What feels familiar? What surprised you? Choose one insight
                  and discuss a recent example with someone you trust.
                </p>
              </div>
            </aside>
            <p className="disclaimer">
              This is an original reflection tool inspired by six workplace
              drives, not the official Management Drives assessment or a
              scientifically validated test. Treat the results as prompts for
              discussion, not fixed labels or a basis for employment decisions.
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
              Reset reflection
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
            <h2 id="reset-title">Start a new reflection?</h2>
            <p>
              This deletes your answers and profile from this browser. Print
              your profile first if you want to keep it.
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
                Reset reflection
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
