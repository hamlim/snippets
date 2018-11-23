let TYPES = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  shape: 'shape',
  range: 'range',
  options: 'options',
}

function evaluateTypes(types, nestedName = undefined) {
  return Object.entries(types).reduce(
    (acc, curr) => ({
      ...acc,
      [curr[0]]: { ...curr[1](curr[0]), nestedName },
    }),
    {},
  )
}

let stringType = ({ label }) => name => ({
  propName: name,
  label,
  $type: TYPES.string,
})

let numberType = ({ label }) => name => ({
  propName: name,
  label,
  $type: TYPES.number,
})

let booleanType = ({ label, defaultValue }) => name => ({
  propName: name,
  label,
  defaultValue,
  $type: TYPES.boolean,
})

let shapeType = ({ label, types }) => name => ({
  propName: name,
  label,
  types: evaluateTypes(types, name),
  $type: TYPES.shape,
})

let rangeType = ({ label, min, max, step }) => name => ({
  propName: name,
  label,
  step,
  min,
  max,
  $type: TYPES.range,
})

let optionsType = ({ label, options }) => name => ({
  propName: name,
  label,
  options,
  $type: TYPES.options,
})

function processor(types, render) {
  return Object.entries(types).map(([name, attrs]) => {
    if (attrs.$type === TYPES.shape) {
      return processor(attrs.types, render)
    }
    return render({
      name,
      ...attrs,
    })
  })
}

export {
  stringType,
  numberType,
  booleanType,
  shapeType,
  optionsType,
  rangeType,
  evaluateTypes,
  processor,
  TYPES,
}
