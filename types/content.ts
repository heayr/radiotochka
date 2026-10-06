export interface ContentBlock {
  id: string;
  slug: string;
  title: string;
  content: Record<string, unknown>;
  status: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceItem {
  title: string;
  description?: string;
  imageSrc: string;
  iconSrc?: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: string;
}

export interface CaseItem {
  text: string;
  link: string;
  imageSrc?: string;
}

export interface ProposalContent {
  title: string;
  description: string;
  buttonText: string;
}

export interface LogoItem {
  src: string;
  alt: string;
  name?: string;
  type?: string;
  href?: string;
  scale?: number;
  fit?: "contain" | "cover" | "scale-down";
  filter?: "none" | "grayscale" | "invert";
  maxWidth?: number;
}