const { ReducerNative } = require("./ReducerNative");

// Credit:
// https://gomakethings.com/how-to-get-the-value-of-an-object-from-a-specific-path-with-vanilla-js/
// chris@gomakethings.com

function stringToPath(path) {
  const output = [];

  // Split to an array with dot notation
  path.split(".").forEach(function(item, index) {
    // Split to an array with bracket notation
    item.split(/\[([^}]+)\]/g).forEach(function(key) {
      // Push to the new array
      if (key.length > 0) {
        output.push(key);
      }
    });
  });

  return output;
}

function getPath(value, path) {
  var current = value;

  // For each item in the path, dig into the object
  const length = path.length;
  for (let i = 0; i < length; i++) {
    // If the item isn't found, return undefined
    if (!current[path[i]]) return undefined;

    // Otherwise, update the current  value
    current = current[path[i]];
  }

  return current;
}

class ReducerPath extends ReducerNative {
  constructor(spec) {
    super("path", spec, spec);
    this.path = stringToPath(spec.substr(1));
  }

  static isType(spec) {
    return typeof spec === "string" && spec.charAt(0) === "$";
  }

  resolve(accumulator) {
    return getPath(accumulator.value, this.path);
  }
}

module.exports = {
  ReducerPath
};
