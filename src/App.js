// Import React hooks: useEffect for side effects and useState for component state.
import { useEffect, useState } from 'react';
// Import the CSS file that styles this component.
import './App.css';
// Import the logo/image asset used in the loading screen.
import eazycare from './media/eazycare.jpg';

// Delay (in milliseconds) between each 1% progress step.
const STEP_DELAY_MS = 40;
// Extra pause duration (in milliseconds) at specific milestone percentages.
const PAUSE_DELAY_MS = 3000;
// Milestone percentages where progress should pause briefly.
const PAUSE_POINTS = new Set([25, 50, 75]);
// Approximate full stroke length used for SVG dash animation math.
const ECG_PATH_LENGTH = 1000;

// Main App component definition.
function App() {
  // State for current loading percentage shown in UI.
  const [progress, setProgress] = useState(0);
  // State that controls whether the "Get Started" button is visible.
  const [showGetStarted, setShowGetStarted] = useState(false);

  // Run loading logic once when component mounts.
  useEffect(() => {
    // Flag used to stop async updates after unmount.
    let isCancelled = false;

    // Async function that simulates loading progress over time.
    const runLoader = async () => {
      // Count from 1 to 100 to simulate percentage-based loading.
      for (let next = 1; next <= 100; next += 1) {
        // Exit early if component has unmounted.
        if (isCancelled) {
          // Stop the loader function immediately.
          return;
        }

        // Wait before applying the next progress update.
        await new Promise((resolve) => {
          // Use setTimeout to create the step delay.
          window.setTimeout(resolve, STEP_DELAY_MS);
        });

        // Re-check cancellation in case unmount happened during wait.
        if (isCancelled) {
          // Stop if component is no longer active.
          return;
        }

        // Update the visible progress value.
        setProgress(next);

        // If current progress is a pause point, wait extra time.
        if (PAUSE_POINTS.has(next)) {
          // Pause at milestone to create staged loading effect.
          await new Promise((resolve) => {
            // Use longer timeout for milestone pause.
            window.setTimeout(resolve, PAUSE_DELAY_MS);
          });
        }
      }
      // Show the button after loading reaches 100%.
      setShowGetStarted(true);
    };

    // Start the loading simulation.
    runLoader();

    // Cleanup runs when component unmounts.
    return () => {
      // Mark as cancelled to prevent state updates after unmount.
      isCancelled = true;
    };
    // Empty dependency array means this effect runs only once.
  }, []);

  // Render the loading screen UI.
  return (
    // Main wrapper container for centered layout.
    <main className="app">
      {/* App logo displayed above the loader row. */}
      <img src={eazycare} alt="EasyCare App" className="logo-image" />

      {/* Row that contains loading label, animated ECG line, and percent. */}
      <div className="loader-row" aria-label="Loading progress">
        {/* Text label indicating loading state. */}
        <span className="loader-label">Loading...</span>

        {/* SVG used to draw the ECG-style loading animation. */}
        <svg className="ecg" viewBox="0 0 600 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ECG loading animation">
          {/* Path line whose visible portion is revealed as progress increases. */}
          <path
            // CSS class for stroke color and width styles.
            className="ecg-line"
            // Dash offset shrinks from full length to zero based on progress.
            style={{ strokeDasharray: ECG_PATH_LENGTH, strokeDashoffset: ECG_PATH_LENGTH - (progress / 100) * ECG_PATH_LENGTH }}
            // The ECG polyline coordinates across the SVG canvas.
            d="M0 40
               L20 40 L30 40 L38 28 L46 52 L54 20 L62 40
               L90 40 L100 40 L108 34 L116 46 L124 40
               L150 40 L160 40 L168 24 L176 56 L184 18 L192 40
               L220 40 L230 40 L238 32 L246 44 L254 40
               L280 40 L290 40 L298 26 L306 54 L314 22 L322 40
               L350 40 L360 40 L368 35 L376 45 L384 40
               L410 40 L420 40 L428 25 L436 55 L444 20 L452 40
               L480 40 L490 40 L498 34 L506 46 L514 40
               L540 40 L600 40"
          />
        </svg>

        {/* Numeric progress text displayed at the end of the row. */}
        <span className="loader-percent">{progress}%</span>
      </div>

      {/* Conditionally render button only when loading is complete. */}
      {showGetStarted && (
        // Action button shown after progress reaches 100%.
        <button className="get-started-btn" type="button">
          {/* Button text shown to the user. */}
          Get Started
        </button>
      )}
    </main>
  );
}

// Export App so it can be rendered by the root entry file.
export default App;
