import React, {useContext} from 'react'
import reduce from 'lodash/reduce'
import PropTypes from 'prop-types'
import {Link} from "gatsby"
import styled from "styled-components";

import { Icon, InlineIcon } from '@iconify/react';
import bxCart from '@iconify/icons-bx/bx-cart';


import StoreContext from '../../context/StoreContext'


const useQuantity = () => {
    const {store: {checkout}} = useContext(StoreContext)
    const items = checkout ? checkout.lineItems : []
    const total = reduce(items, (acc, item) => acc + item.quantity, 0)
    return [total !== 0, total]
}

const Navigation = ({siteTitle}) => {
    const [hasItems, quantity] = useQuantity()

    return (
        <Header>
            <NavStyled>
                <Link to='/'>
                    {siteTitle}
                </Link>
                <LinkIconCart to='/cart'>
                    {hasItems &&
                    <ItemAddCartSpan>{quantity}</ItemAddCartSpan>
                    }
                    <Icon icon={bxCart} width="40" height="40" />
                </LinkIconCart>
            </NavStyled>
        </Header>
    )
}

const Header = styled.header`
    position: fixed;
    background-color: lightgray;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
`

const NavStyled = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem;
`

const LinkIconCart = styled(Link)`
    position: relative;
    
`

const ItemAddCartSpan = styled.span`
    position: absolute;
    top: -1rem;
    right: -.5rem;
    font-size: 1.5rem;
    background-color: aliceblue;
    border-radius: 50%;
    padding: .2rem;
`

Navigation.propTypes = {
    siteTitle: PropTypes.string,
}

Navigation.defaultProps = {
    siteTitle: ``,
}

export default Navigation
