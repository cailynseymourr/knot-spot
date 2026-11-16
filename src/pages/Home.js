import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  // If public/images/hero.jpg doesn't exist (yet), show the placeholder instead
  const [heroOk, setHeroOk] = useState(true);

  return (
    <div>
      <section className="hero">
        <div>
          <h1>Every stitch, skein and project in one place</h1>
          <p>
            Save your patterns, keep track of your yarn stash, log your progress,
            and let Knot Spot pick the right yarn and estimate your finish date.
          </p>
          <div className="hero-actions">
            <Link to="/patterns" className="btn btn-primary">
              Browse patterns
            </Link>
            <Link to="/yarn" className="btn btn-secondary">
              Open my yarn stash
            </Link>
          </div>
        </div>

        <div className="hero-frame">
          {heroOk ? (
            <img
              className="hero-image"
              src={`${process.env.PUBLIC_URL}/images/hero.jpg`}
              alt="A bowl of colorful yarn and crochet pieces with a crochet hook"
              onError={() => setHeroOk(false)}
            />
          ) : (
            <div className="hero-placeholder" aria-hidden="true">
              <svg width="120" height="120" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="13" fill="#f8f5fb" stroke="#3b2a4a" strokeWidth="1.5" />
                <path
                  d="M5 13c7 3 15 3 22 0M4 19c8 3 16 3 24 0M10 5c-2 8-2 14 2 22"
                  fill="none"
                  stroke="#b4447a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <Link to="/patterns" className="feature">
          <h3>Patterns</h3>
          <p>Write a pattern row by row or upload one, with the tutorial video beside it.</p>
        </Link>
        <Link to="/yarn" className="feature">
          <h3>Yarn Stash</h3>
          <p>Log every skein with its weight, yardage and a photo.</p>
        </Link>
        <Link to="/progress" className="feature">
          <h3>Progress Tracker</h3>
          <p>Log each session and watch the percentage climb.</p>
        </Link>
        <Link to="/ai" className="feature">
          <h3>AI Insights</h3>
          <p>Get a yarn pick from your stash and an estimated finish date.</p>
        </Link>
      </section>
    </div>
  );
}

export default Home;