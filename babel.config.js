module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [],
  ignore: [
    /node_modules\/(?!(@mui\/x-date-pickers|date-fns)\/).*/
  ]
};
