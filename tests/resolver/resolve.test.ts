import { resolve } from '../../src/resolver';

const resolveMock = jest.fn();
let originalResolve: NodeJS.RequireResolve;
beforeAll(() => {
  originalResolve = require.resolve;
  require.resolve = resolveMock as any;
});
afterAll(() => {
  require.resolve = originalResolve;
});

describe('testing "resolver" module', () => {
  const extensions = ['js', 'jsx', 'ts', 'tsx'];
  const platform_extensions = ['win', 'windows', 'desktop', 'web'];
  const options = {
    basedir: '/projects/test/src/',
    log: false,
    platform_extensions,
    extensions,
  };

  test('should not transform path if it already has platform-specific extension', () => {
    const extensionless_abs_filepaths = platform_extensions.map(
      platform_ext => `/projects/test/src/module.${platform_ext}`
    );
    const extensionless_rel_filepaths = platform_extensions.map(
      platform_ext => `./test_module.${platform_ext}`
    );

    const abs_filepaths = extensionless_abs_filepaths
      .map(filepath => extensions.map(ext => `${filepath}.${ext}`))
      .flat();
    const rel_filepaths = extensionless_rel_filepaths
      .map(filepath => extensions.map(ext => `${filepath}.${ext}`))
      .flat();

    const filepaths = [
      ...extensionless_abs_filepaths,
      ...extensionless_rel_filepaths,
      ...abs_filepaths,
      ...rel_filepaths,
    ];

    for (const filepath of filepaths) {
      expect(resolve(filepath, options)).toStrictEqual(filepath);
    }
  });

  test('require.resolve mock', () => {
    resolveMock.mockReturnValueOnce('mocked module');
    expect(require.resolve('./some-fake-module')).toStrictEqual(
      'mocked module'
    );

    resolveMock.mockReturnValueOnce('mocked module');
    expect(resolve('./some-fake-module', options)).toStrictEqual(
      'mocked module'
    );
  });
});
