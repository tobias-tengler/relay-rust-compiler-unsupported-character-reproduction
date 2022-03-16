const { override, addBabelPlugins } = require("customize-cra");

module.exports = override(
  addBabelPlugins([
    "babel-plugin-relay",
    {
      artifactDirectory: "./src/__generated__",
    },
  ])
);
