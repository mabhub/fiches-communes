const fetch = require('node-fetch');
const chalk = require('chalk');
const slugify = require('slugify');
slugify.extend({ '\'': '-' });

const pkg = require('./package.json');

const fetchJson = async (...fetchArgs) => {
  const raw = await fetch(...fetchArgs);
  const json = raw.json();
  return json;
};

const customLog = (reporter, prefix) => (arg1, ...rest) =>
  reporter.log(`${chalk.magenta(prefix)} ${arg1}`, ...rest);

exports.sourceNodes = async ({
  actions: { createNode, createParentChildLink },
  createNodeId,
  createContentDigest,
  getNode,
  cache,
  reporter,
}, {
  apiPrefix = 'https://geo.api.gouv.fr',
  endpoint,
  type = slugify(endpoint),
}) => {
  const log = customLog(reporter, pkg.name);

  const fetchPath = `${apiPrefix}${endpoint}`;
  const cacheKey = `${endpoint}${type}`;
  const cacheMaxAge = 1000 * 60 * 60 * 24 * 7; //ms
  let cachedData = await cache.get(cacheKey);

  if (!cachedData) {
    log(`No cache for ${chalk.bold(endpoint)}. ${chalk.gray('Fetching…')}`);
    cachedData = { last: Date.now(), items: await fetchJson(fetchPath) };
  } else if (Date.now() > cachedData.last + cacheMaxAge) {
    log(`Cache for ${chalk.bold(endpoint)} too old. ${chalk.gray('Fetching…')}`);
    cachedData = { last: Date.now(), items: await fetchJson(fetchPath) };
  } else {
    log(`Using cache for ${chalk.bold(endpoint)}.`);
  }

  await cache.set(cacheKey, cachedData);
  const { items } = cachedData;

  items.forEach(item => {
    const { code, nom } = item;
    const newNode = {
      ...item,

      slug: slugify(nom, { strict: true }),
      id: createNodeId(`${type}${code}`),
      parent: null,
      children: [],
      internal: {
        type,
        contentDigest: createContentDigest(item),
      },
    };

    if (item.codeRegion) {
      newNode.region___NODE = createNodeId(`region${item.codeRegion}`);
    }

    if (type === 'departement') {
      newNode.parent = newNode.region___NODE;
    }

    if (item.codeDepartement) {
      newNode.departement___NODE = createNodeId(`departement${item.codeDepartement}`);
    }

    if (type === 'commune') {
      newNode.parent = newNode.departement___NODE;
    }

    if (newNode.parent && getNode(newNode.parent)) {
      createParentChildLink({ parent: getNode(newNode.parent), child: newNode })
    }

    createNode(newNode);
  });

  log(`${chalk.bold.green(items.length)} ${type}s`);
};
