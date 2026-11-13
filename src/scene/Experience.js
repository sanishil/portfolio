import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Experience {
  constructor(canvas) {
    this.canvas = canvas;
    this.sizes = { width: window.innerWidth, height: window.innerHeight };
    this.clock = new THREE.Clock();

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100);
    this.camera.position.set(3, 2, 5);
    this.scene.add(this.camera);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;

    // Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;

    this.#setupWorld();

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    this.renderer.setAnimationLoop(() => this.tick());
  }

  #setupWorld() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(4, 6, 3);
    sun.castShadow = true;
    this.scene.add(ambient, sun);

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x4f8cff, roughness: 0.4, metalness: 0.2 })
    );
    this.cube.castShadow = true;
    this.cube.position.y = 0.75;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0x1a1d24 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    this.scene.add(this.cube, floor);
  }

  onResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  tick() {
    const elapsed = this.clock.getElapsedTime();
    this.cube.rotation.y = elapsed * 0.5;
    this.cube.rotation.x = elapsed * 0.25;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('resize', this.onResize);
    this.controls.dispose();
    this.scene.traverse((obj) => {
      obj.geometry?.dispose();
      if (obj.material) [].concat(obj.material).forEach((m) => m.dispose());
    });
    this.renderer.dispose();
  }
}
