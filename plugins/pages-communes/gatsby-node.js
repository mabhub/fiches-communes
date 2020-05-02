const chalk = require('chalk');
const pkg = require('./package.json');
const path = require('path');

const customLog = (reporter, prefix) => (arg1, ...rest) =>
  reporter.log(`${chalk.magenta(prefix)} ${arg1}`, ...rest);

const createPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  const log = customLog(reporter, pkg.name);

  const { data: { wrapper: { communes } } } = await graphql(`
    query {
      wrapper: allCommune {
        communes: nodes {
          nom
          slug
          code
          codesPostaux
          population
          region { nom slug }
          departement { nom slug }
        }
      }
    }
  `);

  log(`Start building ${chalk.bold(communes.length)} communes pages`);

  const eachCommune = commune => {
    const { slug, departement, region } = commune;
    const dptSlug = departement && departement.slug ? departement.slug : undefined;
    const regSlug = region && region.slug ? region.slug : undefined;
    const pathElements = [regSlug, dptSlug, slug].filter(Boolean).join('/');
    const pagePath = `/${pathElements}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/components/Commune.js'),
      context: { code: commune.code },
    });
  };

  communes.forEach(eachCommune);
};

exports.createPages = createPages;
