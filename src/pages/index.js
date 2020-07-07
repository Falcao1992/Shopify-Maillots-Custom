import React from 'react'
import {Link} from 'gatsby'
import styled from "styled-components";
import SEO from '../components/seo'
import ProductGrid from '../components/ProductGrid'

const IndexPage = () => (
    <ContainerPage>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]}/>
        <h1>Liste des produits</h1>
        <p>Voici une selection des maillots que vous pouvais customiser.</p>
        <ProductGrid/>
        <Link to="/page-2/">Go to page 2</Link>
    </ContainerPage>
)

const ContainerPage = styled.div`

`

export default IndexPage
