/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const babel = require("@rollup/plugin-babel").default;
const nodeResolve = require("@rollup/plugin-node-resolve").default;

const {
  copyToPlaygrounds,
  createBanner,
  getAdapterConfig,
  getOutputDir,
  getVersion,
  isBareModuleId,
} = require("../../rollup-utils");

/** @returns {import("rollup").RollupOptions[]} */
module.exports = function rollup() {
  let sourceDir = path.relative(process.cwd(), __dirname) || ".";
  let outputDir = getOutputDir("@remix-run/cloudflare-workers");
  let version = getVersion(sourceDir);

  return [
    {
      external(id) {
        return isBareModuleId(id);
      },
      input: `${sourceDir}/index.ts`,
      output: {
        banner: createBanner("@remix-run/cloudflare-workers", version),
        dir: `${outputDir}/esm`,
        format: "esm",
        preserveModules: true,
      },
      plugins: [
        babel({
          babelHelpers: "bundled",
          exclude: /node_modules/,
          extensions: [".ts", ".tsx"],
          rootMode: "upward",
        }),
        nodeResolve({ extensions: [".ts", ".tsx"] }),
        copyToPlaygrounds(),
      ],
    },
    ...getAdapterConfig("cloudflare-workers"),
  ];
};