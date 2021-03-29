import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/simresults.js',
        format: 'umd',
        name: 'SimResults',
        plugins: [
            terser(),
        ],
    },
};
