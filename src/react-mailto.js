import React, { Component } from 'react';
import PropTypes from 'prop-types';

const encode = encodeURIComponent;

function prepareLink(cfg) {
    let { subject = '', to = '', body = '', cc = '', bcc = '' } = cfg;
    const link = [];
    if ( cc ) {
        link.push(`cc=${cc}`);
    }
    if ( bcc ) {
        link.push(`bcc=${bcc}`);
    }
    if (subject) {
        link.push(`subject=${encode(subject)}`);
    }
    if (body) {
        link.push(`body=${encode(body)}`);
    }
    return `${to}?${link.join('&')}&_c=${(new Date()).getTime()}`;
}

function handleSecureClick(href, onClick = e => {}) {
    return (e) => {
        e.preventDefault();
        onClick.call(null, e);
        document.location.href = href;
    }
}

export default class Mailto extends Component {

    static propTypes = {
        /** String or Array of email recepients */
        to: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]).isRequired,
        /** String or Array of emails to send a carbon copy to */
        cc: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        /** String or Array of emails to send a bling carbon copy to */
        bcc: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        /** Email subject */
        subject: PropTypes.string,
        /** Email body */
        body: PropTypes.string,
        /** Additional onClick handler */
        onClick: PropTypes.func
    };

    static displayName = 'Mailto';

    render() {
        const {to, cc, bcc, subject, body, secure, children, ...props} = this.props;
        const link = prepareLink({to, cc, bcc, subject, body});
        props.href = `mailto:${link}`;
        if (secure === true) {
            props.onClick = handleSecureClick(props.href, props.onClick);
            props.href = 'javascript:void(0)';
        }
        return (
            <a {...props}>{children}</a>
        );
    }
}

