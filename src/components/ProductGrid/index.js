import React, {useContext} from 'react'
import {useStaticQuery, graphql, Link} from 'gatsby'
import styled from "styled-components";

import StoreContext from '../../context/StoreContext'
import Image from 'gatsby-image'

const ProductGrid = () => {
    const {store: {checkout}} = useContext(StoreContext)
    const {allShopifyProduct} = useStaticQuery(
        graphql`
            query {
                allShopifyProduct(sort: {fields: [createdAt]order: DESC}) {
                    edges {
                        node {
                            id
                            title
                            handle
                            createdAt
                            images {
                                id
                                originalSrc
                            localFile {
                                childImageSharp {
                                    fluid(maxWidth: 910) {
                                        ...GatsbyImageSharpFluid_withWebp_tracedSVG
                                    }
                                }
                            }
                            }
                            variants {
                                price
                            }
                        }
                    }
                }
            }
    `
    )

    const getPrice = price => Intl.NumberFormat(undefined, {
        currency: checkout.currencyCode ? checkout.currencyCode : 'EUR',
        minimumFractionDigits: 2,
        style: 'currency',
    }).format(parseFloat(price ? price : 0))

    return (
        <ProductGridContainer>
            {allShopifyProduct.edges
                ? allShopifyProduct.edges.map(({node: {id, handle, title, images: [firstImage], variants: [firstVariant]}}) => (
                    <ProductBlock key={id}>
                        <Link to={`/product/${handle}/`}>
                            {firstImage && firstImage.localFile &&
                            (<Image
                                fluid={firstImage.localFile.childImageSharp.fluid}
                                alt={handle}
                            />)}
                        </Link>
                        <span>{title}</span>
                        <span>{getPrice(firstVariant.price)}</span>
                    </ProductBlock>
                ))
                : <p>No Products found!</p>}
        </ProductGridContainer>
    )
}

const ProductGridContainer = styled.section`
    display: flex;
    margin: ${props => props.theme.spaces.containerSpaceH} auto;
`
const ProductBlock = styled.article`
    
`

export default ProductGrid
