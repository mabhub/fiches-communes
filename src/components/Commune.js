import React from 'react';

import { graphql } from 'gatsby';

const Commune = ({
  data: {
    commune: {
      nom,
      population,
      codesPostaux = [],
      departement,
      region,
    },
  },
  pageContext: { code: insee },
}) => {
  const breadcrumb = {};

  if (region) {
    breadcrumb.region = {
      children: region.nom,
      href: `/${region.slug}`,
    };
  }
  if (departement) {
    breadcrumb.departement = {
      children: departement.nom,
      href: breadcrumb.region
        ? `/${region.slug}/${departement.slug}`
        : `/${departement.slug}`,
    };
  }

  return (
    <section>
      {Object.values(breadcrumb).map(bcProps => (
        <span key={bcProps.href}>{' '}»{' '}<a {...bcProps} /></span>
      ))}
      <h1>{nom}</h1>

      <dl>
        <dt>INSEE</dt>
        <dd>{insee}</dd>

        <dt>Population</dt>
        <dd>{population}</dd>

        <dt>Code postaux</dt>
        {codesPostaux.map(codePostal => <dd>{codePostal}</dd>)}

        {departement && (
          <>
            <dt>Département</dt>
            <dd>{departement.nom} ({departement.code})</dd>
          </>
        )}

        {region && (
          <>
            <dt>Région</dt>
            <dd>{region.nom} ({region.code})</dd>
          </>
        )}
      </dl>
    </section>
  );
};

export default Commune;

export const query = graphql`
  query oneCommune ($code: String) {
    commune(code: {eq: $code}) {
      nom
      population
      codesPostaux
      region { code nom slug }
      departement { code nom slug }
    }
  }
`;
