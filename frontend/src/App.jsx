import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const [quizResult, setQuizResult] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState(null);

  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginResult, setLoginResult] = useState("");

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("lifeshieldUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("lifeshieldUser");
      return null;
    }
  });

  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerResult, setRegisterResult] = useState("");

  const [dashboardData, setDashboardData] = useState({
    messages_checked: 0,
    urls_checked: 0,
  });

  // Keep the logged-in user after a page refresh.
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("lifeshieldUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("lifeshieldUser");
    }
  }, [currentUser]);

  // Load dashboard data when a user logs in.
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/dashboard/${currentUser.id}`
        );

        const data = await response.json();

        setDashboardData({
          messages_checked: data.messages_checked || 0,
          urls_checked: data.urls_checked || 0,
        });
      } catch {
        console.log("Unable to load dashboard data.");
      }
    };

    loadDashboard();
  }, [currentUser]);

  // Open a lesson and count it only once.
  const openLesson = (lesson) => {
    setSelectedLesson(lesson);

    if (
      lesson.title &&
      !completedLessons.includes(lesson.title)
    ) {
      setCompletedLessons((previous) => [
        ...previous,
        lesson.title,
      ]);
    }
  };

  return (
    <div>
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="navbar">
        <div className="logo">LifeShield</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#learn">Learn</a>
          <a href="#check">Check</a>
          <a href="#quiz">Quiz</a>
          <a href="#tips">Safety Tips</a>
          <a href="#about">About</a>
        </nav>

        {currentUser ? (
          <button
            className="login-btn"
            onClick={() => {
              setCurrentUser(null);
              setCompletedLessons([]);
              setDashboardData({
                messages_checked: 0,
                urls_checked: 0,
              });
              setLoginEmail("");
              setLoginPassword("");
              setLoginResult("");
            }}
          >
            Logout
          </button>
        ) : (
          <button
            className="login-btn"
            onClick={() => {
              setShowLogin(true);
              setLoginResult("");
            }}
          >
            Log in
          </button>
        )}
      </header>

      {/* =========================
          LOGIN
      ========================== */}
      {showLogin && (
        <div className="login-overlay">
          <div className="login-card">
            <button
              className="login-close"
              onClick={() => setShowLogin(false)}
              aria-label="Close login"
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
                if (
                  !loginEmail.trim() ||
                  !loginPassword.trim()
                ) {
                  setLoginResult(
                    "Please enter your email and password."
                  );
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
                    setLoginEmail("");
                    setLoginPassword("");
                  } else {
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
              <p className="check-result">
                {loginResult}
              </p>
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

      {/* =========================
          REGISTER
      ========================== */}
      {showRegister && (
        <div className="login-overlay">
          <div className="login-card">
            <button
              className="login-close"
              onClick={() => setShowRegister(false)}
              aria-label="Close registration"
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
                  setRegisterResult(
                    "Please fill in all fields."
                  );
                  return;
                }

                if (registerPassword.length < 6) {
                  setRegisterResult(
                    "Password must be at least 6 characters."
                  );
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
              <p className="check-result">
                {registerResult}
              </p>
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
        {/* =========================
            DASHBOARD
        ========================== */}
        {currentUser && (
          <section className="dashboard-section">
            <div className="dashboard-header">
              <p className="eyebrow">
                LIFESHIELD DASHBOARD
              </p>

              <h2>
                Welcome, {currentUser.name} 👋
              </h2>

              <p className="dashboard-intro">
                Your personal space for learning and staying
                safer online.
              </p>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-number">01</div>
                <h3>Messages Checked</h3>
                <p>
                  {dashboardData.messages_checked}
                </p>
              </div>

              <div className="dashboard-card">
                <div className="card-number">02</div>
                <h3>URLs Checked</h3>
                <p>
                  {dashboardData.urls_checked}
                </p>
              </div>

              <div className="dashboard-card">
                <div className="card-number">03</div>
                <h3>Learning Progress</h3>
                <p>
                  {Math.round(
                    (completedLessons.length / 6) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =========================
            HOME
        ========================== */}
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              DIGITAL SAFETY, MADE SIMPLE
            </p>

            <h1>
              <span>Understand.</span>
              <span>Detect.</span>
              <span>Stay Safe.</span>
            </h1>

            <p className="hero-text">
              Learn how to recognize online scams, phishing
              attempts, suspicious links, and common privacy
              risks — in simple language.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() =>
                  openLesson({
                    title:
                      "Start Your Digital Safety Journey",
                    badge: "START LEARNING",
                    description:
                      "Begin by learning how to recognize phishing, online scams, suspicious links, privacy risks, and social engineering.",
                    takeaway:
                      "The best way to stay safer online is to understand the warning signs before you interact with something suspicious.",
                  })
                }
              >
                Start Learning
              </button>

              <a
                href="#check"
                className="secondary-btn"
              >
                Check a Message
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="shield-icon">🛡️</div>

            <h2>
              Your digital safety companion.
            </h2>

            <p>
              Practical knowledge and simple checks to
              help you make safer decisions online.
            </p>
          </div>
        </section>

        {/* =========================
            LEARN
        ========================== */}
        <section
          id="learn"
          className="section learn-section"
        >
          <p className="eyebrow">LEARN</p>

          <h2>Know the warning signs.</h2>

          <p className="section-intro">
            Build your digital safety knowledge through
            simple, practical lessons.
          </p>

          <div className="learn-grid">
            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Phishing",
                  description:
                    "Be careful of unexpected messages asking for passwords, OTPs, or personal information.",
                  takeaway:
                    "Unexpected requests for sensitive information deserve extra caution.",
                })
              }
            >
              <div className="card-number">01</div>

              <h3>Phishing</h3>

              <p>
                Learn how fake emails, messages, and
                websites try to trick you into giving away
                information.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Online Scams",
                  description:
                    "Online scams can trick you into sending money, sharing personal information, or clicking unsafe links. Always verify unexpected offers and requests before taking action.",
                  takeaway:
                    "Verify unexpected offers and requests before taking action.",
                })
              }
            >
              <div className="card-number">02</div>

              <h3>Online Scams</h3>

              <p>
                Understand common online scams and the
                warning signs that can help you recognize
                them.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Suspicious Links",
                  description:
                    "Suspicious links may lead to fake websites or harmful content. Check the sender, website address, and destination carefully before clicking.",
                  takeaway:
                    "Check the sender and website address before following an unexpected link.",
                })
              }
            >
              <div className="card-number">03</div>

              <h3>Suspicious Links</h3>

              <p>
                Learn what to look for before clicking
                links received through emails, messages, or
                social media.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Privacy",
                  description:
                    "Protect your personal information by limiting what you share online. Review app permissions and privacy settings regularly.",
                  takeaway:
                    "Share personal information carefully and review privacy settings regularly.",
                })
              }
            >
              <div className="card-number">04</div>

              <h3>Privacy</h3>

              <p>
                Learn simple ways to protect your personal
                information and understand what you share
                online.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Password Safety",
                  description:
                    "Use strong, unique passwords for your accounts. Avoid sharing passwords and consider using a trusted password manager to keep them secure.",
                  takeaway:
                    "Use strong, unique passwords and never share them with others.",
                })
              }
            >
              <div className="card-number">05</div>

              <h3>Password Safety</h3>

              <p>
                Understand why strong, unique passwords
                matter and how to protect your important
                accounts.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Social Engineering",
                  description:
                    "Social engineering tricks people into revealing information or taking unsafe actions. Be cautious of urgent requests, unexpected messages, and people asking for sensitive information.",
                  takeaway:
                    "Be cautious when someone uses urgency or persuasion to request sensitive information.",
                })
              }
            >
              <div className="card-number">06</div>

              <h3>Social Engineering</h3>

              <p>
                Learn how attackers use trust, urgency, and
                persuasion to influence people's online
                decisions.
              </p>
            </button>
          </div>
        </section>

        {/* =========================
            CHECK
        ========================== */}
        <section
          id="check"
          className="section check-section"
        >
          <p className="eyebrow">CHECK</p>

          <h2>Not sure about a message?</h2>

          <p className="section-intro">
            Paste a suspicious message below and learn what
            warning signs to look for.
          </p>

          {/* MESSAGE CHECKER */}
          <div className="checker-box">
            <label htmlFor="message">
              Paste your message
            </label>

            <textarea
              id="message"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Example: Your account has been selected for a reward. Click the link below to claim it..."
              rows="8"
            />

            <button
              className="primary-btn"
              onClick={async () => {
                if (message.trim() === "") {
                  setResult({
                    risk_level: "info",
                    message:
                      "Please paste a message first.",
                    warning_signs: [],
                  });
                  return;
                }

                try {
                  const response = await fetch(
                    "http://127.0.0.1:8000/api/check-message",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type":
                          "application/json",
                      },
                      body: JSON.stringify({
                        message,
                        user_id: currentUser
                          ? currentUser.id
                          : null,
                      }),
                    }
                  );

                  const data = await response.json();

                  setResult(data);

                  if (currentUser) {
                    setDashboardData(
                      (previous) => ({
                        ...previous,
                        messages_checked:
                          previous.messages_checked +
                          1,
                      })
                    );
                  }
                } catch {
                  setResult({
                    risk_level: "error",
                    message:
                      "Unable to connect to the LifeShield server.",
                    warning_signs: [],
                  });
                }
              }}
            >
              Check Message
            </button>

            {result && (
              <div
                className={`check-result-card ${
                  result.risk_level || ""
                }`}
              >
                <div className="check-result-icon">
                  {result.risk_level === "safe"
                    ? "🟢"
                    : result.risk_level ===
                      "warning"
                    ? "🟡"
                    : result.risk_level ===
                      "high_risk"
                    ? "🔴"
                    : "🛡️"}
                </div>

                <div className="check-result-content">
                  <strong>
                    {result.risk_level === "safe"
                      ? "Safe"
                      : result.risk_level ===
                        "warning"
                      ? "Warning"
                      : result.risk_level ===
                        "high_risk"
                      ? "High Risk"
                      : "LifeShield Analysis"}
                  </strong>

                  <p>{result.message}</p>

                  {result.warning_signs &&
                    result.warning_signs.length >
                      0 && (
                      <div className="warning-signs">
                        <strong>
                          Warning signs found:
                        </strong>

                        <ul>
                          {result.warning_signs.map(
                            (sign, index) => (
                              <li key={index}>
                                {sign}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* URL CHECKER */}
          <div className="checker-box url-checker">
            <label htmlFor="url">
              Check a suspicious URL
            </label>

            <p className="url-description">
              Paste a website address below to look for
              common warning signs.
            </p>

            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              placeholder="Example: http://example.com/login"
            />

            <button
              className="primary-btn"
              onClick={async () => {
                if (url.trim() === "") {
                  setUrlResult({
                    risk_level: "info",
                    message:
                      "Please enter a URL first.",
                    warning_signs: [],
                  });
                  return;
                }

                try {
                  const response = await fetch(
                    "http://127.0.0.1:8000/api/check-url",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type":
                          "application/json",
                      },
                      body: JSON.stringify({
                        url,
                        user_id: currentUser
                          ? currentUser.id
                          : null,
                      }),
                    }
                  );

                  const data = await response.json();

                  setUrlResult(data);

                  if (currentUser) {
                    setDashboardData(
                      (previous) => ({
                        ...previous,
                        urls_checked:
                          previous.urls_checked + 1,
                      })
                    );
                  }
                } catch {
                  setUrlResult({
                    risk_level: "error",
                    message:
                      "Unable to connect to the LifeShield server.",
                    warning_signs: [],
                  });
                }
              }}
            >
              Check URL
            </button>

            {urlResult && (
              <div
                className={`check-result-card ${
                  urlResult.risk_level || ""
                }`}
              >
                <div className="check-result-icon">
                  {urlResult.risk_level === "safe"
                    ? "🟢"
                    : urlResult.risk_level ===
                      "warning"
                    ? "🟡"
                    : urlResult.risk_level ===
                      "high_risk"
                    ? "🔴"
                    : "🔗"}
                </div>

                <div className="check-result-content">
                  <strong>
                    {urlResult.risk_level === "safe"
                      ? "Safe URL"
                      : urlResult.risk_level ===
                        "warning"
                      ? "Warning"
                      : urlResult.risk_level ===
                        "high_risk"
                      ? "High Risk URL"
                      : "URL Analysis"}
                  </strong>

                  <p>{urlResult.message}</p>

                  {urlResult.risk_level && (
                    <p className="risk-level">
                      Risk level:{" "}
                      {urlResult.risk_level}
                    </p>
                  )}

                  {urlResult.warning_signs &&
                    urlResult.warning_signs.length >
                      0 && (
                      <div className="warning-signs">
                        <strong>
                          Warning signs found:
                        </strong>

                        <ul>
                          {urlResult.warning_signs.map(
                            (sign, index) => (
                              <li key={index}>
                                {sign}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================
            SAFETY TIPS
        ========================== */}
        <section
          id="tips"
          className="section tips-section"
        >
          <p className="eyebrow">SAFETY TIPS</p>

          <h2>Small habits, safer online.</h2>

          <p className="section-intro">
            Follow these simple habits to protect yourself
            from common online threats.
          </p>

          <div className="learn-grid">
            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title:
                    "Pause Before You Click",
                  description:
                    "Don't rush when a message creates urgency. Take a moment to check the sender, the message, and any link before clicking.",
                  takeaway:
                    "Pause and verify before interacting with unexpected messages.",
                })
              }
            >
              <div className="card-number">01</div>

              <h3>Pause Before You Click</h3>

              <p>
                Don't rush when a message creates urgency.
                Check the sender and link before clicking.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Protect Your OTP",
                  description:
                    "Never share OTPs, passwords, or verification codes with someone who asks for them unexpectedly.",
                  takeaway:
                    "Keep OTPs and verification codes private.",
                })
              }
            >
              <div className="card-number">02</div>

              <h3>Protect Your OTP</h3>

              <p>
                Never share OTPs, passwords, or verification
                codes with someone who asks for them
                unexpectedly.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Check the Website",
                  description:
                    "Look carefully at the website address before entering personal or account information.",
                  takeaway:
                    "Check the website address before entering sensitive information.",
                })
              }
            >
              <div className="card-number">03</div>

              <h3>Check the Website</h3>

              <p>
                Look carefully at the website address before
                entering personal or account information.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Use Strong Passwords",
                  description:
                    "Use different, strong passwords for important accounts and avoid sharing them with others.",
                  takeaway:
                    "Use different strong passwords for important accounts.",
                })
              }
            >
              <div className="card-number">04</div>

              <h3>Use Strong Passwords</h3>

              <p>
                Use different, strong passwords for important
                accounts and avoid sharing them with others.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title: "Think Before You Share",
                  description:
                    "Be careful about sharing personal information, photos, and account details online.",
                  takeaway:
                    "Think carefully before sharing personal information online.",
                })
              }
            >
              <div className="card-number">05</div>

              <h3>Think Before You Share</h3>

              <p>
                Be careful about sharing personal information,
                photos, and account details online.
              </p>
            </button>

            <button
              className="learn-card"
              onClick={() =>
                openLesson({
                  title:
                    "Verify Unexpected Requests",
                  description:
                    "If someone asks for money or sensitive information, verify the request through a trusted channel.",
                  takeaway:
                    "Verify unexpected requests through a trusted channel.",
                })
              }
            >
              <div className="card-number">06</div>

              <h3>Verify Unexpected Requests</h3>

              <p>
                If someone asks for money or sensitive
                information, verify the request through a
                trusted channel.
              </p>
            </button>
          </div>
        </section>

        {/* =========================
            QUIZ
        ========================== */}
        <section
          id="quiz"
          className="section quiz-section"
        >
          <p className="eyebrow">QUIZ</p>

          <h2>Test what you know.</h2>

          <p className="section-intro">
            Can you recognize a suspicious online message?
          </p>

          <div className="quiz-card">
            <div className="quiz-progress">
              <span>Question 1 of 1</span>

              <span>
                Score: {quizScore}/1
              </span>
            </div>

            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{
                  width: quizAnswered
                    ? "100%"
                    : "0%",
                }}
              />
            </div>

            <p className="quiz-question">
              You receive a message saying:
              <br />

              <strong>
                "URGENT! Your account will be closed
                today. Click here to verify."
              </strong>
            </p>

            <p className="quiz-prompt">
              What should you do?
            </p>

            <div className="quiz-options">
              <button
                className="quiz-option"
                disabled={quizAnswered}
                onClick={() => {
                  setQuizResult(
                    "❌ Not quite. Don't click an unexpected link immediately."
                  );
                  setQuizAnswered(true);
                }}
              >
                Click the link immediately
              </button>

              <button
                className="quiz-option"
                disabled={quizAnswered}
                onClick={() => {
                  setQuizScore(1);

                  setQuizResult(
                    "✅ Correct! Checking for warning signs first is a safer choice."
                  );

                  setQuizAnswered(true);
                }}
              >
                Check the message for warning signs
                first
              </button>

              <button
                className="quiz-option"
                disabled={quizAnswered}
                onClick={() => {
                  setQuizResult(
                    "❌ Not quite. Don't forward suspicious messages to others."
                  );

                  setQuizAnswered(true);
                }}
              >
                Forward it to everyone you know
              </button>
            </div>

            {quizResult && (
              <div className="quiz-result-box">
                <p className="quiz-result">
                  {quizResult}
                </p>

                <button
                  className="secondary-btn"
                  onClick={() => {
                    setQuizResult("");
                    setQuizScore(0);
                    setQuizAnswered(false);
                  }}
                >
                  🔄 Try Again
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =========================
            ABOUT
        ========================== */}
        <section
          id="about"
          className="section about-section"
        >
          <p className="eyebrow">
            ABOUT LIFESHIELD
          </p>

          <h2>
            Understand. Detect. Stay Safe.
          </h2>

          <p className="section-intro">
            LifeShield is a digital safety awareness
            platform designed to help everyday users
            recognize common online threats and make safer
            decisions online.
          </p>

          <div className="learn-grid">
            {/* LEARN */}
            <button
              className="learn-card about-card"
              onClick={() =>
                openLesson({
                  title:
                    "Learn About Digital Threats",
                  badge: "START LEARNING",
                  description:
                    "Learn how phishing, scams, suspicious links, privacy risks, and social engineering can affect everyday internet users.",
                  takeaway:
                    "Knowledge is your first layer of digital protection. When you know the warning signs, suspicious activity becomes easier to recognize.",
                })
              }
            >
              <div className="card-number">
                01
              </div>

              <h3>Learn</h3>

              <p>
                Understand phishing, scams, suspicious links,
                privacy risks, and social engineering in simple
                language.
              </p>

              <span className="about-card-link">
                Learn more →
              </span>
            </button>

            {/* CHECK */}
            <button
              className="learn-card about-card"
              onClick={() =>
                openLesson({
                  title:
                    "Check Before You Trust",
                  badge: "STAY ALERT",
                  description:
                    "Before clicking a link or responding to a message, look for signs such as urgency, unusual requests, suspicious links, or requests for sensitive information.",
                  takeaway:
                    "Pause before you click. A few seconds of checking can help you avoid a potentially unsafe online interaction.",
                })
              }
            >
              <div className="card-number">
                02
              </div>

              <h3>Check</h3>

              <p>
                Use simple rule-based checks to identify common
                warning signs in messages and website addresses.
              </p>

              <span className="about-card-link">
                Check safely →
              </span>
            </button>

            {/* STAY SAFE */}
            <button
              className="learn-card about-card"
              onClick={() =>
                openLesson({
                  title:
                    "Build Safer Digital Habits",
                  badge: "SAFETY FIRST",
                  description:
                    "Use strong passwords, keep your software updated, avoid suspicious links, protect personal information, and think carefully before sharing information online.",
                  takeaway:
                    "Good digital safety is built through small habits practiced consistently.",
                })
              }
            >
              <div className="card-number">
                03
              </div>

              <h3>Stay Safe</h3>

              <p>
                Build safer digital habits and learn what to
                do when something online feels suspicious.
              </p>

              <span className="about-card-link">
                Stay protected →
              </span>
            </button>
          </div>
        </section>
      </main>

      {/* =========================
          LEARNING POPUP
      ========================== */}
      {selectedLesson && (
        <div className="lesson-overlay">
          <div className="lesson-popup">
            <button
              className="lesson-close"
              onClick={() =>
                setSelectedLesson(null)
              }
              aria-label="Close lesson"
            >
              ×
            </button>

            <p className="eyebrow">
              LIFESHIELD LESSON
            </p>

            <div className="lesson-badge">
              {selectedLesson.badge ||
                "⚠️ STAY ALERT"}
            </div>

            <h2>
              {selectedLesson.title}
            </h2>

            <p className="lesson-description">
              {selectedLesson.description}
            </p>

            <div className="lesson-takeaway">
              <strong>
                🛡️ Safety takeaway
              </strong>

              <p>
                {selectedLesson.takeaway ||
                  "Pause, verify the information, and avoid sharing sensitive information when something feels suspicious."}
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() =>
                setSelectedLesson(null)
              }
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* =========================
          FOOTER
      ========================== */}
      <footer>
        <p>
          © 2026 LifeShield. Stay aware. Stay safe.
        </p>
      </footer>
    </div>
  );
}

export default App;