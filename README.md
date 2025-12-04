# SkillBridge AI - High Fidelity Prototype

A human-centered AI career navigation tool designed to help mid-career professionals overcome decision paralysis and transition to AI-resistant careers.

**Course:** CS 5170 - Human-Centered AI  
**Author:** Maitreya Darokar  
**Term:** Fall 2025

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed on your machine:

### 1. Node.js (v18 or higher)

**Check if installed:**
```bash
node --version
```

**If not installed:**
- **Mac:** 
  ```bash
  brew install node
  ```
  Or download from: https://nodejs.org/

- **Windows:** 
  Download and install from: https://nodejs.org/

- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```

### 2. npm (comes with Node.js)

**Check if installed:**
```bash
npm --version
```

### 3. Git

**Check if installed:**
```bash
git --version
```

**If not installed:**
- **Mac:** 
  ```bash
  brew install git
  ```
- **Windows:** Download from https://git-scm.com/
- **Linux:** 
  ```bash
  sudo apt install git
  ```

---

## 🚀 Quick Start (5 minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/[username]/skillbridge-ui.git
```

### Step 2: Navigate to Project Directory

```bash
cd skillbridge-ui
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- Vite (build tool)
- Tailwind CSS v4
- Lucide React (icons)

### Step 4: Start the Development Server

```bash
npm run dev
```

### Step 5: Open in Browser

The terminal will display a local URL. Open it in your browser:

```
➜  Local:   http://localhost:5173/
```

**Ctrl+Click** (or **Cmd+Click** on Mac) the URL to open it directly.

---

## 📁 Project Structure

```
skillbridge-ui/
├── public/                 # Static assets
├── src/
│   ├── App.jsx            # Main React component (all UI code)
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind CSS imports
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── postcss.config.js      # PostCSS configuration for Tailwind
└── README.md              # This file
```

---

## 🎯 Features to Explore

### Home Page
- **Two Career Pathways:** QA Analyst → Software Engineer, Data Analyst → ML Engineer
- **Progress Tracking:** Visual progress bars for each pathway
- **Active Constraints Display:** Shows current budget/time/learning style filters

### Sidebar (Desktop) / Bottom Sheet (Mobile)
- **Budget Slider:** $0 (Free Only) to $500/month
- **Weekly Hours Slider:** 5-40 hours/week
- **Learning Style Toggle:** Visual, Reading, or Hands-on

### Pathway View
- **Step Cards:** Expandable cards with progress rings
- **"Why This Step?" Button:** Explainability feature showing data-backed reasoning
- **"I'm Struggling" Button:** Co-adaptation feature that switches to alternative resources
- **ROI Tags:** FREE, PROJECT-BASED, CERTIFICATION, HIGH DEMAND, etc.
- **Feedback Section:** For user input on resource quality

### Responsive Design
- **Desktop:** Full sidebar with all controls
- **Mobile:** Bottom navigation + slide-up constraints panel

---

## 🛠️ Troubleshooting

### Issue: `npm install` fails

**Solution:** Clear npm cache and retry:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Issue: Port 5173 already in use

**Solution:** Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

### Issue: Styles not loading (black & white UI)

**Solution:** Ensure Tailwind is properly configured:

1. Check `postcss.config.js` exists with:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

2. Check `src/index.css` contains:
```css
@import "tailwindcss";
```

3. Restart the dev server:
```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Issue: Module not found errors

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Testing Responsive Design

To test mobile view in your browser:

1. Open Developer Tools (F12 or Cmd+Option+I on Mac)
2. Click the "Toggle Device Toolbar" icon (or Ctrl+Shift+M)
3. Select a mobile device preset or resize manually

---

## 🎨 Design Decisions

This prototype implements three key design patterns derived from user research:

| Pattern | Research Origin | Implementation |
|---------|-----------------|----------------|
| **Navigator (vs. Aggregator)** | "don't know" paralysis (36,858 mentions) | Single linear pathway, no overwhelming choices |
| **Trust & Transparency** | Quality/Trust gap cluster | ROI tags, "Why this step?" explainability |
| **Free-First Bias** | Cost barriers cluster | Budget slider defaults to $0, free resources prioritized |

---

## 📚 Related Documentation

- [Project Presentation (PDF)](./docs/presentation.pdf)
- [User Research Findings](./docs/research.pdf)
- [MVP Pathways Data](./docs/pathways.pdf)

---

## ⚙️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 💻 Tested On

- macOS Tahow (M4 MacBook)
- Windows 11
- Ubuntu 22.04
- Chrome, Firefox, Safari (latest versions)

---

## 📧 Contact

If you encounter any issues running this prototype, please contact:

**Maitreya Darokar**  
Email: maitreya.mmd@gmail.com

---

## 📄 License

This project is submitted as coursework for CS 5170 at Northeastern University.