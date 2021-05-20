const { environment } = require('@rails/webpacker')

// error in react-table due to automatic transpiling by babel-loader
const nodeModulesLoader = environment.loaders.get('nodeModules')

if (!Array.isArray(nodeModulesLoader.exclude)) {
  nodeModulesLoader.exclude = (nodeModulesLoader.exclude == null) ? [] : [nodeModulesLoader.exclude]
}
nodeModulesLoader.exclude.push(/react-table/)

module.exports = environment
