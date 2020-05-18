import React from 'react';

import { graphql, Link } from 'gatsby';

const Departement = ({
  data: {
    departement:  {
      nom,
      slug,
      region,
      code,
      communes = [],
    },
  },
}) => {
  const breadcrumb = {
    home: {
      children: 'France',
      to: '/',
    },
  };

  if (region) {
    breadcrumb.region = {
      children: region.nom,
      to: `/${region.slug}/`,
    };
  }

  return (
    <section>
      {Object.values(breadcrumb).map(bcProps => (
        <span key={bcProps.to}>{' '}»{' '}<Link {...bcProps} /></span>
      ))}
      <h1>{nom} ({code})</h1>

      <h3>Communes du département :</h3>

      {communes.map((commune, index) => (
        <React.Fragment key={commune.code}>
          {Boolean(index) && ', '}
          <Link to={`/${region.slug}/${slug}/${commune.slug}/`}>
            {commune.nom}
          </Link>{' '}
          ({commune.code})
        </React.Fragment>
      ))}
    </section>
  );
};

export default Departement;

export const query = graphql`
  query oneDepartement ($code: String) {
    departement(code: {eq: $code}) {
      nom
      slug
      code
      region { code nom slug }
      communes: childrenCommune { nom slug code }
    }
  }
`;
