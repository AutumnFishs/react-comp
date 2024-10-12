import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// process.env.GITHUB_REPOSITORY 存储仓库的全名  GitHub Actions 自动设置的标准环境变量之一

const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "";
const projectName = GITHUB_REPOSITORY.split("/").pop();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: projectName ? `/${projectName}/` : "/", //在git上部署时，需要设置base，在vercel上部署时设置为/即可,
  build: {
    outDir: "dist",
  },
});
