import { expect, test } from '@jest/globals';

import React from 'react';

import renderer from 'react-test-renderer';

import * as Stories from '../stories/react-mailto.story';

global.Date.now = () => 1234567890;

Object.keys(Stories)
  .filter((i) => i !== 'default')
  .forEach((storyTitle) => {
    test(`Story: ${storyTitle}`, () => {
      const Component = Stories[storyTitle];
      const tree = renderer.create(<Component />);
      expect(tree).toMatchSnapshot();
    });
  });
