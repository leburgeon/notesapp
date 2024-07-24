const info = (...params) => {
  // Logger only prints to console if the node environment variable is not in TEST mode
  if (process.env.NODE_ENV !== 'test'){
    console.log(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}