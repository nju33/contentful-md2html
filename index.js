const core = require('@actions/core');
const {process} = require('./lib');

const run = async () => {
  try {
    const contentManagementToken = core.getInput('content_management_token');
    const spaceId = core.getInput('space_id');
    const environmentId = core.getInput('environment_id');
    const entryId = core.getInput('entry_id');
    const srcFieldName = core.getInput('src_field_name');
    const destFieldName = core.getInput('dest_field_name');

    await process({
      contentManagementToken,
      spaceId,
      environmentId,
      entryId,
      srcFieldName,
      destFieldName
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
