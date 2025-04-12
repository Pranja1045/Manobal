import React, { useState, useEffect, useRef } from "react";
import { generateIntrusiveThoughts, getPositiveResponse } from "./Components/chat";
import "./App.css";

function App() {
  const [bubbles, setBubbles] = useState([]);
  // Create a ref to store timeouts for each bubble
  const timeoutRefs = useRef({});

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      // Clear all active timeouts when component unmounts
      Object.values(timeoutRefs.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  // Load initial intrusive thoughts
  useEffect(() => {
    async function loadThoughts() {
      const thoughts = await generateIntrusiveThoughts();
      console.log("Generated Thoughts:", thoughts); // Debugging
      setBubbles(thoughts.map((thought, index) => ({ id: index, text: thought, clicked: false })));
    }
    loadThoughts();
  }, []);

  const handleBubbleClick = async (id, text) => {
    console.log(`Clicked Thought: ${text}`);

    // Clear any existing timeout for this bubble to prevent multiple actions
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
    }

    const response = await getPositiveResponse(text);
    console.log(`Received Positive Response: ${response}`);

    if (!response || response.includes("6 intrusive thoughts")) {
      console.error("Invalid Response from API");
      return;
    }

    // Step 1: Show positive response and mark as clicked
    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) =>
        bubble.id === id ? { ...bubble, text: response, clicked: true } : bubble
      )
    );

    // Step 2: Store the timeout ID in our ref for tracking
    timeoutRefs.current[id] = setTimeout(async () => {
      const newThoughts = await generateIntrusiveThoughts();
      const newThought = newThoughts[0]; // Get one new intrusive thought
      console.log("New Thought After Bursting:", newThought);

      setBubbles((prevBubbles) =>
        prevBubbles
          .filter((bubble) => bubble.id !== id) // Remove the old bubble
          .concat({ id: Math.random(), text: newThought, clicked: false }) // Add a new thought
      );
      
      // Clean up the timeout reference after it's completed
      delete timeoutRefs.current[id];
    }, 5000);
  };

  return (
    <div className="App">
      <h1>Manage Your Anxiety</h1>
      <p>Click a thought bubble to reveal a response.</p>
      <div className="bubble-container">
        {bubbles.map(({ id, text, clicked }) => (
          <div
            key={id}
            className={`bubble ${clicked ? "burst" : ""}`}
            onClick={() => handleBubbleClick(id, text)}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
