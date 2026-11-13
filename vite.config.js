import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()], // import .glsl/.vert/.frag shader files directly
  server: { open: true, host: true },
  build: { outDir: 'dist', sourcemap: true, chunkSizeWarningLimit: 1000 },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.exr', '**/*.ktx2'],
});
