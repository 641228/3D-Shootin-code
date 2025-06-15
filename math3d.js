// 3D向量类
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    add(v) { return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z); }
    subtract(v) { return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z); }
    multiply(scalar) { return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar); }
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    cross(v) { return new Vector3(
        this.y * v.z - this.z * v.y,
        this.z * v.x - this.x * v.z,
        this.x * v.y - this.y * v.x
    ); }
    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }
    length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
}

// 4x4矩阵类
class Matrix4 {
    constructor() {
        this.data = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    
    static identity() { return new Matrix4(); }
    
    multiply(m) {
        const result = new Matrix4();
        const a = this.data;
        const b = m.data;
        const c = result.data;
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                c[i * 4 + j] = 0;
                for (let k = 0; k < 4; k++) {
                    c[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                }
            }
        }
        
        return result;
    }
    
    static perspective(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        const nf = 1 / (near - far);
        const m = new Matrix4();
        m.data = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ];
        return m;
    }
    
    static lookAt(eye, target, up) {
        const zAxis = eye.subtract(target).normalize();
        const xAxis = up.cross(zAxis).normalize();
        const yAxis = zAxis.cross(xAxis);
        
        const m = new Matrix4();
        m.data = [
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            -xAxis.dot(eye), -yAxis.dot(eye), -zAxis.dot(eye), 1
        ];
        return m;
    }
    
    static translation(x, y, z) {
        const m = new Matrix4();
        m.data[12] = x;
        m.data[13] = y;
        m.data[14] = z;
        return m;
    }
    
    static rotationX(angle) {
        const m = new Matrix4();
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m.data[5] = c;
        m.data[6] = s;
        m.data[9] = -s;
        m.data[10] = c;
        return m;
    }
    
    static rotationY(angle) {
        const m = new Matrix4();
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m.data[0] = c;
        m.data[2] = -s;
        m.data[8] = s;
        m.data[10] = c;
        return m;
    }
    
    static rotationZ(angle) {
        const m = new Matrix4();
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m.data[0] = c;
        m.data[1] = s;
        m.data[4] = -s;
        m.data[5] = c;
        return m;
    }
}    