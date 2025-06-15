class Mesh {
    constructor() {
        this.vertices = [];
        this.faces = [];
    }
    
    addVertex(x, y, z) {
        this.vertices.push(new Vector3(x, y, z));
    }
    
    addFace(vertexIndices, color) {
        const vertices = vertexIndices.map(index => this.vertices[index]);
        this.faces.push({ vertices, color });
    }
    
    static createCube(size = 1, color = '#666') {
        const mesh = new Mesh();
        const s = size / 2;
        
        // 添加顶点
        mesh.addVertex(-s, -s, -s);
        mesh.addVertex(s, -s, -s);
        mesh.addVertex(s, s, -s);
        mesh.addVertex(-s, s, -s);
        mesh.addVertex(-s, -s, s);
        mesh.addVertex(s, -s, s);
        mesh.addVertex(s, s, s);
        mesh.addVertex(-s, s, s);
        
        // 添加面
        mesh.addFace([0, 1, 2, 3], color); // 前面
        mesh.addFace([1, 5, 6, 2], color); // 右面
        mesh.addFace([5, 4, 7, 6], color); // 后面
        mesh.addFace([4, 0, 3, 7], color); // 左面
        mesh.addFace([3, 2, 6, 7], color); // 上面
        mesh.addFace([4, 5, 1, 0], color); // 下面
        
        return mesh;
    }
    
    static createPyramid(size = 1, color = '#884') {
        const mesh = new Mesh();
        const s = size / 2;
        
        // 添加顶点
        mesh.addVertex(0, s, 0); // 顶部
        mesh.addVertex(-s, -s, s); // 前面左
        mesh.addVertex(s, -s, s); // 前面右
        mesh.addVertex(s, -s, -s); // 后面右
        mesh.addVertex(-s, -s, -s); // 后面左
        
        // 添加面
        mesh.addFace([0, 1, 2], color); // 前面
        mesh.addFace([0, 2, 3], color); // 右面
        mesh.addFace([0, 3, 4], color); // 后面
        mesh.addFace([0, 4, 1], color); // 左面
        mesh.addFace([1, 4, 3, 2], '#442'); // 底面
        
        return mesh;
    }
}

class Scene {
    constructor() {
        this.objects = [];
    }
    
    addObject(object) {
        this.objects.push(object);
    }
    
    update(deltaTime) {
        for (let object of this.objects) {
            if (object.update) {
                object.update(deltaTime);
            }
        }
    }
}

class GameObject {
    constructor(mesh) {
        this.mesh = mesh;
        this.position = new Vector3(0, 0, 0);
        this.rotation = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
    }
    
    getTransformMatrix() {
        let matrix = Matrix4.identity();
        matrix = matrix.multiply(Matrix4.translation(this.position.x, this.position.y, this.position.z));
        matrix = matrix.multiply(Matrix4.rotationY(this.rotation.y));
        matrix = matrix.multiply(Matrix4.rotationX(this.rotation.x));
        matrix = matrix.multiply(Matrix4.rotationZ(this.rotation.z));
        matrix = matrix.multiply(Matrix4.translation(this.scale.x, this.scale.y, this.scale.z));
        return matrix;
    }
}    