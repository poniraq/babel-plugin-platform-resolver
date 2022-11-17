import { PluginObj } from '@babel/core';
import * as BabelTypes from '@babel/types';
import visitor from './visitor';
import { normalize_options } from './options';

interface Babel {
  types: typeof BabelTypes;
}

const plugin = (babel: Babel): PluginObj => ({
  name: 'babel-platform-resolver',

  pre(file) {
    this.babel_platform_resolver_visited_nodes = new Set();
    this.types = babel.types;

    const current_file = file.opts.filename;
    this.normalized_options = normalize_options(this.opts);
  },

  post() {
    (this.babel_platform_resolver_visited_nodes as Set<any>).clear();
  },

  visitor,
});

export { plugin as default };
