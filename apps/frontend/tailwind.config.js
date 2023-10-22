import config from "@strawberry-graphql/styleguide/dist/tailwind.config";

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
};
