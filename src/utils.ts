import * as path from 'path';
import * as fs from 'fs';
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

const strip_extension = (filepath: string, extensions: Array<string>) => {
  const ext = path.extname(filepath);
  if (extensions.includes(ext)) {
    return filepath.substring(0, filepath.length - (ext.length + 1));
  }

  return filepath;
};

const find_platform_import_path = (
  filepath: string,
  basedir: string,
  platform_extensions: Array<string>,
  extensions: Array<string>
): string | null => {
  const filepath_stripped = strip_extension(filepath, extensions);

  for (const platform_extension of platform_extensions) {
    for (const extension of extensions) {
      const alternative_filepath = `${filepath_stripped}.${platform_extension}.${extension}`;
      const absolute_filepath = path.isAbsolute(alternative_filepath)
        ? alternative_filepath
        : path.resolve(basedir, alternative_filepath);

      if (fs.existsSync(absolute_filepath)) {
        return alternative_filepath;
      }
    }
  }

  // handle /module/index.<platform>.js case
  for (const platform_extension of platform_extensions) {
    for (const extension of extensions) {
      const alternative_filepath = `${filepath_stripped}/index.${platform_extension}.${extension}`;
      const absolute_filepath = path.isAbsolute(alternative_filepath)
        ? alternative_filepath
        : path.resolve(basedir, alternative_filepath);

      if (fs.existsSync(absolute_filepath)) {
        return alternative_filepath;
      }
    }
  }

  return null;
};

export { is_normal_call, is_import_call, find_platform_import_path };
