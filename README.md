# ☁️ Floating Prompts App

A modern prompt management application for software engineering teams. Version, test, and deploy AI prompts with confidence.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)

## 🚧 Status

**Frontend Skeleton** - UI components and pages are in place with mock data. Backend API integration coming soon.

## ✨ Features (Planned)

- **📝 Template Versioning** - Git-like version control for prompts
- **🤖 Multi-Model Support** - Test across OpenAI, Anthropic, Google, and more
- **🎮 Interactive Playground** - Experiment with prompts in real-time
- **🌍 Environment Management** - Dev, staging, and production support
- **📊 Analytics** - Track usage, latency, and success rates

## 🎨 Design

- Sky blue / white cloud-inspired theme
- Clean, modern UI with glass morphism effects
- Floating cloud animations
- Fully responsive design

## 🏗️ Project Structure

```
floating-prompts-app/
├── src/
│   ├── backend/              # FastAPI backend (TODO)
│   └── frontend/             # React + TypeScript frontend
│       ├── src/
│       │   ├── api/          # API client (mock)
│       │   ├── components/
│       │   │   └── ui/       # Reusable UI components
│       │   │       ├── Badge.tsx
│       │   │       ├── Button.tsx
│       │   │       ├── Card.tsx
│       │   │       ├── EmptyState.tsx
│       │   │       ├── Input.tsx
│       │   │       └── Modal.tsx
│       │   └── pages/
│       │       ├── Home.tsx
│       │       ├── Templates.tsx
│       │       ├── TemplateDetail.tsx
│       │       ├── Prompts.tsx
│       │       ├── Models.tsx
│       │       └── Playground.tsx
│       ├── index.css         # Tailwind + custom theme
│       └── package.json
├── pyproject.toml
└── README.md
```

## 🚀 Quick Start

### Frontend

```bash
cd src/frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

App available at: http://localhost:5173

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- TailwindCSS v4
- React Query
- React Router
- Lucide Icons

**Backend (Planned):**
- FastAPI
- Pydantic
- uvicorn

## 📦 Dependencies

```bash
# Frontend
npm install react-router-dom @tanstack/react-query axios lucide-react
```

## 🔗 Related Projects

- [floating_prompts](https://github.com/DimitarAtanassov/floating_prompts) - Database layer with SQLAlchemy models and PostgreSQL migrations

## 📄 License

MIT