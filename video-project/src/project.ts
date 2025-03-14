import {makeProject} from '@motion-canvas/core';

import content from './scenes/content.tsx?scene';
import logo from './scenes/logo?scene';
import test from './scenes/test.tsx?scene';

export default makeProject({
  scenes: [logo, test],
});
