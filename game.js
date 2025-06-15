class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.scene = new Scene();
        this.lastTime = 0;
        this.isRunning = false;
        this.fps = 0;
        
        this.initScene();
        this.setupEventListeners();
    }
    
    initScene() {
        // 创建一些3D对象
        const cube = new GameObject(Mesh.createCube(1, '#44f'));
        cube.position.x = -1.5;
        cube.update = (dt) => {
            cube.rotation.y += 0.5 * dt;
            cube.rotation.x += 0.3 * dt;
        };
        
        const pyramid = new GameObject(Mesh.createPyramid(1, '#f44'));
        pyramid.position.x = 1.5;
        pyramid.update = (dt) => {
            pyramid.rotation.y -= 0.5 * dt;
            pyramid.position.y = Math.sin(Date.now() * 0.001) * 0.5;
        };
        
        const floor = new GameObject(Mesh.createCube(10, '#282'));
        floor.position.y = -1.5;
        floor.scale.y = 0.1;
        
        // 添加到场景
        this.scene.addObject(cube);
        this.scene.addObject(pyramid);
        this.scene.addObject(floor);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.renderer.resize());
        
        // 简单的相机控制
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);
    }
    
    updateCamera(deltaTime) {
        const moveSpeed = 2 * deltaTime;
        const rotateSpeed = 0.5 * deltaTime;
        
        // 处理键盘输入
        if (this.keys['w']) this.renderer.cameraPosition.z += moveSpeed;
        if (this.keys['s']) this.renderer.cameraPosition.z -= moveSpeed;
        if (this.keys['a']) this.renderer.cameraPosition.x -= moveSpeed;
        if (this.keys['d']) this.renderer.cameraPosition.x += moveSpeed;
        if (this.keys[' ']) this.renderer.cameraPosition.y += moveSpeed;
        if (this.keys['shift']) this.renderer.cameraPosition.y -= moveSpeed;
        
        // 旋转相机
        if (this.keys['arrowup']) this.renderer.cameraRotation.x += rotateSpeed;
        if (this.keys['arrowdown']) this.renderer.cameraRotation.x -= rotateSpeed;
        if (this.keys['arrowleft']) this.renderer.cameraRotation.y += rotateSpeed;
        if (this.keys['arrowright']) this.renderer.cameraRotation.y -= rotateSpeed;
    }
    
    update(deltaTime) {
        this.updateCamera(deltaTime);
        this.scene.update(deltaTime);
    }
    
    render() {
        this.renderer.clear();
        
        for (let object of this.scene.objects) {
            this.renderer.drawMesh(object.mesh, object.getTransformMatrix());
        }
    }
    
    gameLoop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // 更新FPS
        this.fps = Math.round(1 / deltaTime);
        
        this.update(deltaTime);
        this.render();
        
        document.getElementById('fps').textContent = `FPS: ${this.fps}`;
        
        if (this.isRunning) {
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }
    
    start() {
        this.isRunning = true;
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    stop() {
        this.isRunning = false;
    }
}    