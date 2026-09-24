import { defineConfig } from "oxlint";
import { native, web, node } from "oxlint-config-universe";

export default defineConfig({
  extends: [native, node],
  overrides: [
    // below comes from https://github.com/expo/oxlint-config-universe/blob/a00bdcd0b0c8619dbcd786023fac1a0c85d0aebf/node.js
    {
      files: ["src/app/api/**"],
      env: { node: true },
      rules: {
        "node/no-path-concat": "warn",
        // no-buffer-constructor is not supported by oxlint — see README
      },
    },
  ],
});
