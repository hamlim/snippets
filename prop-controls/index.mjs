import {
  stringType,
  numberType,
  shapeType,
  rangeType,
  booleanType,
  optionsType,
  processor,
  evaluateTypes,
  TYPES,
} from './prop-controls.mjs'
import htm from 'https://unpkg.com/htm@1.0.1/dist/htm.mjs'

const html = htm.bind(React.createElement)
const controls = {
  foo: stringType({ label: 'Foo' }),
  bar: numberType({ label: 'Bar' }),
  another: optionsType({
    label: 'Some Options',
    options: ['a', 'b', 'c'],
  }),
  baz: shapeType({
    label: 'Baz',
    types: {
      qux: booleanType({ label: 'Qux' }),
      blah: rangeType({ label: 'Blah', min: 0, max: 10, step: 1 }),
      nested: shapeType({
        label: 'Nested',
        types: { foo: stringType({ label: 'Nested Foo' }) },
      }),
    },
  }),
}

const types = evaluateTypes(controls)

console.log(types)

function getValueFromType(type) {
  if (typeof type.defaultValue !== 'undefined') {
    return type.defaultValue
  }
  switch (type.$type) {
    case TYPES.string:
      return ''
    case TYPES.number:
      return 0
    case TYPES.range:
      return 0
    case TYPES.options:
      return type.options[0]
    case TYPES.boolean:
      return false
    default:
      return null
  }
}

function typesToValues(types) {
  return Object.entries(types).reduce(
    (acc, curr) => ({
      ...acc,
      [curr[0]]:
        curr[1].$type !== TYPES.shape
          ? getValueFromType(curr[1])
          : typesToValues(curr[1].types),
    }),
    {},
  )
}

const { render } = ReactDOM
const { useState, createElement } = React

const controlsValue = typesToValues(types)

function App() {
  const [value, set] = useState(controlsValue)

  console.log(value)

  return html`
    <div>
      ${
        Object.values(types).map(entry => {
          switch (entry.$type) {
            case TYPES.string:
              return html`
                <label key="${entry.propName}">
                  ${entry.label}
                  <input
                    type="text"
                    value="${value[entry.propName]}"
                    onChange="${
                      ({ target: { value: inputVal } }) =>
                        set(s => ({ ...s, [entry.propName]: inputVal }))
                    }"
                  />
                </label>
              `
            default:
              return null
          }
        })
      }
    </div>
  `
}

render(createElement(App, null, null), document.querySelector('#app'))
