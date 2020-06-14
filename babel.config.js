module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      "@babel/preset-env", 
      {
      targets: {
         node: "current" 
        } // change this to your node version
      }
    ]
  ]
}
