import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Bỏ qua database.json để Vite không reload khi json-server ghi dữ liệu
  server: { port: 5173, watch: { ignored: ["**/database.json"] } },
});
