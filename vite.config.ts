import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "UIComplex",
      fileName: (format) => `index.${format}.js`,
      // formats: ["es"],
    },
    rollupOptions: {
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      external: ["react", "react-dom"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [react(), libInjectCss(), dts()],
});
