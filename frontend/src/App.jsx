import "./App.css";
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [quizResult, setQuizResult] = useState("");
  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState("");

  return (
    <div>
      <header className="navbar">
        <div className="logo">LifeShield</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#learn">Learn</a>
          <a href="#check">Check</a>
          <a href="#quiz">Quiz</a>
           <a href="#tips">Safety Tips</a>
        </nav>

        <button className="login-btn">Log in</button>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="eyebrow">DIGITAL SAFETY, MADE SIMPLE</p>

            <h1>
              <div>Understand.</div>
              <div>Detect.</div>
              <div>Stay Safe.</div>
            </h1>

            <p className="hero-text">
              Learn how to recognize online scams, phishing attempts,
              suspicious links, and common privacy risks — in simple language.
            </p>

            <div className="hero-buttons">
              <a href="#learn" className="primary-btn">
                Start Learning
              </a>

              <a href="#check" className="secondary-btn">
                Check a Message
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="shield-icon">🛡️</div>

            <h2>Your digital safety companion.</h2>

            <p>
              Practical knowledge and simple checks to help you make safer
              decisions online.
            </p>
          </div>
        </section>

        <section id="learn" className="section learn-section">
          <p className="eyebrow">LEARN</p>

          <h2>Know the warning signs.</h2>

          <p className="section-intro">
            Build your digital safety knowledge through simple, practical
            lessons.
          </p>

          <div className="learn-grid">
            <div className="learn-card">
              <div className="card-number">01</div>
              <h3>Phishing</h3>
              <p>
                Learn how fake emails, messages, and websites try to trick you
                into giving away information.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">02</div>
              <h3>Online Scams</h3>
              <p>
                Understand common online scams and the warning signs that can
                help you recognize them.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">03</div>
              <h3>Suspicious Links</h3>
              <p>
                Learn what to look for before clicking links received through
                emails, messages, or social media.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">04</div>
              <h3>Privacy</h3>
              <p>
                Learn simple ways to protect your personal information and
                understand what you share online.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">05</div>
              <h3>Password Safety</h3>
              <p>
                Understand why strong, unique passwords matter and how to
                protect your important accounts.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">06</div>
              <h3>Social Engineering</h3>
              <p>
                Learn how attackers use trust, urgency, and persuasion to
                influence people's online decisions.
              </p>
            </div>
          </div>
        </section>

        <section id="check" className="section check-section">
          <p className="eyebrow">CHECK</p>

          <h2>Not sure about a message?</h2>

          <p className="section-intro">
            Paste a suspicious message below and learn what warning signs to
            look for.
          </p>

          <div className="checker-box">
            <label htmlFor="message">Paste your message</label>

            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: Your account has been selected for a reward. Click the link below to claim it..."
              rows="8"
            ></textarea>

            <button
              className="primary-btn"
              onClick={async () => {
                if (message.trim() === "") {
                  setResult("Please paste a message first.");
                  return;
                }

                try {
                  const response = await fetch(
                    "http://127.0.0.1:8000/api/check-message",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        message: message,
                      }),
                    }
                  );

                  const data = await response.json();

                  setResult(data.message);
                } catch {
                  setResult(
                    "Unable to connect to the LifeShield server."
                  );
                }
              }}
            >
              Check Message
            </button>

            {result && <p className="check-result">{result}</p>}
          </div>

          {/* URL CHECKER */}

          <div className="checker-box url-checker">
            <label htmlFor="url">Check a suspicious URL</label>

            <p className="section-intro">
              Paste a website address below to look for common warning signs.
            </p>

            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Example: http://example.com/login"
            />

            <button
              className="primary-btn"
              onClick={async () => {
                if (url.trim() === "") {
                  setUrlResult("Please enter a URL first.");
                  return;
                }

                try {
                  const response = await fetch(
                    "http://127.0.0.1:8000/api/check-url",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        url: url,
                      }),
                    }
                  );

                  const data = await response.json();

                  setUrlResult(data.message);
                } catch {
                  setUrlResult(
                    "Unable to connect to the LifeShield server."
                  );
                }
              }}
            >
              Check URL
            </button>

            {urlResult && <p className="check-result">{urlResult}</p>}
          </div>
        </section>
                <section id="tips" className="section tips-section">
          <p className="eyebrow">SAFETY TIPS</p>

          <h2>Small habits, safer online.</h2>

          <p className="section-intro">
            Follow these simple habits to protect yourself from common online
            threats.
          </p>

          <div className="learn-grid">
            <div className="learn-card">
              <div className="card-number">01</div>
              <h3>Pause Before You Click</h3>
              <p>
                Don't rush when a message creates urgency. Check the sender
                and link before clicking.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">02</div>
              <h3>Protect Your OTP</h3>
              <p>
                Never share OTPs, passwords, or verification codes with
                someone who asks for them unexpectedly.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">03</div>
              <h3>Check the Website</h3>
              <p>
                Look carefully at the website address before entering personal
                or account information.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">04</div>
              <h3>Use Strong Passwords</h3>
              <p>
                Use different, strong passwords for important accounts and
                avoid sharing them with others.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">05</div>
              <h3>Think Before You Share</h3>
              <p>
                Be careful about sharing personal information, photos, and
                account details online.
              </p>
            </div>

            <div className="learn-card">
              <div className="card-number">06</div>
              <h3>Verify Unexpected Requests</h3>
              <p>
                If someone asks for money or sensitive information, verify the
                request through a trusted channel.
              </p>
            </div>
          </div>
        </section>

        <section id="quiz" className="section quiz-section">
          <p className="eyebrow">QUIZ</p>

          <h2>Test what you know.</h2>

          <p className="section-intro">
            Can you recognize a suspicious online message?
          </p>

          <div className="quiz-card">
            <p className="quiz-question">
              You receive a message saying:
              <br />
              <strong>
                "URGENT! Your account will be closed today. Click here to
                verify."
              </strong>
            </p>

            <p className="quiz-prompt">What should you do?</p>

            <div className="quiz-options">
              <button
                className="quiz-option"
                onClick={() =>
                  setQuizResult(
                    "❌ Not quite. Don't click an unexpected link immediately."
                  )
                }
              >
                Click the link immediately
              </button>

              <button
                className="quiz-option"
                onClick={() =>
                  setQuizResult(
                    "✅ Correct! Checking for warning signs first is a safer choice."
                  )
                }
              >
                Check the message for warning signs first
              </button>

              <button
                className="quiz-option"
                onClick={() =>
                  setQuizResult(
                    "❌ Not quite. Don't forward suspicious messages to others."
                  )
                }
              >
                Forward it to everyone you know
              </button>
            </div>

            {quizResult && <p className="quiz-result">{quizResult}</p>}
          </div>
        </section>
      </main>

      <footer>
        <p>© 2026 LifeShield. Stay aware. Stay safe.</p>
      </footer>
    </div>
  );
}

export default App;