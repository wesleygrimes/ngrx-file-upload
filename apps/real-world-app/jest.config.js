module.exports = {
  name: 'real-world-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/real-world-app',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
