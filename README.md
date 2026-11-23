# Partwerk — Volume tests

Single static page (`index.html`, copy of the Partwerk Android parts shop demo): product catalog with filters, cart
drawer, checkout and order confirmation. Cart state is kept in `localStorage`. No backend, no login.

This folder automates the TestGraph suite **"Volume Test" → "Volume 1"** (project "Bench - QA Cluster") with QACluster.

Run locally: `python3 -m http.server 4180` → http://localhost:4180/#shop
