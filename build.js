/* eslint-disable */
const Bundler = require("parcel-bundler");
const Path = require("path");

const entryFiles = Path.join(__dirname, "./index.html");

// Bundler options
const options = {
  outDir: "./dist",
  outFile: "index.html",
  publicUrl: process.env.SUBPATH + "/dist",
  watch: false,
  contentHash: false,
  scopeHoist: false,
  target: "browser",
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors, 0 = log nothing
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  autoInstall: true, // Enable or disable auto install of missing dependencies found during bundling
};

(async () => {
  const bundler = new Bundler(entryFiles, options);
  await bundler.bundle();
})();
