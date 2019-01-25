import compile from './compile';

type Code = { [fileName: string]: string };

test('creates displayName for Glitz components', () => {
  const code = {
    'component1.tsx': `
import { styled } from "@glitz/react";
const MyStyledComponent = styled.div({ background: 'red' });
function testFunction() {
  const isNotTopLevelDeclaration = true;
}`,
    'component2.tsx': `
import { styled } from "@glitz/react";
const MyStyledComponent = styled.div({ background: 'red' });
function testFunction() {
  const isNotTopLevelDeclaration = true;
}`,
  };

  const expected = {
    'component1.jsx': `
import { styled } from "@glitz/react";
const MyStyledComponent = styled.div({ background: 'red' });
MyStyledComponent.displayName = "MyStyledComponent";
function testFunction() {
    const isNotTopLevelDeclaration = true;
}`,
    'component2.jsx': `
import { styled } from "@glitz/react";
const MyStyledComponent = styled.div({ background: 'red' });
MyStyledComponent.displayName = "MyStyledComponent";
function testFunction() {
    const isNotTopLevelDeclaration = true;
}`,
  };

  expectEqual(expected, compile(code));
});
test.skip('does not create displayName for Glitz component if it already has one', () => {});

function expectEqual(expected: Code, compiled: Code) {
  Object.keys(expected).forEach(fileName => {
    expect(fileName + ':\n' + (compiled[fileName] || '').trim()).toBe(
      fileName + ':\n' + (expected[fileName] || '').trim(),
    );
  });
}
