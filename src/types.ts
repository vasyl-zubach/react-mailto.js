export interface Props {
  /** String or Array of email recepients */
  to: string | string[];
  /** String or Array of emails to send a carbon copy to */
  cc?: string | string[];
  /** String or Array of emails to send a bling carbon copy to */
  bcc?: string | string[];
  /** Email subject */
  subject?: string;
  /** Email body */
  body?: string;
  /** Additional onClick handler */
  onClick?: () => void;

  secure?: boolean;

  children: React.ReactNode;
}
