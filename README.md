# ResQGrid – Disaster Relief & Local Response Coordination Platform

ResQGrid is a real-time disaster relief coordination platform designed to bridge the gap between affected individuals and ground-level volunteers during natural disasters and emergencies.

When traditional emergency lines get overwhelmed, ResQGrid enables rapid, location-aware matching and transparent tracking to reduce response times and save lives.

---

## Problem Statement

During natural disasters (floods, earthquakes, fires), official emergency response channels often become overloaded or fragmented. Victims are left without real-time visibility into whether help is coming, while local volunteers lack a unified platform to identify nearby high-priority distress calls and coordinate rescue operations.

### The Solution

ResQGrid provides a dual-sided, crisis-focused interface:

* **Victim Side:** Quickly submit structured help requests and track live progress across 5 distinct lifecycle stages.
* **Volunteer Side:** Discover nearby emergency calls, filter by priority level, inspect distress details, and accept/manage field tasks.

---

## Features

### Victim Portal

* **Clean Emergency Dashboard:** Immediate access to critical actions.
* **Structured Help Request:** Capture essential data:
* Name & Contact details
* Location / GPS coordinates
* Emergency Type (Medical, Evacuation, Food/Water, Shelter, Fire)
* Priority Level (High, Medium, Low)
* Number of people affected & Description
* Attachment / Photo uploads


* **Live Status Tracker:** Transparent step-by-step progress (Submitted -> Accepted -> Volunteer Assigned -> Help Arriving -> Completed).

### Volunteer Portal

* **Interactive Field Dashboard:** Overview of active crisis metrics and nearby requests.
* **Priority Visual Indicators:** High-severity requests highlighted with emergency badges for instant triaging.
* **Task Management:** Inspect detailed distress cards, accept/reject assignments, and update task statuses in real time.

---

## Frontend Tech Stack

* **Core Framework:** React 18 + Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router v6
* **HTTP Client:** Axios (API placeholders for backend integration)
* **Icons:** Lucide React

---

## Project Structure

```text
RESQGRID/
├── BackEnd/                         # Backend APIs & Server (Ashwin Thakur)
│   ├── config/                      # Server & DB configurations
│   ├── controllers/                 # SOS, shelter capacity, and user role handlers
│   ├── models/                      # Database schemas (Victim, Volunteer, NGO, Admin)
│   ├── routes/                      # REST API endpoint definitions
│   └── server.js                    # Primary server entry point
│
├── core_security_and_logic/         # Data, Security & Spatial Services
│   ├── location_intel/              # Geolocation & Spatial Queries (Rajit Acharya)
│   │   ├── proximity_search.js      # Nearest volunteer-to-SOS matching
│   │   └── spatial_queries.js       # PostGIS / GeoJSON location queries
│   │
│   └── security_and_priority/       # Data Engine & Encryption (Akshat Muchhala)
│       ├── priority_scorer.py       # Priority-based resource allocation logic
│       ├── encryption_utils.py      # User data encryption & hashing
│       └── system_logger.py         # Audit & activity logging
│
├── Docs/                            # Project Documentation & Pitch (Swara Kalekar)
│   ├── architecture_diagrams/       # System & workflow diagrams
│   ├── presentation_report.pdf      # Project report & slides
│   ├── test_cases.md                # QA bug testing checklist
│   └── demo_script.md               # Presentation & demo script
│
└── FrontEnd/                        # Client Web Applications
    ├── public/
    └── src/
        ├── assets/                  # Logos, hero images, & static icons
        ├── components/
        │   ├── victim/              # SOS ping & victim UI (Yashana Gupta)
        │   ├── volunteer/           # Task acceptance & registration UI (Yashana Gupta)
        │   ├── admin_ngo/           # Command dashboard, maps, heatmaps (Samriddhi Shedpure)
        │   └── common/              # Shared UI components
        ├── context/                 # React Contexts (Request & Notification state)
        ├── layouts/                 # Dashboard & navigation layouts
        ├── pages/                   # Application route pages
        ├── routes/                  # App routing configuration (AppRoutes.jsx)
        ├── services/                # Axios API integrations
        └── App.jsx                  # Root React component

```

---

## Getting Started

Follow these steps to run the frontend locally in VS Code:

### 1. Prerequisites

Ensure you have **Node.js** (v18 or higher) installed on your system.

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/ResQGrid.git
cd ResQGrid/FrontEnd

```

### 3. Install Dependencies

```bash
npm install

```

### 4. Run the Development Server

```bash
npm run dev

```

Open your browser and navigate to `http://localhost:5173`.

---

## Future Roadmap

* **Phase 1 (Complete):** Core routing, components, and layout setup.
* **Phase 2 (In Progress):** Form validation, victim status tracking UI, and volunteer task management workflow.
* **Phase 3:** Full REST API integration via Axios with the backend team.
* **Phase 4:** PWA offline capabilities for low-connectivity disaster zones.

---

## Authors & Acknowledgments

* **Project Name:** ResQGrid – Disaster Relief Coordination Platform
* **Frontend Lead:** Developed as part of a 6-member hackathon team.
