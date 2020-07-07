import React, {useContext} from 'react'
import reduce from 'lodash/reduce'
import PropTypes from 'prop-types'
import {Link} from "gatsby"

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
        <div>
            <div>
                <Link to='/'>
                    {siteTitle}
                </Link>
                <Link to='/cart'>
                    {hasItems &&
                    <span>
							{quantity}
						</span>
                    }
                    Cart 🛍
                </Link>
            </div>
        </div>
    )
}

Navigation.propTypes = {
    siteTitle: PropTypes.string,
}

Navigation.defaultProps = {
    siteTitle: ``,
}

export default Navigation
