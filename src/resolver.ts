import path from 'path';
import { strip_extension, is_extensionless } from './utils';

type TOptions = {
  basedir: string;
  platform_extensions: Array<string>;
  extensions: Array<string>;
  log: boolean;
};

const is_module_import = (filepath: string, options: TOptions): boolean => {
  const { basedir } = options;

  try {
    require.resolve(filepath, { paths: [basedir] });
  } catch (e) {
    return false;
  }

  return true;
};

const is_already_specific = (filepath: string, options: TOptions): boolean => {
  const { platform_extensions, extensions } = options;
  const extensionless = is_extensionless(filepath, extensions);
  const parsed = path.parse(filepath);

  let name = parsed.name;
  let ext = parsed.ext;
  if (extensionless) {
    /**
     * filepath = 'example_file.win' // e.g. "extensionless"
     * -> parsed.name = example_file
     * -> parsed.ext = win
     */
    if (parsed.ext !== '') {
      name += parsed.ext;
    }
    ext = '';
  }

  let ends_with_platform = false;
  for (const platform_extension of platform_extensions) {
    if (name.endsWith(`.${platform_extension}`)) {
      ends_with_platform = true;
      break;
    }
  }

  const ext_no_dot = ext.replace(/^\./g, '');
  return ends_with_platform && (ext === '' || extensions.includes(ext_no_dot));
};

const try_resolve = (filepath: string, options: TOptions): string | null => {
  const { platform_extensions, extensions, basedir } = options;
  const filepath_stripped = strip_extension(
    filepath,
    extensions,
    platform_extensions
  );

  for (const platform_extension of platform_extensions) {
    for (const extension of extensions) {
      const alternative_filepath = `${filepath_stripped}.${platform_extension}.${extension}`;
      const is_relative = alternative_filepath.startsWith('.');
      const absolute_filepath = is_relative
        ? path.resolve(basedir, alternative_filepath)
        : alternative_filepath;

      try {
        return require.resolve(absolute_filepath, { paths: [basedir] });
      } catch (e) {
        // noop
      }
    }
  }

  return null;
};

const resolve = (filepath: string, options: TOptions): string | null => {
  if (is_already_specific(filepath, options)) {
    return filepath;
  }

  return require.resolve(filepath);

  if (is_module_import(filepath, options)) {
    const resolved_path = require.resolve(filepath, {
      paths: [options.basedir],
    });
    return try_resolve(resolved_path, options);
  }

  const file_resolution = try_resolve(filepath, options);
  if (file_resolution) {
    return file_resolution;
  }

  const index_file = `${filepath}/index`;
  const index_resolution = try_resolve(index_file, options);
  if (index_resolution) {
    return index_resolution;
  }

  return null;
};

export { resolve, resolve as default };
