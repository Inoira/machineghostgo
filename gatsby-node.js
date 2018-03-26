const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()));
      return Promise.reject(result.errors);
    }
    result.data.allMarkdownRemark.edges.forEach(edge => {
      const id = edge.node.id;
      let slug = edge.node.fields.slug;
      if (slug === "/home/") slug = "/";
      createPage({
        path: slug,
        component: path.resolve(`src/templates/${String(edge.node.frontmatter.templateKey)}.js`),
        context: {
          id
        }
      });
    });
  });
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;
  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value
    });
  }
};
