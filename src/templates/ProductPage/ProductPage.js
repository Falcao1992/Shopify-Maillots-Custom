import React from 'react'
import {graphql} from 'gatsby'

import SEO from '~/components/seo'
import ProductForm from '~/components/ProductForm'
import Image from "gatsby-image"

const ProductPage = ({data}) => {
    const product = data.shopifyProduct
    console.log(product, "product")
    return (
        <>
            <SEO title={product.title} description={product.description}/>
            <div>
                <div>
                    <div>
                        {product.images.map(image => (
                            <Image
                                fluid={image.localFile.childImageSharp.fluid}
                                key={image.id}
                                alt={product.title}
                            />
                        ))}
                    </div>
                    <div>
                        <h1>{product.title}</h1>
                        <div
                            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
                        />
                        <ProductForm product={product}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export const query = graphql`
  query($handle: String!) {
    shopifyProduct(handle: { eq: $handle }) {
      id
      title
      handle
      productType
      description
      descriptionHtml
      shopifyId
      options {
        id
        name
        values
      }
      variants {
        id
        title
        price
        availableForSale
        shopifyId
        selectedOptions {
          name
          value
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images {
        originalSrc
        id
        localFile {
          childImageSharp {
            fluid(maxWidth: 910) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }
  }
`

export default ProductPage
