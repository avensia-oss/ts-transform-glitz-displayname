# ts-transform-glitz-displayname

_Note! This transformer is currently experimental_

A TypeScript custom transformer that adds a `displayName` to your [Glitz](https://github.com/frenic/glitz/) components, making them easier to spot in React DevTools. Theoretically this transform should also work on [Styletron](https://github.com/styletron/styletron) components.

This transformer will essentially rewrite this:

```js
import { styled } from '@glitz/react';

const CompactHeader = styled.div({
  backgroundColor: 'palevioletred',
});
const NarrowHeader = styled(CompactHeader, {
  backgroundColor: 'mediumslateblue',
});
```

To this:

```js
import { styled } from '@glitz/react';

const CompactHeader = styled.div({
  backgroundColor: 'palevioletred',
});
CompactHeader.displayName = 'CompactHeader';
const NarrowHeader = styled(CompactHeader, {
  backgroundColor: 'mediumslateblue',
});
NarrowHeader.displayName = 'NarrowHeader';
```

### WIP

- [ ] Check if VariableStatement already has displayName after itself to avoid duplication.

# Installation

```
yarn add @avensia-oss/ts-transform-glitz-displayname
```

## Options

## Usage with webpack

Unfortunately TypeScript doesn't let you specifiy custom transformers in `tsconfig.json`. If you're using `ts-loader` with webpack you can specify it like this:
https://github.com/TypeStrong/ts-loader#getcustomtransformers-----before-transformerfactory-after-transformerfactory--

The default export of this module is a function which expects a `ts.Program` an returns a transformer function. Your config should look something like this:

```js
const glitzDisplayName = require('@avensia-oss/ts-transform-glitz-displayname');

return {
  ...
  options: {
    getCustomTransformers: (program) => ({
      before: [glitzDisplayName(program, options)] // See options above
    })
  }
  ...
};
```
