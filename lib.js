const {createClient} = require('contentful-management');
const unified = require('unified');
const prism = require('@mapbox/rehype-prism');
const minify = require('rehype-preset-minify');
const stringify = require('rehype-stringify');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');
const raw = require('remark-raw');

/**
 * compile markdown to html
 * @param {string} contents a markdown contents
 * @returns {Promise<string>} a html contents
 */
const md2html = contents => {
  return new Promise((resolve, reject) => {
    unified()
      .use(markdown)
      .use(remark2rehype, {allowDangerousHTML: true})
      .use(raw)
      .use(prism, {ignoreMissing: true})
      .use(minify)
      .use(stringify)
      .process(contents, (err, file) => {
        if (err !== null) {
          return reject(err);
        }

        resolve(file.contents);
      });
  });
};

/**
 * update target entry
 * @param {Object} inputs
 * @param {string} inputs.contentManagementToken
 * @param {string} inputs.spaceId
 * @param {string} inputs.environmentId
 * @param {string} inputs.entryId
 * @param {string} inputs.srcFieldName
 * @param {string} inputs.destFieldName
 * @returns {Promise}
 */
const process = ({
  contentManagementToken,
  spaceId,
  environmentId,
  entryId,
  srcFieldName,
  destFieldName
}) => {
  return new Promise(async (resolve, reject) => {
    const errorProps = [];

    if (typeof contentManagementToken !== 'string') {
      errorProps.push('content_management_token');
    }

    if (typeof spaceId !== 'string') {
      errorProps.push('space_id');
    }

    if (typeof environmentId !== 'string') {
      errorProps.push('environment_id');
    }

    if (typeof entryId !== 'string') {
      errorProps.push('entry_id');
    }

    if (typeof srcFieldName !== 'string') {
      errorProps.push('src_field_name');
    }

    if (typeof destFieldName !== 'string') {
      errorProps.push('dest_field_name');
    }

    if (errorProps.length > 0) {
      return reject(new Error(`${errorProps.join()} is not string`));
    }

    const client = createClient({
      accessToken: contentManagementToken
    });

    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);
    const entry = await environment.getEntry(entryId);

    const contents = entry.fields[srcFieldName].ja;
    const html = await md2html(contents);

    if (entry.fields[destFieldName] === void 0) {
      entry.fields[destFieldName] = {ja: html};
      await entry.update().then(updated => updated.publish());
      resolve();
      return;
    }

    if (entry.fields[destFieldName].ja === html) {
      resolve();
      return;
    }

    entry.fields[destFieldName].ja = html;
    await entry.update().then(updated => updated.publish());
    resolve();
    return;
  });
};

module.exports = {process};
