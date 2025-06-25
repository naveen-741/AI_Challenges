# 3D Model Viewer

A modern web application for viewing and manipulating 3D models in GLB format. Built with React, Three.js, and Vite.

## Features

- Load and view multiple GLB files simultaneously
- Drag-and-drop file upload support
- Interactive 3D scene with OrbitControls
- Model manipulation (position, rotation, scale)
- Wireframe toggle for each model
- Animation support for models with animations
- Model metadata display (meshes, materials, vertices)
- Dark/light mode toggle
- Responsive design with Tailwind CSS

## Project Structure

```
3d-model-viewer/
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.tsx
│   │   ├── ModelControls.tsx
│   │   ├── ModelViewer.tsx
│   │   └── SceneControls.tsx
│   ├── types/
│   │   └── model.ts
│   ├── App.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd 3d-model-viewer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Click the upload button or drag and drop GLB files into the viewer
2. Use the mouse to interact with the 3D scene:
   - Left click + drag to rotate
   - Right click + drag to pan
   - Scroll to zoom
3. Use the controls panel to:
   - Toggle wireframe mode
   - Adjust model position, rotation, and scale
   - Play animations (if available)
   - Remove models from the scene
   - Toggle dark/light mode

## Technologies Used

- React 18
- TypeScript
- Three.js
- @react-three/fiber
- @react-three/drei
- Vite
- Tailwind CSS
- Lucide React (icons)

## Development

### Key Dependencies

```json
{
  "dependencies": {
    "@react-three/drei": "^9.x",
    "@react-three/fiber": "^8.x",
    "lucide-react": "^0.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "three": "^0.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@types/three": "^0.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "tailwindcss": "^3.x",
    "typescript": "^5.x",
    "vite": "^5.x"
  }
}
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## License

MIT
