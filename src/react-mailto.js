import React, {Component, PropTypes} from 'react';

const encode = encodeURIComponent;

export default class Mailto extends Component {

    _prepareLink(cfg) {
        let {subject = '', to = '', body = '', cc = '', bcc = ''} = cfg;
        const link = [];
        if (cc) {
            link.push(`cc=${cc}`);
        }
        if (bcc) {
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

    render() {
        const {to, cc, bcc, onClick, subject, body, secure, ...props} = this.props;
        const link = this._prepareLink({to, cc, bcc, subject, body});
        const mailto = `mailto:${link}`;
        if (secure === true) {
            props.onClick = this._handleSecureClick(mailto, onClick);
            props.href = 'javascript:void(0)';
        } else {
            props.href = mailto;
        }
        return (
            <a {...props}>{this.props.children}</a>
        );
    }

    _handleSecureClick(href, onClick = e => {}) {
        return (e) => {
            onClick.call(null, e);
            e.preventDefault();
            document.location.href = href;
        }
    }
}


Mailto.displayName = 'Mailto';

Mailto.defaultProps = {
    event: 'click'
};

Mailto.propTypes = {
    to: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.array.isRequired
    ]),
    cc: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    bcc: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    subject: PropTypes.string,
    body: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.string
    ])
};
