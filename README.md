# react-mailto.js

[![npm version](https://badge.fury.io/js/react-mailto.js.svg)](https://badge.fury.io/js/react-mailto.js) [![Build Status](https://travis-ci.org/devlio-team/react-mailto.js.svg?branch=master)](https://travis-ci.org/devlio-team/react-mailto.js)


## Install
```npm install react-mailto.js --save```

## Usage

Import the package to your script:

```javascript
import Mailto from 'react-mailto.js';
```

Add `<Mailto />` component to your code and use properties described below to config your link:

| Property | Type | Example | Description |
| ----- | ----- | ----- | ----- |
| to | `string` or `Array<string>`, `isRequired` | 'some@email.com', \['some@email.com', 'another@email.com'\] | Email to this person, or multiple persons |
| subject | `string` | 'This is title' | Your email Subject |
| body | `string` | 'This is body of my email' | Your email body |
| cc | `string` or `Array<string>` | 'some@email.com', \['some@email.com', 'another@email.com'\] | CC email to this person, or multiple persons |
| bcc | `string` or `Array<string>` | 'some@email.com', \['some@email.com', 'another@email.com'\] | BCC email to this person, or multiple persons |
| secure | `boolean` | `true` | When is set to `true` href of the link will be set to `javascript:void(0)` to not to leak email to the HTML code |

### Simple config

```jsx
<Mailto
    secure={true}
    to='tjrus@example.com'
    subject="Some email subject"
    body={[
        "This is the body of your message",
        "Multilined also"
    ].join('\n')}
>
    email us
</Mailto>
```

### Full config

```jsx
<Mailto
    secure={true}
    to={['tjrus@example.com', 'other@example.com']}
    cc={['elena@example.com','other@example.com']}
    bcc={['elena@example.com','other@example.com']}
    subject="Some email subject"
    body={[
        "Some body",
        "Multilined also",
        "Symbols: ,./!@#$%^&*()_+~`\":;<>?",
        "<script>console.log('xss');</script>"
    ].join('\n')}
    onClick={(e) => {console.log(e)}}
>
    email us
</Mailto>
```
