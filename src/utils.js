// source: https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge


// lib: https://www.npmjs.com/package/deepmerge

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
function mergeDeep(...objects) {
  const isObject = obj => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      }
      else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}

// ^^ To make the arrays unique you can change prev[key] = pVal.concat(...oVal);
// to prev[key] = [...pVal, ...oVal].filter((element, index, array) => array.indexOf(element) === index);

// ============================================

// Test objects
const proto = Object.create(
  {},
  {
    // String-keyed (named)
    proto_n_e_v: {
      enumerable: true,
      value: 1
    },
    proto_n_ne_a: {
      enumerable: false,
      get: function() {return 1;},
      set: function(x) {}
    },
    shadow: {
      enumerable: true,
      value: "shadowed by own 'shadow' property"
    },
    // Symbol-keyed (unnamed)
    [Symbol('proto_u_e_v')]: {
      enumerable: true,
      value: 1
    },
    [Symbol('proto_u_ne_a')]: {
      enumerable: false,
      get: function() {return 1;},
      set: function(x) {}
    }
  }
);

const prop = Object.create(
  {},
  {
    // String-keyed (named)
    prop_n_e_v: {
      enumerable: true,
      value: 1
    },
    prop_n_ne_a: {
      enumerable: false,
      get: function() {return 1;},
      set: function(x) {}
    },
    shadow: {
      enumerable: true,
      value: "shadowing prototype 'shadow' property"
    },
    // Symbol-keyed (unnamed)
    [Symbol('prop_u_e_v')]: {
      enumerable: true,
      value: 1
    },
    [Symbol('prop_u_ne_a')]: {
      enumerable: false,
      get: function() {return 1;},
      set: function(x) {}
    }
  }
);

const o = Object.create(
  // Prototype (parent object)
  proto,
  // Own properties (in the form of keys/descriptors)
  Object.getOwnPropertyDescriptors(prop)
);

const options = {nonEnum:true, symbols:true, descriptors: true, proto:true};
display(deepAssign(options)({},o));

// Functions
function toType(a) {
  return ({}).toString.call(a).match(/([a-z]+)(:?\])/i)[1];
}

function isDeepObject(obj) {
  // Choose which types require we look deeper into (object, array, string...)
  return "Object" === toType(obj);
}

function deepAssign(options) {
  return function deepAssignWithOptions (target, ...sources) {
    sources.forEach( (source) => {

      if (!isDeepObject(source) || !isDeepObject(target))
        return;

      // Copy source's own properties into target's own properties
      function copyProperty(property) {
        const descriptor = Object.getOwnPropertyDescriptor(source, property);
        //default: omit non-enumerable properties
        if (descriptor.enumerable || options.nonEnum) {
          // Copy in-depth first
          if (isDeepObject(source[property]) && isDeepObject(target[property]))
            descriptor.value = deepAssign(options)(target[property], source[property]);
          //default: omit descriptors
          if (options.descriptors)
            Object.defineProperty(target, property, descriptor); // shallow copy descriptor
          else
            target[property] = descriptor.value; // shallow copy value only
        }
      }

      // Copy string-keyed properties
      Object.getOwnPropertyNames(source).forEach(copyProperty);

      //default: omit symbol-keyed properties
      if (options.symbols)
        Object.getOwnPropertySymbols(source).forEach(copyProperty);

      //default: omit prototype's own properties
      if (options.proto)
      // Copy souce prototype's own properties into target prototype's own properties
        deepAssign(Object.assign({},options,{proto:false})) (// Prevent deeper copy of the prototype chain
          Object.getPrototypeOf(target),
          Object.getPrototypeOf(source)
        );

    });
    return target;
  }
}


function display(o) {
  console.log("Displaying descriptors for:",o);
  Object
    .getOwnPropertyNames(o) // Named own properties (enum. or non-enum.)
    .forEach((p) => console.log(Object.getOwnPropertyDescriptor(o,p)));
  Object
    .getOwnPropertySymbols(o) // Symbol own properties (enum. or non-enum.)
    .forEach((p) => console.log(Object.getOwnPropertyDescriptor(o,p)));
}



