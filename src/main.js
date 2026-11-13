import './style.css';
import { Experience } from './scene/Experience.js';

const canvas = document.querySelector('canvas.webgl');
const experience = new Experience(canvas);

// Clean up on Vite hot reload so you don't stack renderers
if (import.meta.hot) {
  import.meta.hot.dispose(() => experience.dispose());
}
