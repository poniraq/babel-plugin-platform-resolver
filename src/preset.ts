import plugin from './plugin';

const preset = (_: unknown, opts: any) => {
  return {
    plugins: [[plugin, { ...opts }]],
  };
};

export { preset as default };
