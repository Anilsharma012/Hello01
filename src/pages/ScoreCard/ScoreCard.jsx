import React, { useState } from "react";
import "./ScoreCard.css";
import nameOne from "../../images/1.png";
import nameTwo from "../../images/2.png";
import scorcardone from "../../images/scoreCard/99.72.png";
import scorcardTwo from "../../images/scoreCard/99.57.png";
import scorcardThree from "../../images/scoreCard/99.54.png";
import scorecardfour from "../../images/scoree.jpg";
import scorcardfive from "../../images/scoreCard/99.15.png";
import scorcardsix from "../../images/scoreCard/99.png";
import scorcardseven from "../../images/scoreCard/98.55.png";
import scorcardeight from "../../images/scoreCard/97.98.png";
import scorcardnine from "../../images/scoreCard/97.85.png";
import scorcardTen from "../../images/scoreCard/97.77.png";
import scorcardelewen from "../../images/scoreCard/97.53.png";
import scorcardtewlen from "../../images/scoreCard/97.39.png";
import scorcardThirty from "../../images/scoreCard/97.18.png";
import scorcardfourty from "../../images/scoreCard/97.04.png";
import scorcardfifty from "../../images/scoreCard/96.72.png";
import scorcardsixty from "../../images/scoreCard/96.58.png";
import scorcardseventy from "../../images/scoreCard/96.51.png";
import scorecardeighty from "../../images/scoreCard/95.85.png";
import scorecardninty from "../../images/scoreCard/95.32.png";
import scorecardtwenty from "../../images/scoreCard/95.27.png";
import scorecardetwentyone from "../../images/scoreCard/95.16.png";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import successtwo from "../../images/success-two.PNG";
import successthree from "../../images/success-three.PNG";
import successfour from "../../images/success-four.PNG";
import successfive from "../../images/success-five.PNG";

import review1 from "../../images/Review/R1.PNG";
import review2 from "../../images/Review/R2.PNG";
import review3 from "../../images/Review/R3.PNG";
import review4 from "../../images/Review/R4.PNG";
import review5 from "../../images/Review/R5.PNG";
import review6 from "../../images/Review/R6.PNG";
import review7 from "../../images/Review/R7.PNG";
import review8 from "../../images/Review/R8.PNG";
import review9 from "../../images/Review/R9.PNG";
import review10 from "../../images/Review/R10.PNG";
import review11 from "../../images/Review/R1.PNG";
import review12 from "../../images/Review/R2.PNG";
import Chatbox from "../../components/Chat/Chatbox";

const scorecardData = [
  { name: "Abhishek Kumar", percentile: "99.06%", photo: nameOne, scorecard: scorcardone },
  { name: "Riya Sharma", percentile: "98.45%", photo: nameTwo, scorecard: scorcardTwo },
  { name: "Mohit Jain", percentile: "99.89%", photo: nameOne, scorecard: scorcardThree },
  { name: "Abhishek Kumar", percentile: "99.06%", photo: nameOne, scorecard: scorcardfive },
  { name: "Riya Sharma", percentile: "98.45%", photo: nameTwo, scorecard: scorcardsix },
  { name: "Mohit Jain", percentile: "99.89%", photo: nameOne, scorecard: scorcardseven },
  { name: "Abhishek Kumar", percentile: "99.06%", photo: nameOne, scorecard: scorcardeight },
  { name: "Riya Sharma", percentile: "98.45%", photo: nameTwo, scorecard: scorcardnine },
  { name: "Mohit Jain", percentile: "99.89%", photo: nameOne, scorecard: scorcardTen },
  { name: "Abhishek Kumar", percentile: "99.06%", photo: nameOne, scorecard: scorcardelewen },
  { name: "Riya Sharma", percentile: "98.45%", photo: nameTwo, scorecard: scorcardtewlen },
  { name: "Mohit Jain", percentile: "99.89%", photo: nameOne, scorecard: scorcardThirty },
  { name: "Abhishek Kumar", percentile: "99.06%", photo: nameOne, scorecard: scorcardfourty },
  { name: "Riya Sharma", percentile: "98.45%", photo: nameTwo, scorecard: scorcardfifty },
  { name: "Mohit Jain", percentile: "99.89%", photo: nameOne, scorecard: scorcardsixty },
  { name: "Riya Sharma", percentile: "98.45%", photo: nameTwo, scorecard: scorcardseventy },
  { name: "Prananjal Singh", percentile: "95.85%", photo: nameOne, scorecard: scorecardeighty },
  { name: "Riya Sharma", percentile: "98.45%", photo: nameTwo, scorecard: scorecardninty },
  { name: "Mohit Jain", percentile: "99.89%", photo: nameOne, scorecard: scorecardtwenty },
  { name: "Riya Sharma", percentile: "98.45%", photo: nameTwo, scorecard: scorecardetwentyone },
];

const testimonials = [
  { name: "Gourav Sharma", score: "CAT 99.8%ile", image: successtwo, message: "I studied at TathaGat back in 2014. TG exceeded my expectations...", author: "Prabhat Ralhan", stars: 5 },
  { name: "Pranjal Malhotra", score: "CAT 99.6%ile", image: successthree, message: "The study materials were comprehensive and well-structured...", author: "Prabhat Ralhan", stars: 5 },
  { name: "Shivam Sharma", score: "CAT 99.7%ile", image: successfour, message: "Faculty were exceptionally knowledgeable and experienced...", author: "Prabhat Ralhan", stars: 5 },
  { name: "Amit Raj", score: "CAT 99.7%ile", image: successfive, message: "Faculty were exceptionally knowledgeable and experienced...", author: "Prabhat Ralhan", stars: 5 },
  { name: "Gourav Sharma", score: "CAT 99.8%ile", image: successtwo, message: "I studied at TathaGat back in 2014. TG exceeded my expectations...", author: "Prabhat Ralhan", stars: 5 },
];

const feedbackImages = [review1, review2, review3, review4, review5, review6, review7, review8, review9, review10, review11, review12];

const ScoreCard = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleImages = showAll ? feedbackImages : feedbackImages.slice(0, 6);

  const [visibleData, setVisibleData] = useState(scorecardData);

  // ✅ Demo form state
  const [demo, setDemo] = useState({
    name: "",
    email: "",
    track: "Quant",
    date: "",
  });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  const handleFilter = (type) => {
    if (type === "All") setVisibleData(scorecardData);
    else if (type === "99") setVisibleData(scorecardData.slice(0, 5));
    else if (type === "98") setVisibleData(scorecardData.slice(5, 6));
    else if (type === "97") setVisibleData(scorecardData.slice(6, 13));
    else if (type === "95") setVisibleData(scorecardData.slice(13, 18));
  };

  // ✅ Formspree submission for "Reserve Your Demo Spot"
  const submitDemo = async (e) => {
    e.preventDefault();
    setSending(true);
    setMsg("Sending...");

    try {
      const data = new FormData();
      data.append("name", demo.name);
      data.append("email", demo.email);
      data.append("track", demo.track);
      data.append("date", demo.date);

      // helpful meta
      data.append("_subject", `Demo request (${demo.track}) - ${demo.name}`);
      data.append("_replyto", demo.email);
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
        setMsg("✅ Reserved! We'll email you the details.");
        setDemo({ name: "", email: "", track: "Quant", date: "" });
      } else {
        setMsg(`❌ Failed (status ${res.status}) ${j.error || ""}`);
      }
    } catch (err) {
      setMsg(`⚠️ Network error: ${String(err)}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="scorecard-wrapper">
        <div className="scorecard-content">
          <div className="scorecard-heading">
            <h1>TathaGat Scorecard Wall</h1>
            <p>
              See how our students have performed in <strong>CAT, XAT, SNAP</strong> & more!
            </p>
          </div>
          <div className="scorecard-cards">
            <div className="card-box">
              <div className="card-title">500+</div>
              <div className="card-text">students scored 99+ percentile in CAT 2024</div>
            </div>
            <div className="card-box">
              <div className="card-title">98%ILE</div>
              <div className="card-text">scored by 90% students from Toppers'Batch of 120+ Toppers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="scorecard-wrapper">
        <div className="scorecard-content">
          <div className="scorecard-filters">
            <button onClick={() => handleFilter("All")}>All</button>
            <button onClick={() => handleFilter("99")}>99% +</button>
            <button onClick={() => handleFilter("98")}>98% +</button>
            <button onClick={() => handleFilter("97")}>97% +</button>
            <button onClick={() => handleFilter("95")}>95% +</button>
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: "700" }}>3000 + students</p>
          </div>
        </div>

        <div className="scorecard-grid">
          {visibleData.map((card, index) => (
            <div className="student-card small" key={index}>
              <LazyLoadImage effect="blur" src={card.scorecard} alt={`Scorecard ${index + 1}`} className="student-scorecard" />
            </div>
          ))}
        </div>
      </section>

      <div className="tss-demo-wrapper">
        {/* Left: Testimonials */}
        <div className="tss-demo-left">
          <h2 className="tss-demo-heading">
            Attend A Live Demo Class – <br /> For Free!
          </h2>
          <p className="tss-demo-subtext">Experience our teaching style, methods, and mentors before you decide.</p>

          <div className="tss-scrolling-wrapper">
            <div className="tss-scrolling-track">
              {testimonials.map((t, i) => (
                <div key={i} className="tss-testimonial-card">
                  <div className="tss-testimonial-content">
                    <div className="tss-testimonial-header">
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <h4>{t.name}</h4>
                          <span className="tss-score">{t.score}</span>
                        </div>
                        <LazyLoadImage src={t.image} alt={t.name} effect="blur" className="tss-testimonial-image" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Reserve Your Demo Spot – Formspree-connected */}
        <div className="tss-demo-right">
          <h3>Reserve Your Demo Spot</h3>
          <form className="tss-demo-form" onSubmit={submitDemo}>
            {/* honeypot */}
            <input type="text" name="_gotcha" style={{ display: "none" }} onChange={() => {}} />

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={demo.name}
              onChange={(e) => setDemo({ ...demo, name: e.target.value })}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={demo.email}
              onChange={(e) => setDemo({ ...demo, email: e.target.value })}
              required
            />

            <select
              name="track"
              value={demo.track}
              onChange={(e) => setDemo({ ...demo, track: e.target.value })}
              required
            >
              <option value="Quant">Quant</option>
              <option value="Verbal">Verbal</option>
              <option value="LRDI">LRDI</option>
            </select>

            <input
              type="date"
              name="date"
              placeholder="Preferred Date"
              value={demo.date}
              onChange={(e) => setDemo({ ...demo, date: e.target.value })}
              required
            />

            <button type="submit" disabled={sending}>
              {sending ? "Booking..." : "Reserve Your Spot"}
            </button>

            {msg && <p style={{ marginTop: 8, textAlign: "center" }}>{msg}</p>}
          </form>
        </div>
      </div>

      <div className="tgs-wrapper">
        <div className="tgs-inner">
          <div className="tgs-header">
            <h1 className="tg-heading">TathaGat Toppers' Feedback</h1>
            {!showAll && (
              <button className="tgs-btns" onClick={() => setShowAll(true)}>
                View All
              </button>
            )}
          </div>

          <div className="tgs-grid">
            {visibleImages.map((src, index) => (
              <div key={index} className="tgs-card">
                <LazyLoadImage src={src} alt={`feedback-${index + 1}`} className="tgs-img" />
              </div>
            ))}
          </div>
        </div>
        <Chatbox />
      </div>
    </>
  );
};

export default ScoreCard;
