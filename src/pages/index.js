import React from "react"
import { graphql } from 'gatsby';

export default ({
  data: { allSitePage: { groups } = {} } = {},
}) => {
  return (
    <div>
      <pre>
        {groups.map(({ name, pages }) => (
          <section key={name}>
            <h2>{name}</h2>
            <ul>
              {pages.map(({ path }) => (
                <li key={path}><a href={path}>{path}</a></li>
              ))}
            </ul>
          </section>
        ))}
      </pre>
    </div>
  );
}

export const query = graphql`
  query MyQuery {
    allSitePage(sort: {fields: path}) {
      groups: group(field: pluginCreator___name) {
        name: fieldValue
        pages: nodes { path }
      }
    }
  }
`;
