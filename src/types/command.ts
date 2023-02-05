export interface Command {
  name: string;
  embed: Embed;
  roles?: Role[];
}

export interface Embed {
  title: string;
  description: string;
  color: string;
  fields: Field[];
  footer: Footer;
  timestamp: boolean;
  image: string;
  url: string;
}

export interface Field {
  name: string;
  value: string;
}

export interface Footer {
  text: string;
  icon_url: string;
}

export interface Role {
  name: string;
  id: string;
  emoji: string;
}
