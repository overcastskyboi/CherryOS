# Colin Elliott Cherry's OCI Portfolio Stack

This project showcases a full-stack web application hosted on **Oracle Cloud Infrastructure (OCI)**, featuring a live telemetry dashboard and a dynamic portfolio frontend. It demonstrates real-time data integration, robust backend services, and a modern user experience.

## 🚀 Technical Highlights

*   **Infrastructure:** Deployed on an OCI Compute Instance (Oracle Linux 9) with hardened security via Stateful Ingress rules.
*   **Backend (Telemetry API):** A containerized Node.js application (accessible on Port 3000) that exposes real-time system metrics by mapping host `/proc` and `/sys` filesystems.
*   **Orchestration:** Docker Compose manages both the Telemetry API and a Portainer management console for container health and monitoring.
*   **Frontend (Portfolio_Site):** A responsive web interface consuming live telemetry data.
    *   **Data Flow:** Utilizes an `async/fetch` pipeline in `assets/js/app.js` to poll the backend every 10 seconds.
    *   **Server Status:** Features a dynamic "Server Live" status indicator, with automatic "Offline" detection if the API heartbeat is interrupted.
    *   **Terminal Boot Sequence:** An immersive boot-up animation at `index.html` with a smooth transition to the main content once "READY." is displayed.

## 🛠 Directory Structure

*   `docker/telemetry/`: Contains the OCI backend configuration, including Docker Compose files and the Node.js API source.
*   `Portfolio_Site/`: Houses the public-facing frontend application, which consumes data from the live telemetry stream.

## 🚦 Key Features

*   **Live System Metrics:** Displays real-time CPU load, memory usage, disk utilization, and system uptime.
*   **Visual Management:** Integration with Portainer for comprehensive Docker container oversight.
*   **Resilient UI:** Automatic API status detection ensures graceful handling of backend connectivity issues.
*   **Dynamic Boot Experience:** Engaging terminal-style boot animation with a controlled transition to the main portfolio.
*   **Interactive Navigation:** Seamless access to `/hub`, `/systems`, and `/music` sections.
