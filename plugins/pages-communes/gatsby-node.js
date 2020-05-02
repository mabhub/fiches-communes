const chalk = require('chalk');
const pkg = require('./package.json');
const path = require('path');

const customLog = (reporter, prefix) => (arg1, ...rest) =>
  reporter.log(`${chalk.magenta(prefix)} ${arg1}`, ...rest);

exports.createPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  const log = customLog(reporter, pkg.name);

  const { data: { wrapper: { communes } } } = await graphql(`
    query {
      wrapper: allCommune(
        limit: 10,
        filter: {population: {gte: 10000}}
      ) {
        communes: nodes {
          nom
          slug
          code
          codesPostaux
          population
          region {
            nom
            slug
          }
          departement {
            nom
            slug
          }
        }
      }
    }
  `);

  log(`Start building ${chalk.bold(communes.length)} communes pages`);
  communes.forEach(commune => {
    const { slug, departement, region } = commune;
    const pathElements = [region.slug, departement.slug, slug].filter(Boolean).join('/');
    const pagePath = `/${pathElements}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/components/Debug.js'),
      context: commune,
    });
  });
};
