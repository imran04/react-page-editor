import { TextBlock } from './text-block';
import { ImageBlock } from './image-block';
import { HeadingBlock } from './heading-block';
import { ButtonBlock } from './button-block';
import { LinkBlock } from './link-block';
import { FormBlock } from './form-block';
import { TableBlock } from './table-block';
import { HtmlBlock } from './html-block';
import { ComponentType } from 'react';
import { BaseBlockProps } from './base-block';

interface BlockProps extends BaseBlockProps {
  content: string;
  onContentChange: (content: string) => void;
}

const blockRegistry: Record<string, ComponentType<BlockProps>> = {
  text: TextBlock,
  image: ImageBlock,
  heading: HeadingBlock,
  button: ButtonBlock,
  link: LinkBlock,
  form: FormBlock,
  table: TableBlock,
  html: HtmlBlock,
};

export function getBlockComponent(type: string): ComponentType<BlockProps> | null {
  return blockRegistry[type] || null;
}

export function registerBlockType(type: string, component: ComponentType<BlockProps>) {
  blockRegistry[type] = component;
}