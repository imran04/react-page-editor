import { TextBlock } from './text-block';
import { ImageBlock } from './image-block';
import { ComponentType } from 'react';
import { BaseBlockProps } from './base-block';

interface BlockProps extends BaseBlockProps {
  content: string;
  onContentChange: (content: string) => void;
}

const blockRegistry: Record<string, ComponentType<BlockProps>> = {
  text: TextBlock,
  image: ImageBlock,
};

export function getBlockComponent(type: string): ComponentType<BlockProps> | null {
  return blockRegistry[type] || null;
}

export function registerBlockType(type: string, component: ComponentType<BlockProps>) {
  blockRegistry[type] = component;
}