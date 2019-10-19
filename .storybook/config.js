import { configure } from '@storybook/react';

import '@storybook/addon-actions/register';
import '@storybook/addon-console';

configure(require.context('../stories', true, /\.story\.(j|t)sx?$/), module);
