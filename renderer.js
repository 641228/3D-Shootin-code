class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cameraPosition = new Vector3(0, 0, -5);
        this.cameraRotation = new Vector3(0, 0, 0);
        this.zBuffer = [];
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.aspectRatio = this.canvas.width / this.canvas.height;
    }
    
    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.zBuffer = Array(this.canvas.width * this.canvas.height).fill(Infinity);
    }
    
    project(vertex, transformMatrix, cameraMatrix, projectionMatrix) {
        // 模型变换
        let point = new Vector3(vertex.x, vertex.y, vertex.z);
        
        // 应用变换矩阵
        const transformed = this.transformVertex(point, transformMatrix);
        
        // 应用相机矩阵
        const cameraPoint = this.transformVertex(transformed, cameraMatrix);
        
        // 应用投影矩阵
        const projected = this.transformVertex(cameraPoint, projectionMatrix);
        
        // 透视除法
        if (projected.w !== 0) {
            projected.x /= projected.w;
            projected.y /= projected.w;
            projected.z /= projected.w;
        }
        
        // 视口变换
        const x = (projected.x + 1) * 0.5 * this.canvas.width;
        const y = (1 - projected.y) * 0.5 * this.canvas.height;
        
        return { x, y, z: projected.z };
    }
    
    transformVertex(vertex, matrix) {
        const m = matrix.data;
        const w = vertex.x * m[3] + vertex.y * m[7] + vertex.z * m[11] + m[15];
        return {
            x: vertex.x * m[0] + vertex.y * m[4] + vertex.z * m[8] + m[12],
            y: vertex.x * m[1] + vertex.y * m[5] + vertex.z * m[9] + m[13],
            z: vertex.x * m[2] + vertex.y * m[6] + vertex.z * m[10] + m[14],
            w
        };
    }
    
    drawMesh(mesh, transformMatrix) {
        // 构建相机矩阵
        const cameraMatrix = Matrix4.lookAt(
            this.cameraPosition,
            new Vector3(0, 0, 0),
            new Vector3(0, 1, 0)
        );
        
        // 构建投影矩阵
        const projectionMatrix = Matrix4.perspective(
            Math.PI / 4,
            this.aspectRatio,
            0.1,
            1000
        );
        
        // 绘制所有面
        for (let face of mesh.faces) {
            const vertices = face.vertices;
            const projected = [];
            
            // 投影所有顶点
            for (let vertex of vertices) {
                projected.push(this.project(
                    vertex, 
                    transformMatrix, 
                    cameraMatrix, 
                    projectionMatrix
                ));
            }
            
            // 背面剔除
            const normal = this.calculateNormal(projected);
            if (normal.z > 0) continue;
            
            // 绘制面
            this.ctx.beginPath();
            this.ctx.moveTo(projected[0].x, projected[0].y);
            for (let i = 1; i < projected.length; i++) {
                this.ctx.lineTo(projected[i].x, projected[i].y);
            }
            this.ctx.closePath();
            
            // 计算光照
            const lightDirection = new Vector3(0, 0, 1).normalize();
            const lightIntensity = Math.max(0.1, -normal.dot(lightDirection));
            
            // 填充颜色
            const baseColor = face.color || '#888';
            const color = this.applyLighting(baseColor, lightIntensity);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            // 描边
            this.ctx.strokeStyle = '#333';
            this.ctx.stroke();
        }
    }
    
    calculateNormal(points) {
        const v1 = new Vector3(
            points[1].x - points[0].x,
            points[1].y - points[0].y,
            points[1].z - points[0].z
        );
        
        const v2 = new Vector3(
            points[2].x - points[0].x,
            points[2].y - points[0].y,
            points[2].z - points[0].z
        );
        
        return v1.cross(v2).normalize();
    }
    
    applyLighting(color, intensity) {
        if (color.startsWith('#')) {
            color = color.substring(1);
            const r = parseInt(color.substring(0, 2), 16);
            const g = parseInt(color.substring(2, 4), 16);
            const b = parseInt(color.substring(4, 6), 16);
            
            const applyIntensity = (value) => {
                const newValue = Math.floor(value * intensity);
                return Math.max(0, Math.min(255, newValue));
            };
            
            const newR = applyIntensity(r);
            const newG = applyIntensity(g);
            const newB = applyIntensity(b);
            
            return `rgb(${newR}, ${newG}, ${newB})`;
        }
        return color;
    }
}    