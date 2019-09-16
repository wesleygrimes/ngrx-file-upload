module.exports = {
  name: 'ngrx-file-upload',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ngrx-file-upload',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
