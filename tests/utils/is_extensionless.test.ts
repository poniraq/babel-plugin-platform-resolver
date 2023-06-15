import { is_extensionless } from '../../src/utils';

describe('testing "is_extensionless" util', () => {
  const extensions = ['js', 'jsx', 'ts', 'tsx'];

  test('should return `false` given path with extension at the end', () => {
    const abs_filepaths = extensions.map(
      ext => `/projects/test/src/module.${ext}`
    );
    const rel_filepaths = extensions.map(ext => `./test_module.${ext}`);

    for (const filepath of abs_filepaths) {
      expect(is_extensionless(filepath, extensions)).toStrictEqual(false);
    }

    for (const filepath of rel_filepaths) {
      expect(is_extensionless(filepath, extensions)).toStrictEqual(false);
    }
  });

  test('should return `true` fiven path without extension at the end', () => {
    const filepaths = ['/projects/test/src/module', './test_module'];

    for (const filepath of filepaths) {
      expect(is_extensionless(filepath, extensions)).toStrictEqual(true);
    }
  });
});
