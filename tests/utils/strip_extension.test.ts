import { strip_extension } from '../../src/utils';

describe('testing "strip_extension" util', () => {
  const extensions = ['js', 'jsx', 'ts', 'tsx'];
  const platform_extensions = ['win', 'windows', 'desktop', 'web'];

  test('should strip extension given path with extension at the end', () => {
    const abs_filepaths = extensions.map(ext => ({
      with_ext: `/projects/test/src/module.${ext}`,
      without_ext: '/projects/test/src/module',
    }));

    const rel_filepaths = extensions.map(ext => ({
      with_ext: `./test_module.${ext}`,
      without_ext: './test_module',
    }));

    for (const { with_ext, without_ext } of abs_filepaths) {
      expect(
        strip_extension(with_ext, extensions, platform_extensions)
      ).toStrictEqual(without_ext);
    }

    for (const { with_ext, without_ext } of rel_filepaths) {
      expect(
        strip_extension(with_ext, extensions, platform_extensions)
      ).toStrictEqual(without_ext);
    }
  });

  test('should not change "extensionless" filepaths', () => {
    const filepaths = ['/projects/test/src/module', './test_module'];

    for (const filepath of filepaths) {
      expect(
        strip_extension(filepath, extensions, platform_extensions)
      ).toStrictEqual(filepath);
    }
  });

  test('should not strip extensions if not explicitly made aware of them', () => {
    const filepaths = [
      '/projects/test/src/module.base',
      '/projects/test/src/module.win',
      '/projects/test/src/module.desktop',
      './test_module.base',
      './test_module.win',
      './test_module.desktop',
    ];

    for (const filepath of filepaths) {
      expect(
        strip_extension(filepath, extensions, platform_extensions)
      ).toStrictEqual(filepath);
    }
  });
});
