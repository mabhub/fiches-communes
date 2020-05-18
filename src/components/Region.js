import React from 'react';

import { graphql, Link } from 'gatsby';

const Region = ({
  data: {
    region:  {
      nom,
      slug,
      region,
      code,
      departements = [],
    },
  },
}) => {
  const breadcrumb = {
    home: {
      children: 'France',
      to: '/',
    },
  };

  return (
    <section>
      {Object.values(breadcrumb).map(bcProps => (
        <span key={bcProps.to}>{' '}»{' '}<Link {...bcProps} /></span>
      ))}
      <h1>{nom} ({code})</h1>

      <h3>Départements de la région :</h3>

      {departements.map((departement, index) => (
        <React.Fragment key={departement.code}>
          {Boolean(index) && ', '}
          <Link to={`/${slug}/${departement.slug}/`}>
            {departement.nom}
          </Link>{' '}
          ({departement.code})
        </React.Fragment>
      ))}
    </section>
  );
};

export default Region;

export const query = graphql`
  query oneRegion ($code: String) {
    region(code: {eq: $code}) {
      nom
      slug
      code
      departements: childrenDepartement { nom slug code }
    }
  }
`;
