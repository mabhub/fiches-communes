const fetch = require('node-fetch');

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
  const rawResponse = await fetch(`https://geo.api.gouv.fr/${endpoint}`);
  const items = await rawResponse.json();

  items.forEach(item => {
    const { code } = item;
    const newNode = {
      ...item,

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

  reporter.info(`${items.length} ${type}s`);
};
