const fs = require("fs");

console.log("Starting high CPU utilization script...");

// Logging function that writes to a file to simulate disk activity
function logToFile(message) {
  fs.appendFileSync("cpu_log.txt", `${new Date().toISOString()} - ${message}\n`);
}

// CPU-intensive function
function highCpuTask() {
  let count = 0;
  while (true) {
    count++;
    if (count % 1e9 === 0) {
      const msg = `Heavy computation in progress... Count: ${count}`;
      console.log(msg);
      logToFile(msg);
    }
  }
}

// Run the CPU-intensive task in a separate process
highCpuTask();
