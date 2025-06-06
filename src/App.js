import { useState, useEffect } from "react";
import axios from "axios";
import { FaSun, FaMoon } from "react-icons/fa";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);


  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("summaryHistory"));
    if (savedHistory) setHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("summaryHistory", JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleSummarize = async () => {
    setLoading(true);
    setSummary("");

    try {
      const response = await axios.post(
        "https://summarizer-backend-xgj1.onrender.com/summarize",
        {
          text,
        }
      );

      const result = response.data.summary;

      if (result) {
        setSummary(result);
      } else {
        setSummary("لم يتم التوصل إلى ملخص. جرب نصًا مختلفًا.");
      }
    } catch (error) {
      console.error("Error while fetching summary:", error);
      setSummary("حدث خطأ أثناء التلخيص. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error("فشل في قراءة الحافظة:", err);
      alert("لا يمكن الوصول إلى الحافظة. تأكد من السماح بالحافظة.");
    }
  };

  const handleReset = () => {
    setText("");
    setSummary("");
    setCopied(false);
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  return (
    <div className={`container ${theme}`}>
      <div className="box">
        {/* زر الوضع الليلي/النهاري */}
        <div className="theme-toggle">
          <button
            onClick={toggleTheme}
            className="button theme"
            style={{ color: "#00bcd4" }}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <h1 className="title">AI Article Summarizer</h1>

        {/* زر اللصق */}
        <div className="paste-wrapper">
          <button onClick={handlePaste} className="button paste">
            📋 لصق من الحافظة
          </button>
        </div>

        {/* حقل إدخال المقال */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="أدخل المقال هنا أو الصق نصًا..."
          rows="8"
          className="textarea"
        />

        {/* زر مسح النص */}
        <div className="button-group">
          <button onClick={handleReset} className="button clear">
            🗑️ مسح النص
          </button>
        </div>

        {/* زر التلخيص */}
        <div className="button-group">
          <button onClick={handleSummarize} className="button summarize">
            🔍 تلخيص
          </button>
        </div>

        {/* التحميل */}
        {loading && <div className="loader">جاري التلخيص...</div>}

        {/* الملخص */}
        {summary && (
          <div className="summary">
            <h2>الملخص:</h2>
            <p>{summary}</p>

            {/* زر النسخ */}
            <div className="copy-wrapper">
              <button onClick={handleCopy} className="button copy">
                📄 نسخ الملخص
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
