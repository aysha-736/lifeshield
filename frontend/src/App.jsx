import "./App.css";
import { useEffect, useState } from "react";

function App() {
const [message, setMessage] = useState("");
const [result, setResult] = useState("");
const [quizResult, setQuizResult] = useState("");
const [url, setUrl] = useState("");
const [urlResult, setUrlResult] = useState("");

const [showLogin, setShowLogin] = useState(false);
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loginResult, setLoginResult] = useState("");
const [currentUser, setCurrentUser] = useState(null);

const [showRegister, setShowRegister] = useState(false);
const [registerName, setRegisterName] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
const [registerResult, setRegisterResult] = useState("");

const [dashboardData, setDashboardData] = useState({
messages_checked: 0,
urls_checked: 0,
});

return ( <div> <header className="navbar"> <div className="logo">LifeShield</div>

```
    <nav>
      <a href="#home">Home</a>
      <a href="#learn">Learn</a>
      <a href="#check">Check</a>
      <a href="#quiz">Quiz</a>
      <a href="#tips">Safety Tips</a>
      <a href="#about">About</a>
    </nav>

    <button
      className="login-btn"
      onClick={() => {
        setShowLogin(true);
        setLoginResult("");
      }}
    >
      Log in
    </button>
  </header>

  {/* LOGIN */}
  {showLogin && (
    <div className="login-overlay">
      <div className="login-card">
        <button
          className="login-close"
          onClick={() => setShowLogin(false)}
        >
          ×
        </button>

        <p className="eyebrow">LIFESHIELD ACCOUNT</p>

        <h2>Welcome back.</h2>

        <p className="section-intro">
          Log in to continue using LifeShield.
        </p>

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <button
          className="primary-btn"
          onClick={async () => {
            if (!loginEmail.trim() || !loginPassword.trim()) {
              setLoginResult("Please enter your email and password.");
              return;
            }

            try {
              const response = await fetch(
                "http://127.0.0.1:8000/api/login",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                  }),
                }
              );

              const data = await response.json();

            if (data.success) {
  setCurrentUser(data.user);
  setShowLogin(false);
  setLoginResult("");
}
               else {
                setLoginResult(data.message);
              }
            } catch {
              setLoginResult(
                "Unable to connect to the LifeShield server."
              );
            }
          }}
        >
          Log in
        </button>

        {loginResult && (
          <p className="check-result">{loginResult}</p>
        )}

        <button
          className="secondary-btn"
          onClick={() => {
            setShowLogin(false);
            setShowRegister(true);
            setRegisterResult("");
          }}
        >
          Create an Account
        </button>
      </div>
    </div>
  )}

  {/* REGISTER */}
  {showRegister && (
    <div className="login-overlay">
      <div className="login-card">
        <button
          className="login-close"
          onClick={() => setShowRegister(false)}
        >
          ×
        </button>

        <p className="eyebrow">LIFESHIELD ACCOUNT</p>

        <h2>Create your account.</h2>

        <p className="section-intro">
          Create an account to start using LifeShield.
        </p>

        <label htmlFor="register-name">Name</label>
        <input
          id="register-name"
          type="text"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
          placeholder="Enter your name"
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          placeholder="At least 6 characters"
        />

        <button
          className="primary-btn"
          onClick={async () => {
            if (
              !registerName.trim() ||
              !registerEmail.trim() ||
              !registerPassword.trim()
            ) {
              setRegisterResult("Please fill in all fields.");
              return;
            }

            try {
              const response = await fetch(
                "http://127.0.0.1:8000/api/register",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: registerName,
                    email: registerEmail,
                    password: registerPassword,
                  }),
                }
              );

              const data = await response.json();

              setRegisterResult(data.message);

              if (data.success) {
                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
              }
            } catch {
              setRegisterResult(
                "Unable to connect to the LifeShield server."
              );
            }
          }}
        >
          Create Account
        </button>

        {registerResult && (
          <p className="check-result">{registerResult}</p>
        )}

        <button
          className="secondary-btn"
          onClick={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  )}

  <main>
    {currentUser && (
  <section className="dashboard-section">
    <div className="dashboard-header">
      <p className="eyebrow">LIFESHIELD DASHBOARD</p>

      <h2>Welcome, {currentUser.name} 👋</h2>

      <p className="section-intro">
        Your personal space for learning and staying safer online.
      </p>
    </div>

    <div className="dashboard-grid">
      <div className="dashboard-card">
        <div className="card-number">01</div>
        <h3>Messages Checked</h3>
        <p>0</p>
      </div>

      <div className="dashboard-card">
        <div className="card-number">02</div>
        <h3>URLs Checked</h3>
        <p>0</p>
      </div>

      <div className="dashboard-card">
        <div className="card-number">03</div>
        <h3>Learning Progress</h3>
        <p>0%</p>
      </div>
    </div>
  </section>
)}
    {/* HOME */}
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

    {/* LEARN */}
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

    {/* CHECK */}
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

    {/* SAFETY TIPS */}
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

    {/* QUIZ */}
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

        {quizResult && (
          <p className="quiz-result">{quizResult}</p>
        )}
      </div>
    </section>

    {/* ABOUT */}
    <section id="about" className="section about-section">
      <p className="eyebrow">ABOUT LIFESHIELD</p>

      <h2>Understand. Detect. Stay Safe.</h2>

      <p className="section-intro">
        LifeShield is a digital safety awareness platform designed to
        help everyday users recognize common online threats and make
        safer decisions online.
      </p>

      <div className="learn-grid">
        <div className="learn-card">
          <div className="card-number">01</div>
          <h3>Learn</h3>
          <p>
            Understand phishing, scams, suspicious links, privacy risks,
            and social engineering in simple language.
          </p>
        </div>

        <div className="learn-card">
          <div className="card-number">02</div>
          <h3>Check</h3>
          <p>
            Use simple rule-based checks to identify common warning signs
            in messages and website addresses.
          </p>
        </div>

        <div className="learn-card">
          <div className="card-number">03</div>
          <h3>Stay Safe</h3>
          <p>
            Build safer digital habits and learn what to do when something
            online feels suspicious.
          </p>
        </div>
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
