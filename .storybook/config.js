import { configure } from '@storybook/react';
import '@storybook/addon-console';

function loadStories() {
  require('../stories/react-mailto.story.js');
}

configure(loadStories, module);
