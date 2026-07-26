# CrimeLens AI: Strategic Crime Intelligence & Analytical Platform

**Moving Beyond Manual Records:** _An advanced predictive policing and risk management platform built for the Karnataka State Police (KSP) Datathon 2026._

---

## Problem Statement: The Challenge Facing KSP & SCRB

The Karnataka State Police (KSP) and State Crime Records Bureau (SCRB) maintain extensive crime records capturing incidents, offenders, and locations. However, the current analytical ecosystem faces critical operational hurdles:

- **Data Silos & Manual Processes:** Crime records are heavily managed in independent silos, relying on static Excel-based reporting rather than integrated, automated systems.
- **Lack of Advanced Analytics:** Traditional reporting lacks AI-driven approaches, leaving deeper behavioral patterns, spatiotemporal trends, and interconnected criminal networks undiscovered.
- **Information Gaps:** The SCRB receives limited, fragmented information, hindering comprehensive state-wide analysis.
- **Reactive vs. Proactive Policing:** Operations remain largely reactive; without systematic exploration of emerging trends, investigators lack evidence-based tools for proactive prevention.

---

**Datathon Submission** | [Live Demo](https://crimelensai-60079484267.development.catalystserverless.in/app/#/app/)

---

## The Solution: Core Capabilities & Algorithmic Architecture

CrimeLens AI transforms raw incident data into actionable intelligence, converting the SCRB into a **Strategic Intelligence Hub**.

### 1. Sociological & AI-Driven Predictive Risk Engine

- **Supervised Naive Bayes Classifier:** Deploys a probabilistic machine learning model via backend APIs (`/server/api/predict-risk`) to forecast potential high-risk crime typologies for target sectors.
- **Euclidean Centroid Spatial Mapping:** Detects AI hotspots by computing distance metrics ($d = \sqrt{(\Delta\text{lat})^2 + (\Delta\text{lng})^2}$) between crime coordinates and primary cluster centroids to map high-density risk zones to specific districts.
- **Empirical Frequency Fallback Engine:** Features a smart frontend algorithm that calculates the local statistical mode (highest-frequency incident type) across filtered historical district data whenever backend datasets are sparse.
- **Emerging Trend Indicators:** Automatically calculates volume percentages and triggers high-visibility alert feeds when a crime category spikes relative to historical baselines.

### 2. Criminological Network & Link Analysis

- **Relationship Mapping:** Uses force-directed graph theory (`react-force-graph-2d`) to connect fragmented nodes—linking Suspect Aliases (`susp_`), District Locations (`loc_`), and Crime Event IDs.
- **Repeat Offender & Association Tracking:** Uncovers hidden criminal networks and cross-jurisdictional Modus Operandi (MO) that are impossible to spot in isolated Excel sheets.

### 3. Advanced Geospatial & Statistical Analytics

- **District-Level Drill-Down:** Interactive OpenStreetMap integration (`react-leaflet`) allowing the SCRB to map crime clusters across districts and specific station limits.
- **Dynamic Color Spectrum Generation:** Utilizes a mathematical HSL color-wheel distribution algorithm ($H = (index \cdot \frac{360}{N}) \pmod{360}$) to dynamically separate crime categories visually on Doughnut charts.
- **Automated Intelligence Briefings:** Intercepts system state and cluster metrics to generate standardized, one-click PDF briefings (`jsPDF` & `autoTable`) for police command review.

---

## Complete Technology Stack

| Domain                 | Technology / Library           | Task & Functional Purpose                                                               |
| :--------------------- | :----------------------------- | :-------------------------------------------------------------------------------------- |
| **Framework**          | React                          | Single Page Application (SPA) architecture                                              |
| **Routing**            | React Router v7                | Seamless client-side navigation (`/app/`, `/analytics`, `/map`, `/network`, `/reports`) |
| **Styling**            | Custom Modular CSS (`App.css`) | Fully mobile-responsive layout (Flexbox/Grid), custom dark-mode threat widgets          |
| **Geospatial Mapping** | Leaflet & React-Leaflet        | Map rendering, coordinate plotting, interactive popups, and tile layers                 |
| **Link Analysis**      | React-Force-Graph-2D           | Physics-based force-directed graph for criminal network mapping                         |
| **Data Analytics**     | Chart.js & React-Chartjs-2     | Dynamic Bar charts (district breakdown) and Doughnut charts (category distribution)     |
| **Export Engine**      | jsPDF & jsPDF-AutoTable        | Client-side official PDF report generation and tabular data formatting                  |
| **UI Components**      | Lucide React                   | Tactical UI iconography (Crosshair, AlertTriangle, LayoutDashboard, etc.)               |
| **Backend / ML**       | Zoho Catalyst & Naive Bayes    | Serverless APIs, predictive risk classification, and web client hosting                 |

---

## Setup and Execution Instructions

Follow these instructions to run the CrimeLens AI prototype locally or deploy it to Zoho Catalyst.

### Prerequisites

1. **Node.js:** Ensure Node.js (v18+) is installed.
2. **Zoho Catalyst CLI:** Install the Catalyst CLI globally:
   ```bash
   npm install -g zcatalyst-cli
   ```

_Datathon 2026_
