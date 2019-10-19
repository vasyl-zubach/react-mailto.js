import { configure } from '@storybook/react';

import '@storybook/addon-actions/register';

configure(require.context('../stories', true, /\.story\.(j|t)sx?$/), module);
