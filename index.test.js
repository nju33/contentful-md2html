const {_entry} = require('contentful-management');
const toSnakeCase = require('to-snake-case');
const {process} = require('./lib');
const nodeProcess = require('process');
const cp = require('child_process');
const path = require('path');

jest.mock('contentful-management');

describe('arguments', () => {
  describe.each([
    ['contentManagementToken'],
    ['spaceId'],
    ['environmentId'],
    ['entryId'],
    ['srcFieldName'],
    ['destFieldName']
  ])('%s', propName => {
    test(`throws but not including to the error message`, async () => {
      try {
        await process({[propName]: '_'});
      } catch (err) {
        expect(err.message).toEqual(
          expect.not.stringMatching(toSnakeCase(propName))
        );
      }
    });

    test(`throws and including to the error message`, async () => {
      try {
        await process({});
      } catch (err) {
        expect(err.message).toEqual(
          expect.stringMatching(toSnakeCase(propName))
        );
      }
    });
  });
});

beforeEach(() => {
  _entry.update.mockClear();
  _entry.publish.mockClear();
});

test('call Entry#update and Entry#publish', async () => {
  await process({
    contentManagementToken: 'TOKEN',
    spaceId: 'SPACE',
    environmentId: 'ENVIRONMENT',
    entryId: 'ENTRY',
    srcFieldName: 'content',
    destFieldName: 'html'
  });

  expect(_entry.update).toHaveBeenCalledTimes(1);
  expect(_entry.publish).toHaveBeenCalledTimes(1);
});

// // shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   nodeProcess.env['INPUT_CONTENT_MANAGEMENT_TOKEN'] = 'TOKEN';
//   nodeProcess.env['INPUT_SPACE_ID'] = 'SPACE';
//   nodeProcess.env['INPUT_ENVIRONMENT_ID'] = 'ENVIRONMENT';
//   nodeProcess.env['INPUT_ENTRY_ID'] = 'ENTRY';
//   nodeProcess.env['INPUT_SRC_FIELD_NAME'] = 'content';
//   nodeProcess.env['INPUT_DESC_FIELD_NAME'] = 'html';

//   const ip = path.join(__dirname, 'index.js');

//   console.log(cp.execSync(`node ${ip}`).toString());

//   expect(_entry.update).toHaveBeenCalledTimes(1);
//   expect(_entry.publish).toHaveBeenCalledTimes(1);
// });
