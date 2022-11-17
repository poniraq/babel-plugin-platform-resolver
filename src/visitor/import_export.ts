import * as path from 'path';
import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';
import { ImportDeclaration, ExportDeclaration } from '@babel/types';

import { NormalizedOptions } from '../options';
import * as utils from '../utils';

const ImportExportVisitor = <
  NodeType extends ImportDeclaration | ExportDeclaration
>(
  node_path: NodePath<NodeType>,
  state: any
) => {
  const types = state.types as typeof BabelTypes;
  const options = state.normalized_options as NormalizedOptions;
  const visited_nodes = state.babel_platform_resolver_visited_nodes as Set<
    NodePath<NodeType>
  >;

  if (visited_nodes.has(node_path)) return;

  const current_file = state.file.opts.filename as string;
  const basedir = path.dirname(current_file);
  if (basedir.includes('/node_modules/')) return; // skip node_modules

  const source = node_path.get('source') as NodePath;
  if (!types.isStringLiteral(source)) return;

  const import_path = source.value;
  if (!import_path?.startsWith('.')) return; // skip non-local imports

  const alternative_path = utils.find_platform_import_path(
    import_path,
    basedir,
    options.platform_extensions,
    options.extensions
  );
  if (!alternative_path) return;

  // console.log(`###########`);
  // console.log(`current_file: ${current_file}`);
  // console.log(`import_path: ${import_path}`);
  // console.log(`alternative_path: ${alternative_path}`);

  visited_nodes.add(node_path);
  source.replaceWith(types.stringLiteral(alternative_path));
};

export { ImportExportVisitor as default, ImportExportVisitor };
