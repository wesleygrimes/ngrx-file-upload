module.exports = {
  name: 'file-upload',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/file-upload',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
