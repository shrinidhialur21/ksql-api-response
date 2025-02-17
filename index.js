const express = require("express");

const app = express();

const PORT = 3000;

let memoryHog = [];

function eatMemory() {
  setInterval(() => {
    const hugeArray = new Array(1e6).fill("memory leak"); // Allocate ~8MB per iteration

    memoryHog.push(hugeArray);

    console.log(`Memory consumed: ${memoryHog.length * 8} MB`);
  }, 100);
}

function burnCPU() {
  console.log("CPU stress started...");

  while (true) Math.sqrt(Math.random()); // Keeps CPU busy
}

app.get("/stress", (req, res) => {
  eatMemory();

  setTimeout(burnCPU, 2000); // Start CPU burn after 2s

  res.send("Started memory & CPU stress...");
});

app.get("/", (req, res) => {
  res.send("Service is running...");
});

app.listen(PORT, () => {
  console.log(`Stress test server running on port ${PORT}`);
});
