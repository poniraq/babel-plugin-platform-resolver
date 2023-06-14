import { createSelector } from 'reselect';

const default_extensions = ['js', 'jsx', 'ts', 'tsx'];

const default_platforms = {
  windows: ['windows', 'desktop', 'web'],
  macos: ['macos', 'osx', 'desktop', 'web'],
  desktop: ['desktop', 'web'],
  ios: ['ios', 'native'],
  android: ['android', 'native'],
};

const default_transform_functions = [
  'require',
  'require.resolve',
  'System.import',

  // Jest methods
  'jest.genMockFromModule',
  'jest.mock',
  'jest.unmock',
  'jest.doMock',
  'jest.dontMock',
  'jest.setMock',
  'jest.requireActual',
  'jest.requireMock',

  // Older Jest methods
  'require.requireActual',
  'require.requireMock',
];

export type NormalizedOptions = {
  transform_functions: Array<string>;
  extensions: Array<string>;
  platforms: typeof default_platforms;
  platform: keyof typeof default_platforms;
  platform_extensions: Array<string>;
  log: boolean;
};

const normalize_options = createSelector(
  (opts: any) => opts,
  opts => {
    const transform_functions = [
      ...default_transform_functions,
      ...(opts.transform_functions || []),
    ];
    const extensions = opts.extensions || default_extensions;
    const platforms = {
      ...default_platforms,
      ...(opts.platforms || {}),
    };
    const platform = opts.platform || 'desktop';
    const platform_extensions = platforms[platform];
    const log = Boolean(opts.platform) || false;

    return {
      transform_functions,
      extensions,
      platforms,
      platform,
      platform_extensions,
      log,
    };
  }
);

export { normalize_options as default, normalize_options };
