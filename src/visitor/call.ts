import * as path from 'path';
import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';
import { CallExpression } from '@babel/types';
import { NormalizedOptions } from '../options';
import * as utils from '../utils';
import * as resolver from '../resolver';

const CallVisitor = (node_path: NodePath<CallExpression>, state: any) => {
  const types = state.types as typeof BabelTypes;
  const options = state.normalized_options as NormalizedOptions;
  const visited_nodes: Set<NodePath> =
    state.babel_platform_resolver_visited_nodes as Set<NodePath>;

  if (visited_nodes.has(node_path)) return;

  const current_file = state.file.opts.filename as string;
  const basedir = path.dirname(current_file);

  if (
    utils.is_normal_call(
      node_path.get('callee') as NodePath,
      types,
      options.transform_functions
    ) ||
    utils.is_import_call(node_path, types)
  ) {
    const arg0 = node_path.get('arguments.0') as NodePath;
    if (!types.isStringLiteral(arg0.node)) return;

    const import_path = arg0.node.value;

    const alternative_path = resolver.resolve(
      import_path,
      {
        ...options,
        basedir
      }
    );
    if (!alternative_path) return;

    visited_nodes.add(node_path);
    arg0.replaceWith(types.stringLiteral(alternative_path));
  }
};

export { CallVisitor as default, CallVisitor };
