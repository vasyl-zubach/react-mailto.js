import React from 'react';
import { action } from '@storybook/addon-actions';

// Components
import Mailto from '../src/index';

export default { title: 'Mailto' };

export const basicConfig = () => (
  <Mailto
    to="vasyl@example.com"
    subject="Some email subject"
    body={['This is the body of your message', 'Multilined also'].join('\n')}
  >
    Email us
  </Mailto>
);

export const maximumConfig = () => (
  <Mailto
    secure={true}
    to={['vasyl@example.com', 'other@example.com']}
    cc={['vasyl@example.com', 'other@example.com']}
    bcc={['vasyl@example.com', 'other@example.com']}
    subject="Some email subject"
    body={[
      'Some body',
      'Multilined also',
      'Symbols: ,./!@#$%^&*()_+~`":;<>?',
      "<script>console.log('xss');</script>"
    ].join('\n')}
    onClick={action('clicked')}
  >
    Email us
  </Mailto>
);

export const customStyles = () => (
  <Mailto to="vasyl@example.com" style={{ border: '1px #000 solid' }}>
    Contact us
  </Mailto>
);

export const additionalAttributes = () => (
  <Mailto to="vasyl@example.com" data-additional="test">
    Contact us
  </Mailto>
);
