const chalk = require('chalk');
const pkg = require('./package.json');
const path = require('path');

const customLog = (reporter, prefix) => (arg1, ...rest) =>
  reporter.log(`${chalk.magenta(prefix)} ${arg1}`, ...rest);

const createCommunesPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  const log = customLog(reporter, pkg.name);

  const { data: {
    allCommune: { communes },
  } } = await graphql(`
    query {
      allCommune {
        communes: nodes {
          nom
          slug
          code
          codesPostaux
          population
          region { slug }
          departement { slug }
        }
      }
    }
  `);

  log(`Start building ${chalk.bold(communes.length)} communes pages`);

  const eachCommune = ({ code, slug, departement, region }) => {
    const dptSlug = departement && departement.slug ? departement.slug : undefined;
    const regSlug = region && region.slug ? region.slug : undefined;
    const pathElements = [regSlug, dptSlug, slug].filter(Boolean).join('/');
    const pagePath = `/${pathElements}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/components/Commune.js'),
      context: { code },
    });
  };
  communes.forEach(eachCommune);
};

const createDepartementsPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  const log = customLog(reporter, pkg.name);

  const { data: {
    allDepartement: { departements },
  } } = await graphql(`
    query {
      allDepartement {
        departements: nodes {
          nom
          slug
          code
          region { slug }
        }
      }
    }
  `);

  log(`Start building ${chalk.bold(departements.length)} departements pages`);

  const eachDepartement = ({ code, slug, region }) => {
    const regSlug = region && region.slug ? region.slug : undefined;
    const pathElements = [regSlug, slug].filter(Boolean).join('/');
    const pagePath = `/${pathElements}`;

    createPage({
      path: pagePath,
      component: path.resolve('./src/components/Departement.js'),
      context: { code }
    })
  };
  departements.forEach(eachDepartement);
};

const createRegionsPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  const log = customLog(reporter, pkg.name);

  const { data: {
    allRegion: { regions },
  } } = await graphql(`
    query {
      allRegion {
        regions: nodes {
          nom
          slug
          code
        }
      }
    }
  `);

  log(`Start building ${chalk.bold(regions.length)} regions pages`);

  const eachRegion = ({ code, slug }) => {
    createPage({
      path: `/${slug}`,
      component: path.resolve('./src/components/Region.js'),
      context: { code }
    })
  };
  regions.forEach(eachRegion);
};

const createPages = async (...args) => {
  await createRegionsPages(...args);
  await createDepartementsPages(...args);
  await createCommunesPages(...args);
};

exports.createPages = createPages;
