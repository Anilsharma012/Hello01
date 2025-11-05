import React, { useState, useEffect } from "react";
import "./Faq.css";
import faqImage from "../../images/faqOne.png";
import { useNavigate } from "react-router-dom";
import Chatbox from "../../components/Chat/Chatbox";
import FAQ from "../../components/FAQ/FAQ";

// 🟦 Category-wise FAQs
const FAQ_DATA = {
  "Course & Curriculum": [
    { question: "What courses does TathaGat offer?", answer: "We offer preparation for CAT, XAT, SNAP, GMAT, CUET and other entrance exams with concept classes, practice sessions, workshops, strategy sessions and doubt discussions." },
    { question: "What makes TathaGat different from other institutes?", answer: "Personalized mentorship, small batch sizes, annually updated content, and structured pedagogy focused on fundamentals + application." },
    { question: "Is the course beginner-friendly?", answer: "Yes. We start from basics, cover fundamentals thoroughly, and then move to advanced level application and mocks." },
    { question: "Can I switch batches or upgrade my course later?", answer: "Yes, batch change/upgrade is possible subject to availability and policy guidelines. Speak to your counselor for details." },
  ],
  "Tests & Practice": [
    { question: "Do you provide full-length mocks and sectionals?", answer: "Yes, you get full-length mocks, sectionals, topic tests and previous-year papers with detailed analytics and solutions." },
    { question: "How is my performance tracked?", answer: "Your performance dashboard shows accuracy, speed, topic-wise strengths/weaknesses, and improvement trends." },
    { question: "Are solutions and video explanations available?", answer: "Yes, every test comes with solutions; many have detailed video explanations and shortcuts." },
    { question: "How often are tests updated?", answer: "We regularly update tests to reflect latest exam patterns and difficulty levels." },
  ],
  "Mentoring & Support": [
    { question: "How are doubt sessions conducted?", answer: "Unlimited 1-to-1 doubt sessions (by slot), live discussion classes, and Telegram groups for quick help." },
    { question: "Do you provide PI-WAT-GD guidance?", answer: "Yes, we conduct interview workshops, SOP reviews, resume polishing, and mock interviews with feedback." },
    { question: "How can I track my progress with mentors?", answer: "Mentor check-ins + analytics reviews are scheduled to align your strategy with your goals and timelines." },
    { question: "Is there study planning and time-table support?", answer: "Yes, mentors create personalized study plans and weekly targets based on your profile and availability." },
  ],
  "Enrollment & Payment": [
    { question: "How do I enroll at TathaGat?", answer: "Choose a package on the website and pay online, or contact our counselors for enrollment assistance." },
    { question: "What payment modes are accepted?", answer: "UPI, cards, net-banking, and EMI options (where available). Offline payment at centers is also supported." },
    { question: "Do you offer refunds or transfers?", answer: "Policies vary by program and attempt cycle. Please review the latest policy or speak to support before enrolling." },
    { question: "Can I access recorded lectures after enrollment?", answer: "Yes, you get access to recorded sessions for revision and catch-up throughout your course validity." },
  ],
};

// 🟦 Build "All Category" by merging all categories
const ALL_FAQS = Object.values(FAQ_DATA).flat();

const TABS = [
  "All Category",
  "Course & Curriculum",
  "Tests & Practice",
  "Mentoring & Support",
  "Enrollment & Payment",
];

const Faq = () => {
  const [openIndexTop, setOpenIndexTop] = useState(null);
  const [openIndexBottom, setOpenIndexBottom] = useState(null);
  const [activeTab, setActiveTab] = useState("All Category");

  // 🔵 Ask form (left form) state – Formspree integration
  const [ask, setAsk] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();

  // Reset opened indices when tab changes
  useEffect(() => {
    setOpenIndexTop(null);
    setOpenIndexBottom(null);
  }, [activeTab]);

  // ESC to close modal (kept for future popups)
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && null;
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const toggleTop = (index) => {
    setOpenIndexTop(openIndexTop === index ? null : index);
  };
  const toggleBottom = (index) => {
    setOpenIndexBottom(openIndexBottom === index ? null : index);
  };

  const faqsForActiveTab =
    activeTab === "All Category" ? ALL_FAQS : FAQ_DATA[activeTab] || [];

  // 👉 Bottom (GENERAL FAQS) should show only first 5
  const faqsForGeneral = faqsForActiveTab.slice(0, 5);

  // ✅ Submit handler: Still have a question? → Formspree + alert
  const submitAsk = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      const data = new FormData();
      data.append("name", ask.name);
      data.append("email", ask.email);
      data.append("message", ask.message);
      data.append("source", "FAQ page (Still have a question)");

      // helpful meta
      data.append("_subject", `FAQ question from ${ask.name}`);
      data.append("_replyto", ask.email);
      data.append("_format", "plain");
      // honeypot (spam guard)
      data.append("_gotcha", "");

      const res = await fetch("https://formspree.io/f/xjkaajbr", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      let j = {};
      try { j = await res.json(); } catch {}

      if (res.ok) {
        alert("✅ Submitted! We'll contact you shortly.");
        setAsk({ name: "", email: "", message: "" });
      } else {
        alert(`❌ Failed (status ${res.status}) ${j.error || ""}`);
      }
    } catch (err) {
      alert(`⚠️ Network error: ${String(err)}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="tf-faq-wrapper">
        <h2 className="tf-faq-title">
          Got Questions ?<br />
          We’ve Got Answers!
        </h2>
        <p className="tf-faq-subtitle">
          Everything You Need to Know Before You Begin Your Journey with TathaGat
        </p>

        {/* 🔵 Tabs */}
        <div className="tf-faq-tabs">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              className={`tf-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 🔵 FAQ List (full list for the selected tab) */}
        <div className="tf-faq-list">
          {faqsForActiveTab.map((faq, index) => (
            <div key={`${activeTab}-top-${index}`} className="tf-faq-item">
              <div className="tf-faq-questions" onClick={() => toggleTop(index)}>
                <span>
                  {index + 1}. {faq.question}
                </span>
                <span className="tf-faq-icon">
                  {openIndexTop === index ? "−" : "+"}
                </span>
              </div>
              {openIndexTop === index && (
                <div className="tf-faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
          {faqsForActiveTab.length === 0 && (
            <div className="tf-faq-empty">No questions found for this category.</div>
          )}
        </div>
      </div>

      {/* Trust / Stats Section */}
      <div className="tf-trust-section">
        <div className="tf-trust-left">
          <h2 className="tf-trust-title">India’s Most Trusted Coaching Institute</h2>
          <p className="tf-trust-tagline">
            At TathaGat, trust is not a claim — it’s a commitment we’ve earned through
            unwavering integrity, consistent results, and student-first mentorship.
          </p>
          <p className="tf-trust-description">
            For over a decade, we’ve mentored thousands of aspirants across CAT, XAT,
            SNAP, IIFT, TISSNET and more — with a unique mix of conceptual clarity,
            expert mentorship and personalized attention.
          </p>
          <button
            className="tf-trust-button"
            type="button"
            onClick={() => navigate("/Testimonial")}
          >
            See Our Achievement
          </button>
        </div>

        <div className="tf-trust-right">
          <div className="tf-trust-card">
            <h1 className="tf-stat-value">10,000+</h1>
            <h3 className="tf-stat-title">Students Trained Across India</h3>
            <p className="tf-stat-description">
              From fresh grads to working professionals — we’ve guided thousands toward
              their MBA dreams.
            </p>
          </div>
          <div className="tf-trust-card">
            <h1 className="tf-stat-value">1000+</h1>
            <h3 className="tf-stat-title">IIM Calls Every Year</h3>
            <p className="tf-stat-description">
              Structured prep, mocks, and strategy sessions drive consistent results.
            </p>
          </div>
        </div>
      </div>

      {/* Form + Telegram */}
      <div className="tf-section-wrapper">
        {/* Left: Form (Formspree + alert) */}
        <div className="tf-form-box">
          <h2 className="tf-form-title">Still have a question?</h2>
          <form className="tf-form" onSubmit={submitAsk}>
            {/* Honeypot */}
            <input type="text" name="_gotcha" style={{ display: "none" }} onChange={() => {}} />

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="tf-input"
              value={ask.name}
              onChange={(e) => setAsk({ ...ask, name: e.target.value })}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="tf-input"
              value={ask.email}
              onChange={(e) => setAsk({ ...ask, email: e.target.value })}
              required
            />
            <textarea
              name="message"
              placeholder="Type your question here..."
              className="tf-textarea"
              value={ask.message}
              onChange={(e) => setAsk({ ...ask, message: e.target.value })}
              required
            />
            <button type="submit" className="tf-submit-btn" disabled={sending}>
              {sending ? "Submitting..." : "Submit Your Question"}
            </button>
          </form>
        </div>

        {/* Right: Telegram Box */}
        <div className="tf-telegram-box" style={{ backgroundImage: `url(${faqImage})` }}>
          <div className="tf-telegram-overlay">
            <h3 className="tf-telegram-text">
              Join our Free Telegram
              <br />
              Discussion Group!
            </h3>
            <button
              className="tf-telegram-btn"
              type="button"
              onClick={() => window.open("https://t.me/freecatprep", "_blank")}
            >
              Join now
            </button>
          </div>
        </div>
      </div>

      {/* GENERAL FAQS (optional section kept commented) */}
      {/* ... your commented block remains unchanged ... */}

      <FAQ/>
      <Chatbox/>
    </>
  );
};

export default Faq;
