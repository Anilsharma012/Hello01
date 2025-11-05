import React, { useMemo, useState, useEffect, useRef } from "react";
import "./MockTest.css";
import team from "../../images/contactTeams.png";
import { useNavigate } from "react-router-dom";
import Chatbox from "../../components/Chat/Chatbox";

/* =========================
   DATA: Exam-wise test cards
   ========================= */
const CATEGORIES = [
  { key: "all", label: " CATEGORIES" },
  { key: "cat", label: "CAT" },
  { key: "xat", label: "XAT" },
  { key: "snap", label: "SNAP" },
  { key: "nmat", label: "NMAT" },
  { key: "mhcet", label: "MHCET" },
  { key: "srcc", label: "SRCC" },
];

const TESTS = [
  { id: 1, title: "CAT Mock 01", category: "cat", questions: 100, marks: 100, minutes: 120, lang: "English", comingSoon: true  },
  { id: 2, title: "CAT Mock 02", category: "cat", questions: 100, marks: 100, minutes: 120, lang: "English" , comingSoon: true },
  { id: 3, title: "XAT Mock 01", category: "xat", questions: 100, marks: 100, minutes: 180, lang: "English", comingSoon: true  },
  { id: 4, title: "NMAT Mock 01", category: "nmat", questions: 108, marks: 108, minutes: 120, lang: "English", comingSoon: true },
  { id: 5, title: "MHCET Mock 01", category: "mhcet", questions: 200, marks: 200, minutes: 150, lang: "English", comingSoon: true  },
  { id: 6, title: "SRCC Mock 01", category: "srcc", questions: 100, marks: 100, minutes: 90, lang: "English", comingSoon: true  },
  { id: 7, title: "XAT Mock 02", category: "xat", questions: 100, marks: 100, minutes: 180, lang: "English" , comingSoon: true },
  { id: 8, title: "CAT Mock 03", category: "cat", questions: 100, marks: 100, minutes: 120, lang: "English", comingSoon: true  },
];

/* =========================
   DATA: Topic-wise test cards
   ========================= */
const TOPIC_FILTERS = [
  { key: "algebra", label: "Algebra" },
  { key: "geometry", label: "Geometry" },
  { key: "arithmetic", label: "Arithmetic" },
  { key: "number", label: "Number System" },
];

const TOPIC_TESTS = [
  { id: 101, title: "Algebra Test-1", topic: "algebra", questions: 30, marks: 90, minutes: 45, lang: "English" , comingSoon: true },
  { id: 102, title: "Algebra Test-2", topic: "algebra", questions: 30, marks: 90, minutes: 45, lang: "English", comingSoon: true  },
  { id: 103, title: "Geometry Test-1", topic: "geometry", questions: 25, marks: 75, minutes: 40, lang: "English", comingSoon: true  },
  { id: 104, title: "Arithmetic Test-1", topic: "arithmetic", questions: 35, marks: 105, minutes: 50, lang: "English", comingSoon: true  },
  { id: 105, title: "Number System Test-1", topic: "number", questions: 20, marks: 60, minutes: 30, lang: "English", comingSoon: true },
];

/* =========================
   COMPONENT
   ========================= */
const MockTest = () => {
  const navigate = useNavigate();

  // ===== Left hero tabs (syllabus)
  const [activeTab, setActiveTab] = useState("quant");

  // ===== Exam-wise filter state
  const [activeCat, setActiveCat] = useState("all");
  const examFilteredTests = useMemo(() => {
    if (activeCat === "all") return TESTS;
    return TESTS.filter((t) => t.category === activeCat);
  }, [activeCat]);

  // ===== Topic-wise filter state
  const [topicFilter, setTopicFilter] = useState("algebra");
  const topicFilteredTests = useMemo(() => {
    return TOPIC_TESTS.filter((t) => t.topic === topicFilter);
  }, [topicFilter]);

  // ✅ Updated to navigate to /GetInTouch
  const goToContact = () => navigate("/GetInTouch");

  // ===== Auto-scroll for videos =====
  const videosRef = useRef(null);
  useEffect(() => {
    const el = videosRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".video");
    if (!items.length) return;

    let paused = false;
    let timer = null;

    const computeStep = () => {
      const list = el.querySelectorAll(".video");
      if (list.length >= 2) {
        // distance between first two items (includes gap)
        return list[1].offsetLeft - list[0].offsetLeft;
      }
      const style = getComputedStyle(el);
      const gap =
        parseFloat(style.columnGap || style.gap || "0") || 0;
      return (list[0]?.clientWidth || 0) + gap;
    };

    const tick = () => {
      if (paused) return;
      const step = computeStep();
      if (step <= 0) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      let next = el.scrollLeft + step;
      if (next >= maxScroll - 1) next = 0; // loop
      el.scrollTo({ left: next, behavior: "smooth" });
    };

    const start = () => {
      stop();
      timer = setInterval(tick, 3000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
    };

    const pause = () => { paused = true; };
    const resume = () => { paused = false; };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume);

    start();
    return () => {
      stop();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  /* =========================
     FORMSPREE INTEGRATION — Right form
     ========================= */
  const [guide, setGuide] = useState({
    name: "",
    phone: "",
    email: "",
    program: "CAT & OMET",
    mode: "online",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjkaajbr";

  const submitGuide = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("Sending...");

    try {
      const data = new FormData();
      data.append("name", guide.name);
      data.append("phone", guide.phone);
      data.append("email", guide.email);
      data.append("program", guide.program);
      data.append("mode", guide.mode);
      data.append("source", "MockTest page");
      // helpful meta
      data.append("_subject", `Guidance request - ${guide.program} (${guide.mode}) - ${guide.name}`);
      data.append("_replyto", guide.email);
      data.append("_format", "plain");
      data.append("_gotcha", ""); // honeypot

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      let j = {};
      try { j = await res.json(); } catch {}

      if (res.ok) {
        setStatus("✅ Submitted! We'll contact you shortly.");
        alert("✅ Submitted! We'll contact you shortly.");
        setGuide({ name: "", phone: "", email: "", program: "CAT & OMET", mode: "online" });
      } else {
        const msg = `❌ Failed (status ${res.status}) ${j.error || ""}`;
        setStatus(msg);
        alert(msg);
      }
    } catch (err) {
      const msg = `⚠️ Network error: ${String(err)}`;
      setStatus(msg);
      alert(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* ================= HERO + FORM ================ */}
      <div id="page1">
        <div className="mock-container">
          {/* Left Section */}
          <div className="mock-left">
            <p className="tagline">CRACK THE CAT. UNLOCK YOUR DREAM B-School</p>
            <h1 className="heading">
              PAST YEARS' PAPERS
              <br />
              FOR DOWNLOAD
            </h1>
            <p className="description">You can download these papers or attempt them 'here' itself.</p>

            <p className="success-title">The success stories</p>

            <div className="videos" ref={videosRef}>
              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/uENlBxSGf-Q?rel=0&modestbranding=1"
                  title="Success Story 1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>

              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/OcJId_ai8uY?rel=0&modestbranding=1"
                  title="Success Story 2"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>

              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/MOqCTCPKma4?rel=0&modestbranding=1"
                  title="Success Story 3"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>

              {/* NEW: Success Story 4 */}
              <div className="video">
                <iframe
                  src="https://www.youtube.com/embed/KybGz3L5R3A?rel=0&modestbranding=1"
                  title="Success Story 4"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Section — INTEGRATED FORM */}
          <div className="mock-right">
            <h2>Let us guide you!</h2>
            <form className="form-box" onSubmit={submitGuide}>
              {/* Honeypot */}
              <input type="text" name="_gotcha" style={{ display: "none" }} onChange={() => {}} />

              <input
                type="text"
                placeholder="Name"
                name="name"
                value={guide.name}
                onChange={(e) => setGuide({ ...guide, name: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="+91 90197 64495"
                name="phone"
                value={guide.phone}
                onChange={(e) => setGuide({ ...guide, phone: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={guide.email}
                onChange={(e) => setGuide({ ...guide, email: e.target.value })}
                required
              />
              <select
                name="program"
                value={guide.program}
                onChange={(e) => setGuide({ ...guide, program: e.target.value })}
                required
              >
                <option value="CAT & OMET">CAT & OMET</option>
                <option value="OMET">OMET</option>
                <option value="IPMAT/CUET">IPMAT/CUET</option>
                <option value="GMAT">GMAT</option>
              </select>
              <select
                name="mode"
                value={guide.mode}
                onChange={(e) => setGuide({ ...guide, mode: e.target.value })}
                required
              >
                <option value="online">Online</option>
                <option value="Offline">Offline</option>
              </select>
              <button type="submit" disabled={sending}>
                {sending ? "Submitting..." : "Submit"}
              </button>

              {status && (
                <p style={{ marginTop: 8, textAlign: "center", color: "#000" }}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ============== EXAM-WISE: Previous year's Papers ============== */}
      <section className="cat-mock-container">
        <h1 className="page-title">Previous Years' Papers</h1>

        {/* Filters */}
        <div className="tgv-scroll-wrapper">
          <div className="filter-buttons">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={activeCat === c.key ? "active" : ""}
                onClick={() => setActiveCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="test-grid">
          {examFilteredTests.map((test) => (
            <div key={test.id} className={`test-card ${test.comingSoon ? "is-soon" : ""}`}>
              {/* Coming soon overlay */}
              {test.comingSoon && (
                <div className="soon-overlay" role="status" aria-label="Coming soon">
                  <div className="soon-pill">COMING SOON</div>
                </div>
              )}

              <div className="card-inner">
                <div className="test-header">
                  <div className="labels">
                    <span className="label free">Free</span>
                    <span className="label must">Must Attempt</span>
                  </div>

                  <button
                    className="attempt-btn"
                    onClick={() => {
                      if (!test.comingSoon) navigate("/instruction");
                    }}
                    disabled={!!test.comingSoon}
                    aria-disabled={!!test.comingSoon}
                    title={test.comingSoon ? "Coming soon" : "Attempt Now"}
                  >
                    Attempt Now
                  </button>
                </div>

                <h3 className="test-title">{test.title}</h3>

                <div className="test-meta">
                  <span>📘 {test.questions} Questions</span>
                  <span>📊 {test.marks} Marks</span>
                  <span>⏱ {test.minutes} Minutes</span>
                </div>

                <div className="footer">{test.lang}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============== SYLLABUS TABS ============== */}
      <div className="syllabus-container">
        <div className="syllabus-left">
          <h1 className="syllabus-title">CAT 2026 Syllabus</h1>

        <div className="syllabus-tabs-wrapper">
            <div className="syllabus-tabs">
              <button
                className={`tab ${activeTab === "quant" ? "active" : ""}`}
                onClick={() => setActiveTab("quant")}
              >
                CAT 2026 QUANT Syllabus
              </button>
              <button
                className={`tab ${activeTab === "varc" ? "active" : ""}`}
                onClick={() => setActiveTab("varc")}
              >
                CAT 2026 VARC Syllabus
              </button>
              <button
                className={`tab ${activeTab === "dilr" ? "active" : ""}`}
                onClick={() => setActiveTab("dilr")}
              >
                CAT 2026 DILR Syllabus
              </button>
            </div>
          </div>

          {activeTab === "quant" && (
            <>
              <h3 className="section-title">Quant Section in CAT – Topic wise question distribution</h3>
              <div className="responsive-table-container">
                <table className="syllabus-table">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>CAT 2022</th>
                      <th>CAT 2023</th>
                      <th>CAT 2024</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Averages, Ratio & Proportion</td><td>5</td><td>3</td><td>4</td></tr>
                    <tr><td>Profit and Loss, Interest</td><td>3</td><td>2</td><td>2</td></tr>
                    <tr><td>Time, Distance and Work</td><td>1</td><td>2</td><td>2</td></tr>
                    <tr><td>Quadratic & Polynomial Equations</td><td>1</td><td>2</td><td>2</td></tr>
                    <tr><td>Linear Equations & Inequalities</td><td>2</td><td>3</td><td>3</td></tr>
                    <tr><td>Logarithms, Surds & Indices</td><td>1</td><td>0</td><td>2</td></tr>
                    <tr><td>Geometry & Mensuration</td><td>3</td><td>2</td><td>3</td></tr>
                    <tr><td>Number Systems</td><td>3</td><td>2</td><td>2</td></tr>
                    <tr><td>Progressions and Series</td><td>1</td><td>1</td><td>1</td></tr>
                    <tr><td>Functions and Graphs</td><td>1</td><td>0</td><td>2</td></tr>
                    <tr><td>Probability & Combinatorics</td><td>1</td><td>1</td><td>0</td></tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "varc" && (
            <>
              <h3 className="section-title">VARC Section in CAT – Topic wise question distribution</h3>
              <div className="responsive-table-container">
                <table className="syllabus-table">
                  <tbody>
                    <tr><td>Reading Comprehension</td><td>10</td><td>12</td><td>11</td></tr>
                    <tr><td>Para Jumbles</td><td>2</td><td>1</td><td>2</td></tr>
                    <tr><td>Para Summary</td><td>1</td><td>2</td><td>1</td></tr>
                    <tr><td>Odd One Out</td><td>1</td><td>1</td><td>1</td></tr>
                    <tr><td>Grammar/Vocab</td><td>1</td><td>0</td><td>2</td></tr>
                    <tr><td>Critical Reasoning</td><td>3</td><td>2</td><td>3</td></tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "dilr" && (
            <>
              <h3 className="section-title">DILR Section in CAT – Topic wise Sets distribution</h3>
              <div className="responsive-table-container">
                <table className="syllabus-table">
                  <tbody>
                    <tr><td>Bar Graph + Tables</td><td>1</td><td>2</td><td>1</td></tr>
                    <tr><td>Seating Arrangement</td><td>2</td><td>1</td><td>1</td></tr>
                    <tr><td>Games & Tournaments</td><td>1</td><td>1</td><td>1</td></tr>
                    <tr><td>Matrix Arrangement</td><td>1</td><td>0</td><td>1</td></tr>
                    <tr><td>Venn/Set Based</td><td>1</td><td>1</td><td>1</td></tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="syllabus-right">
          <div className="trust-box">
            <div className="mentors">
              <img src={team} alt="Mentors" />
            </div>
            <div className="trust-content">
              <h3>Why Students Trust TathaGat</h3>
              <p className="trust-desc">
                Since 2007, TathaGat has helped thousands crack exams like CAT, XAT, GMAT, and SNAP with expert mentors,
                concept-focused learning, and personalized guidance in small batches.
              </p>
              <ul className="side-benefits">
                <li>Personalized Attention</li>
                <li>Concept-driven class</li>
                <li>Practice Session</li>
                <li>Doubts And Discussion</li>
                <li>Mentors With 99+ Percentiles</li>
                <li>Real-Time Strategy</li>
                <li>Workshops</li>
              </ul>
              <div className="support-box">
                <h4>24*7 Support</h4>
                <p>
                  TathaGat offers unlimited one-on-one doubt sessions, live class doubt resolution, and round-the-clock
                  assistance, ensuring no query goes unanswered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============== TOPIC-WISE: Previous Years' Questions ============== */}
      <div className="cat-mock-container">
        <h1 className="page-title">Topic-Wise Previous Years' Questions</h1>

        <div className="filter-buttons-wrapper">
          <div className="filter-buttons">
            {TOPIC_FILTERS.map((t) => (
              <button
                key={t.key}
                className={topicFilter === t.key ? "active" : ""}
                onClick={() => setTopicFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="test-grid">
          {topicFilteredTests.map((test) => (
            <div key={test.id} className={`test-card ${test.comingSoon ? "is-soon" : ""}`}>
              {test.comingSoon && (
                <div className="soon-overlay" role="status" aria-label="Coming soon">
                  <div className="soon-pill">COMING SOON</div>
                </div>
              )}

              <div className="card-inner">
                <div className="test-header">
                  <div className="labels">
                    <span className="label free">Free</span>
                    <span className="label must">Must Attempt</span>
                  </div>
                  <button
                    className="attempt-btn"
                    onClick={() => {
                      if (!test.comingSoon) navigate("/instruction");
                    }}
                    disabled={!!test.comingSoon}
                    aria-disabled={!!test.comingSoon}
                    title={test.comingSoon ? "Coming soon" : "Attempt Now"}
                  >
                    Attempt Now
                  </button>
                </div>

                <h3 className="test-title">{test.title}</h3>
                <div className="test-meta">
                  <span>📘 {test.questions} Questions</span>
                  <span>📊 {test.marks} Marks</span>
                  <span>⏱ {test.minutes} Minutes</span>
                </div>
                <div className="footer">{test.lang}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============== INFO + COURSE CTA ============== */}
      <div className="cat-info-container">
        <div className="tm-left-section">
          <section className="section">
            <h2>What is CAT?</h2>
            <p>
              The Common Admission Test (CAT) is India’s most prestigious management entrance exam, conducted annually by
              the Indian Institutes of Management (IIMs). It is the gateway to more than 20 IIMs and hundreds of top-tier
              B-Schools like FMS Delhi, MDI Gurgaon, SPJIMR Mumbai, and IMT Ghaziabad.
            </p>
            <p>
              CAT tests your aptitude in areas that are critical for success in management — logical reasoning,
              quantitative thinking, verbal skills, and data interpretation. It doesn’t just measure academic knowledge; it
              evaluates decision-making under time pressure — a crucial skill for future managers.
            </p>
          </section>

          <section className="section">
            <h2>Why CAT Matters</h2>
            <div className="benefits">
              <div className="benefit-box">
                🎓 Gateway to Top B-Schools:<br />
                <span>CAT scores are accepted by 1000+ institutions including all IIMs.</span>
              </div>
              <div className="benefit-box">
                💼 Lucrative Career Paths:<br />
                <span>B-school placements lead to high-paying roles in consulting, finance, marketing, and leadership.</span>
              </div>
              <div className="benefit-box">
                🌐 National Recognition:<br />
                <span>CAT scores are trusted across India as a standard of excellence.</span>
              </div>
              <div className="benefit-box">
                🚀 Life-Changing Opportunity:<br />
                <span>
                  A good CAT score can open doors to premier education, global networking, and leadership training.
                </span>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Why Solve CAT Previous Year Papers?</h2>
            <p>
              Solving CAT previous year papers is one of the most effective strategies for facing the exam. These papers
              provide a real-time glimpse into the exam’s structure, difficulty level, and question trends, helping
              aspirants develop familiarity with the actual CAT format. They allow students to identify recurring
              concepts, high-weightage topics, and the level of logical reasoning expected by the examiners.
            </p>
            <p>
              More importantly, attempting these papers under timed conditions builds crucial exam temperament—enhancing
              speed, accuracy, and time management. Post-analysis of previous year questions also helps uncover weak
              areas, refine problem-solving strategies, and boost confidence.
            </p>
          </section>

          <section className="section">
            <h2>Mock Tests: Your Key to CAT Success</h2>
            <p>
              Mock tests play a critical role in CAT preparation. They replicate the actual exam environment, helping
              students build endurance, manage time efficiently, and test conceptual clarity. Attempting full-length mocks
              and section-wise tests regularly enables aspirants to experiment with different strategies and find what
              works best.
            </p>
            <p>
              Detailed performance analysis after each mock test helps track progress, identify gaps, and fine-tune
              preparation. It’s not just about practice—mock tests train the mind to stay sharp, calm, and confident under
              pressure.
            </p>
          </section>
        </div>

        <div className="tm-right-section">
          <div className="ta-course-card">
            <h3>
              CAT 2026
              <br />
              Advance Course
            </h3>
            <ul className="ta-highlights">
              <li>700 hrs Live Classes</li>
              <li>LOD 1, 2 3 & other</li>
              <li>24 x 7 Doubt solving</li>
              <li>50 Mocks on OMETs with complete solution</li>
              <li>30 Mocks tests with complete solution</li>
              <li>45 sectional Tests with complete solutions</li>
              <li>Printed books</li>
            </ul>
            <div className="course-buttons">
              {/* ✅ Both buttons now go to /GetInTouch */}
              <button className="enquire-btn" onClick={goToContact}>
               Enquiry Form
              </button>
              <button className="proceed-btn" onClick={goToContact}>
                Checkout Page
              </button>
            </div>
          </div>

          <div className="series-list">
            <h4>Other Packages</h4>
            <ul>
              <li>CAT + OMET 2025/2026 ONLINE COURSE </li>
              <li>CAT + OMET 2025/2026 OFFLINE COURSE </li>
              <li>WORKSHOPS</li>
              <li>TEST SERIES</li>
              <li>BOOKS + TEST SERIES</li>
            </ul>
          </div>
        </div>
      </div>
      <Chatbox/>
    </>
  );
};

export default MockTest;
