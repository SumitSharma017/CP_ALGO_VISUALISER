import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [steps,setSteps] = useState([
    {type:"visit",node:1},
    {type:"visit",node:2},
    {type:"visit",node:3},
  ]);
  const [currentStep,setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      console.log(steps[currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, speed]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <div style={{ width: "20%", borderRight: "1px solid black" }}>
        <h2>Controls</h2>
        
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={() => {setIsRunning(false),setCurrentStep(0)}}>Reset</button>

        <p>Status: {isRunning ? "Running" : "Paused"}</p>
        <input
          type="range"
          min="100"
          max="1000"
          value={speed}
          onChange={(e)=>setSpeed(e.target.value)}
        />
        <p>Speed : {speed} ms</p>
      </div>

      <div style={{ width: "60%" }}>
        <h2>Canvas Area</h2>
      </div>

      <div style={{ width: "20%", borderLeft: "1px solid black" }}>
        <h2>Info</h2>
      </div>

    </div>
  );
}

export default App;