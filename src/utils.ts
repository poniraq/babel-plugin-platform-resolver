import * as path from 'path';
import * as BabelTypes from '@babel/types';
import { NodePath } from '@babel/traverse';

const is_normal_call = (
  node_path: NodePath,
  types: typeof BabelTypes,
  functions: Array<string>
): boolean => {
  const { node } = node_path;

  return functions.some(pattern => {
    if (types.isMemberExpression(node)) {
      return node_path.matchesPattern(pattern);
    }

    if (!types.isIdentifier(node) || pattern.includes('.')) {
      return false;
    }

    const name = pattern.split('.')[0];
    return node.name === name;
  });
};

const is_import_call = (
  node_path: NodePath,
  types: typeof BabelTypes
): boolean => {
  if (!types.isCallExpression(node_path.node)) return false;
  return types.isImport(node_path.node.callee);
};

const strip_extension = (filepath: string) => {
  const parsed = path.parse(filepath);
  return `${parsed.dir}${path.sep}${parsed.name}`;
};

export {
  is_normal_call,
  is_import_call,
  strip_extension
};
