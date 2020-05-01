/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: 'gatsby-source-geo-api-fr',
      options: {
        endpoint: 'regions',
        type: 'region',
      },
    },
    {
      resolve: 'gatsby-source-geo-api-fr',
      options: {
        endpoint: 'departements',
        type: 'departement',
      },
    },
    {
      resolve: 'gatsby-source-geo-api-fr',
      options: {
        endpoint: 'communes',
        type: 'commune',
      },
    },
  ],
}
