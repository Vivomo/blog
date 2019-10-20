let IDENTITY = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];

function multiply (
    a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p,
    A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P
) {
    return [
        a * A + b * E + c * I + d * M,
        a * B + b * F + c * J + d * N,
        a * C + b * G + c * K + d * O,
        a * D + b * H + c * L + d * P,
        e * A + f * E + g * I + h * M,
        e * B + f * F + g * J + h * N,
        e * C + f * G + g * K + h * O,
        e * D + f * H + g * L + h * P,
        i * A + j * E + k * I + l * M,
        i * B + j * F + k * J + l * N,
        i * C + j * G + k * K + l * O,
        i * D + j * H + k * L + l * P,
        m * A + n * E + o * I + p * M,
        m * B + n * F + o * J + p * N,
        m * C + n * G + o * K + p * O,
        m * D + n * H + o * L + p * P
    ];
}

let sin = Math.sin;
let cos = Math.cos;

/**
 * Matrix
 *
 */

function Matrix3D (entities) {
    this.entities = entities || IDENTITY;
}

Matrix3D.prototype = {
    multiply: function (entities) {
        return new Matrix3D(
            multiply.apply(window, this.entities.concat(entities))
        );
    },

    transform: function (matrix) {
        return this.multiply(matrix.entities);
    },

    scale: function (s) {
        return this.multiply([
            s, 0, 0, 0,
            0, s, 0, 0,
            0, 0, s, 0,
            0, 0, 0, 1
        ]);
    },

    rotateX: function (a) {
        let c = cos(a);
        let s = sin(a);
        return this.multiply([
            1, 0,  0, 0,
            0, c, -s, 0,
            0, s,  c, 0,
            0, 0,  0, 1
        ]);
    },

    rotateY: function (a) {
        let c = cos(a);
        let s = sin(a);
        return this.multiply([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ]);
    },

    rotateZ: function (a) {
        let c = cos(a);
        let s = sin(a);
        return this.multiply([
            c, -s, 0, 0,
            s,  c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1
        ]);
    },

    translate: function (x, y, z) {
        return this.multiply([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
    },

    toString: function () {
        return 'matrix3d(' + this.entities.join(',') + ')';
    }
};

window.Matrix3D = Matrix3D;
