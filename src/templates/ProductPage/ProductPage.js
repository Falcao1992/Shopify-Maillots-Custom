import React, {useState} from 'react'
import {graphql} from 'gatsby'

import SEO from '~/components/seo'
import ProductForm from '~/components/ProductForm'
import CanvasTshirt from "../../components/CanvasTshirt/CanvasTshirt";
import styled from "styled-components";
import Image from "gatsby-image"

const ProductPage = ({data}) => {

    const [imageChoose, setImageChoose] = useState(0)
    const product = data.shopifyProduct

    const selectImagePreview = (e,i) => {
        e.preventDefault()
        setImageChoose(parseInt(i))
    }

    return (
        <>
            <SEO title={product.title} description={product.description}/>
            <div>
                <CanvasTshirt shirtImages={product.images} />
                <div>
                    <h1>{product.title}</h1>
                    {product.images.filter((img,i) => i === imageChoose).map((image) => (
                        <BlockImageChoose
                            key={image.id}
                        >
                            <Image
                                fluid={image.localFile.childImageSharp.fluid}
                                alt={product.title}
                            />
                        </BlockImageChoose>
                    ))}
                    <ContainerMiniatures>
                        {product.images.map((image, index) => (
                            <BlockImageMiniature
                                onClick={(e) => selectImagePreview(e,index)}
                                key={image.id}
                                isselected={imageChoose === index}
                            >
                                <Image
                                    fluid={image.localFile.childImageSharp.fluid}
                                    alt={product.title}
                                />
                            </BlockImageMiniature>
                        ))}
                    </ContainerMiniatures>
                    <BlockBody>
                        <BlockDescription
                            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
                        />
                        <ProductForm product={product}/>
                    </BlockBody>
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

const ContainerMiniatures = styled.div`
    display: flex;
`
const BlockImageChoose = styled.div`
    width: 100%;
    overflow: hidden;
    max-height: 60vh;
    margin-bottom: 2rem;
`

const BlockImageMiniature = styled.div`
    display: inline-grid;
    width: 100%;
    height: 20vh;
    overflow: hidden;
    border: ${props => props.isselected && '5px solid blue'};
`

const BlockBody = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
`

const BlockDescription = styled.div`
    padding: 1rem 0;
`

export default ProductPage
