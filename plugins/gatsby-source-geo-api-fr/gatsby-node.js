const fetch = require('node-fetch');
const chalk = require('chalk');
const slugify = require('slugify');

const fetchJson = async (...fetchArgs) => {
  const raw = await fetch(...fetchArgs);
  const json = raw.json();
  return json;
};

exports.sourceNodes = async ({
  actions: { createNode, createParentChildLink },
  createNodeId,
  createContentDigest,
  getNode,
  cache,
  reporter,
}, {
  endpoint,
  type = endpoint,
}) => {
  const fetchPath = `https://geo.api.gouv.fr/${endpoint}`;

  const cacheKey = `${endpoint}${type}`;
  const cacheMaxAge = 1000 * 60 * 60; //ms
  let cachedData = await cache.get(cacheKey);

  const log = (arg1, ...rest) => reporter.log(`${chalk.magenta('geo-api-fr')} ${arg1}`, ...rest)

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

      slug: slugify(nom),
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
