import React from "react";
import Link from "gatsby-link";

import Header from "../components/Header";

export default ({ data }) => {
  console.log(data);
  const { edges: artwork } = data.allMarkdownRemark;
  const { profilePic, socialLinks } = data.markdownRemark.frontmatter;
  return (
    <div className="columns">
      <div className="column is-one-third bio">
        <Header profilePic={profilePic} socialLinks={socialLinks} />
      </div>
      <div className="column is-offset-one-third">
        <section className="section">
          <div className="container is-fluid">
            <div className="columns is-multiline">
              {artwork
                .filter(art => art.node.frontmatter.templateKey === "art-post")
                .map(({ node: art }, i) => (
                  <div className="art-gallery column is-6 is-4-fullhd" key={art.id}>
                    <p>
                      <Link to={art.fields.slug}>
                        <figure className="art image is-square">
                          <img src={art.frontmatter.image} />
                        </figure>
                      </Link>
                    </p>
                    <p style={{ padding: "1em 0" }}>
                      <small>{art.frontmatter.date}</small>
                      <br />
                      <Link className="has-text-primary" to={art.fields.slug}>
                        {art.frontmatter.title}
                      </Link>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const homePageQuery = graphql`
  query HomePage($id: String!) {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            description
            image
          }
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        profilePic
        socialLinks {
          icon
          url
        }
      }
    }
  }
`;
