import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// Components
import Mailto from '../src/react-mailto';

const story = storiesOf('Mailto', module);

story.add('Basic config', () => (
    <Mailto
        to='tjrus@example.com'
        subject="Some email subject"
        body={[
            "This is the body of your message",
            "Multilined also"
        ].join('\n')}
    >
        Email us
    </Mailto>
));

story.add('Maximum config', () => (
    <Mailto
        secure={true}
        to={['tjrus@example.com', 'other@example.com']}
        cc={['tjrus@example.com', 'other@example.com']}
        bcc={['tjrus@example.com', 'other@example.com']}
        subject="Some email subject"
        body={[
            "Some body",
            "Multilined also",
            "Symbols: ,./!@#$%^&*()_+~`\":;<>?",
            "<script>console.log('xss');</script>"
        ].join('\n')}
        onClick={action('clicked')}
    >
        Email us
    </Mailto>
));

story.add('styled', () => (
    <Mailto
        to='tjrus@example.com'
        style={{ border: '1px #000 solid' }}
    >
        Contact us
    </Mailto>
));

story.add('Additional attributes', () => (
    <Mailto
        to='tjrus@example.com'
        data-additional='test'
    >
        Contact us
    </Mailto>
));

story.add('warning without `to`', () => (
    <Mailto>Contact us</Mailto>
));