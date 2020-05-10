import React, { HTMLAttributes, SyntheticEvent } from 'react';
import window from 'window-or-global';

import { Props } from './types';

const encode = encodeURIComponent;

function prepareLink({ subject, to, body, cc, bcc }: Partial<Props>) {
  const link: (string | null)[] = [
    cc ? `cc=${cc}` : null,
    bcc ? `bcc=${bcc}` : null,
    subject ? `subject=${encode(subject)}` : null,
    body ? `body=${encode(body)}` : null
  ].filter(Boolean);

  return `${to}?${link.join('&')}&_c=${Date.now()}`;
}

const handleSecureClick = (
  to: string,
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void
) => (event: SyntheticEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  onClick?.(event);

  // @ts-ignore
  window?.location?.assign?.(to);
};

export const Mailto = ({
  to,
  cc,
  bcc,
  subject,
  body,
  secure,
  ...props
}: Props & HTMLAttributes<HTMLAnchorElement>) => {
  const link = prepareLink({ to, cc, bcc, subject, body });
  const isSecure = secure === true;
  const href = `mailto:${link}`;
  const onClick = isSecure
    ? handleSecureClick(href, props.onClick)
    : props.onClick;
  return <a {...props} href={isSecure ? '' : href} onClick={onClick} />;
};
