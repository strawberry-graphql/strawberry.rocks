/** @type {import("prettier").Config} */
export default {
  htmlWhitespaceSensitivity: 'css',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
