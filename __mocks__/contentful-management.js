const entry = {
  fields: {
    content: {
      ja: '# title'
    }
  }
};

entry.update = jest.fn().mockResolvedValue(entry);
entry.publish = jest.fn().mockResolvedValue(entry);

const environment = {
  getEntry: jest.fn().mockResolvedValue(entry)
};

const space = {
  getEnvironment: jest.fn().mockResolvedValue(environment)
};

const client = {
  getSpace: jest.fn().mockResolvedValue(space)
};

exports._entry = entry;
exports.createClient = () => client;
