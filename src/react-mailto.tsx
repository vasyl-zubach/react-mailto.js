import React, { HTMLAttributes } from 'react';
import window from 'window-or-global';

import { Props } from './types';

const encode = window.encodeURIComponent;

function prepareLink({ subject, to, body, cc, bcc }: Partial<Props>) {
  const link: string[] = [];
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
  return `${to}?${link.join('&')}&_c=${Date.now()}`;
}

const handleSecureClick = (to: string, onClick) => (e) => {
  e.preventDefault();
  if (onClick) {
    onClick(e);
  }
  window.location.assign(to);
};

const Mailto = ({
  to,
  cc,
  bcc,
  subject,
  body,
  secure,
  children,
  ...props
}: Props & HTMLAttributes<{}>) => {
  const link = prepareLink({ to, cc, bcc, subject, body });
  const isSecure = secure === true;
  const href = `mailto:${link}`;
  const onClick = isSecure
    ? handleSecureClick(href, props.onClick)
    : props.onClick;
  return (
    <a {...props} href={isSecure ? '' : href} onClick={onClick}>
      {children}
    </a>
  );
};

export default Mailto;
