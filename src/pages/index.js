import React from "react"
import { graphql } from 'gatsby';

export default ({
  data: {
    allRegion: { regions },
    allCommune: { communes },
  },
}) => {
  return (
    <div>
      <h2>Régions</h2>

      {regions.map(({ nom, slug, departements }) => (
        <section key={slug}>
          <h3>{nom}</h3>

          <div>
            {departements.map(({ dptSlug, dptNom, code }, index) => (
              <>
                {Boolean(index) && ', '}
                <span key={dptSlug}>
                  <a href={`/${slug}/${dptSlug}`}>
                    {dptNom}
                  </a>
                  {Boolean(code) && ` (${code})`}
                </span>
              </>
            ))}
          </div>
        </section>
      ))}

      <h2>Communes hors régions</h2>

      <div>
        {communes.map(({ nom, slug }, index) => (
          <>
            {Boolean(index) && ', '}
            <span key={slug}><a href={`/${slug}`}>{nom}</a></span>
          </>
        ))}
      </div>
    </div>
  );
}

export const query = graphql`
  query homeQuery {
    allRegion(sort: {fields: slug}) {
      regions: nodes {
        nom
        slug
        departements: childrenDepartement {
          code
          dptNom: nom
          dptSlug: slug
        }
      }
    }

    allCommune(
      filter: {codeRegion: {eq: null}},
      sort: {fields: slug}
    ) {
      communes: nodes {
        nom
        slug
      }
    }
  }
`;
