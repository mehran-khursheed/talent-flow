// Import the 'toast' function from react-hot-toast

// NOTE: Assuming you have 'react-hot-toast' installed:
// npm install react-hot-toast

/**
 * Simulates random errors (5-10% chance)
 * @param {Function} callback - The actual route handler
 * @returns {Function} Wrapped handler with error injection
 */
export function withErrorSimulation(callback) {
  return function(schema, request) {
    const errorRate = Math.random();
    
    // 5-10% chance of error (let's use 7%)
    // Changed the condition from errorRate == 0.05 (unreliable) to a range (reliable 7% chance)
    if (errorRate < 0.06) { 
      console.warn('🔴 Simulated API Error');
       return new Response(500,{ message: "Simulated network failure" });
    }
    
    // Normal execution
    return callback(schema, request);
  };
}

/**
 * Generates random latency between 200-1200ms
 */
export function getRandomLatency() {
  return Math.floor(Math.random() * (1200 - 200 + 1)) + 200;
}