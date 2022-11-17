import { Visitor } from '@babel/traverse';
import { ExportDeclaration, ImportDeclaration } from '@babel/types';
import ImportExportVisitor from './import_export';
import CallVisitor from './call';

const visitors = {
  ImportDeclaration: ImportExportVisitor<ImportDeclaration>,
  ExportDeclaration: ImportExportVisitor<ExportDeclaration>,
  CallExpression: CallVisitor,
};

// const visitor: Visitor = {
//   Program: {
//     enter(program_path, state) {
//       program_path.traverse(visitors, state);
//     },

//     exit(program_path, state) {
//       program_path.traverse(visitors, state);
//     },
//   },
// };

const visitor: Visitor = {
  ImportDeclaration: {
    enter(path, state) {
      ImportExportVisitor<ImportDeclaration>(path, state);
    },
    exit(path, state) {
      ImportExportVisitor<ImportDeclaration>(path, state);
    },
  },

  ExportDeclaration: {
    enter(path, state) {
      ImportExportVisitor<ExportDeclaration>(path, state);
    },
    exit(path, state) {
      ImportExportVisitor<ExportDeclaration>(path, state);
    },
  },

  CallExpression: {
    enter(path, state) {
      CallVisitor(path, state);
    },
    exit(path, state) {
      CallVisitor(path, state);
    },
  },
};

// const visitor = visitors;

export { visitor as default, visitor };
