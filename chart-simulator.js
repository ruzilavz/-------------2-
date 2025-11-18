
// chart-simulator.js

(function() {
  // Function to simulate a play count increase for a random track
  function simulatePlays() {
    if (window.RELEASED_TRACKS_DATA && window.RELEASED_TRACKS_DATA.length > 0) {
      const trackIndex = Math.floor(Math.random() * window.RELEASED_TRACKS_DATA.length);
      const track = window.RELEASED_TRACKS_DATA[trackIndex];
      
      // Increase plays by a random amount
      const playsIncrease = Math.floor(Math.random() * 5) + 1; // Increase by 1 to 5 plays
      track.plays += playsIncrease;

      // Dispatch a custom event to notify the UI that the chart data has changed
      document.dispatchEvent(new CustomEvent('chartDataUpdated'));
    }
  }

  // Simulate plays every few seconds
  setInterval(simulatePlays, 3000); // Simulate a play every 3 seconds
})();
