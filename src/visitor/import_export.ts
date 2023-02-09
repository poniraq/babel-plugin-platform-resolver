import * as path from 'path';
import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';
import { ImportDeclaration, ExportDeclaration } from '@babel/types';

import { NormalizedOptions } from '../options';
import * as utils from '../utils';
import * as resolver from '../resolver';

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
  const source = node_path.get('source') as NodePath;
  if (!types.isStringLiteral(source)) return;

  const import_path = source.value || (source.node as any).value;
  const alternative_path = resolver.resolve(
    import_path,
    {
      ...options,
      basedir
    }
  );
  if (!alternative_path) return;

  console.log(`platform-resolver: ${import_path} -> ${alternative_path}`);

  visited_nodes.add(node_path);
  source.replaceWith(types.stringLiteral(alternative_path));
};

export { ImportExportVisitor as default, ImportExportVisitor };
