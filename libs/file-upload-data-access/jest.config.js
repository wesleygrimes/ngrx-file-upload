module.exports = {
  name: 'file-upload-data-access',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/file-upload-data-access',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
