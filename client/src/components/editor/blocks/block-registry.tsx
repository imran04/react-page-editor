import { TextBlock } from './text-block';
import { ComponentType } from 'react';
import { BaseBlockProps } from './base-block';

export type BlockComponent = ComponentType<BaseBlockProps & Record<string, any>>;

const blockRegistry: Record<string, BlockComponent> = {
  text: TextBlock,
  // Add more block types here as they are created
};

export function getBlockComponent(type: string): BlockComponent | null {
  return blockRegistry[type] || null;
}

export function registerBlockType(type: string, component: BlockComponent) {
  blockRegistry[type] = component;
}
