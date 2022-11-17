## Install

    npm install babel-platform-resolver

and add it to your `.babelrc` with `@babel/preset-typescript`

```json
{
  "plugins": [
    "babel-platform-resolver",
    {
      "platform": "desktop"
    }
  ]
}
```

## Options

### `extensions`

Supported extensions

```json
{
  "plugins": [
    "babel-platform-resolver",
    {
      "extensions": ["js", "jsx", "mjs"]
    }
  ]
}
```

default value: `['js', 'jsx', 'ts', 'tsx']`

### `platforms`

List of supported platform extensions

```json
{
  "plugins": [
    "babel-platform-resolver",
    {
      "platforms": {
        "windows": ["windows", "desktop"],
        "macos": ["macos", "osx", "desktop"]
      }
    }
  ]
}
```

default value:

```javascript
{
  windows: ['windows', 'desktop', 'web'],
  macos: ['macos', 'osx', 'desktop', 'web'],
  desktop: ['desktop', 'web'],
  ios: ['ios', 'native'],
  android: ['android', 'native'],
}
```

### `platform`

Current platform

```json
{
  "plugins": [
    "babel-platform-resolver",
    {
      "platform": "windows"
    }
  ]
}
```

default value: `desktop`

### `transform_functions`

List of supported import functions

```json
{
  "plugins": [
    "babel-platform-resolver",
    {
      "transform_functions": ["require", "System.import"]
    }
  ]
}
```

default value:

```javascript
[
  'require',
  'require.resolve',
  'System.import',

  // Jest methods
  'jest.genMockFromModule',
  'jest.mock',
  'jest.unmock',
  'jest.doMock',
  'jest.dontMock',
  'jest.setMock',
  'jest.requireActual',
  'jest.requireMock',

  // Older Jest methods
  'require.requireActual',
  'require.requireMock',
];
```
