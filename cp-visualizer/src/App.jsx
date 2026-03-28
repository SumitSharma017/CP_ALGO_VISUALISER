import { useState } from "react";
import { useEffect } from "react";
import GraphCanvas from "../components/GraphCanvas.jsx";
import { generateBFSSteps } from "../algorithms/bfs.js";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [activeEdges, setActiveEdges] = useState([]);


  const graph = { // fixed for now
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1],
    5: [2],
  };

  const nodePositions = { // fixed for now
    0: { x: 300, y: 100 },
    1: { x: 200, y: 200 },
    2: { x: 400, y: 200 },
    3: { x: 150, y: 300 },
    4: { x: 250, y: 300 },
    5: { x: 400, y: 300 },
  };

const handleReset = () => {
  setIsRunning(false);
  setCurrentStep(0);
  setVisitedNodes([]);
  setSteps([]);
  setCurrentAction(null);
};


  function startBFS() {
    const bfsSteps = generateBFSSteps(graph, 0);
    setSteps(bfsSteps);
    setCurrentStep(0);
    setIsRunning(true);
  }


  useEffect(() => {
    if(!isRunning) return;
    if(currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setActiveEdges([]);
      setCurrentAction(steps[currentStep]);
      setCurrentStep((prev) => prev + 1);
      if(steps[currentStep]?.type === "visit") setVisitedNodes((prev) => [...prev, steps[currentStep].node]);
      if(steps[currentStep]?.queue) setCurrentQueue(steps[currentStep].queue);
      if(steps[currentStep]?.type==="enqueue") setActiveEdges((prev)=>[...prev,{from:steps[currentStep].from, to:steps[currentStep].to}]);
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, speed, steps]);



  return (
    <div style={{ display: "flex", height: "100vh" }}>

      <div style={{ width: "20%", borderRight: "1px solid black" }}>
        <h2>Controls</h2>

        <button onClick={() => startBFS()}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={() => handleReset()}>Reset</button>
        

        <p>Status: {isRunning ? "Running" : "Paused"}</p>
        <input
          type="range"
          min="100"
          max="1000"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
        />

        <p>Speed : {speed} ms</p>
      </div>

      <div style={{ width: "60%" }}>
        <h2>Canvas Area</h2>
        <GraphCanvas 
          nodePositions={nodePositions}
          visitedNodes={visitedNodes}
          graph = {graph}
          activeEdges={activeEdges}
        />
      </div>

      <div style={{ width: "20%", borderLeft: "1px solid black" }}>
        <h2>Info</h2>
        <p>Queue:</p>
        <pre>{JSON.stringify(currentQueue)}</pre>
      </div>

    </div>
  );
}

export default App;