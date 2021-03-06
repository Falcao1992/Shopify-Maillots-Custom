import React from 'react'
import PropTypes from 'prop-types'
import {StaticQuery, graphql} from 'gatsby'
import ContextProvider from '../provider/ContextProvider'
import Navigation from '../components/Navigation/Navigation'
import {createGlobalStyle, ThemeProvider} from "styled-components";
import theme from "../../resources/theme";
import "./layout.css"

const Layout = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            <ContextProvider>
                <GlobalStyle/>
                <StaticQuery query={graphql`
                query SiteTitleQuery {
                        site {
                            siteMetadata {
                                title
                            }
                        }
                    }
                `}
                             render={data => (
                                 <>
                                     <Navigation siteTitle={data.site.siteMetadata.title}/>
                                     <main>
                                         {children}
                                         <footer>
                                             © {new Date().getFullYear()}, Built with
                                             {` `}
                                             <a href="https://www.gatsbyjs.org">Eduardo</a>
                                         </footer>
                                     </main>
                                 </>
                             )}
                />
            </ContextProvider>
        </ThemeProvider>

    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

const GlobalStyle = createGlobalStyle`
  body {
    //background-color: red;
  }
  html {
      box-sizing: border-box;
      background-color: aliceblue;
  }
  *, *:before, *:after {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
  }
  main {
    width: 95%;
    margin: 6rem auto;
  }
  a {
      color: ${props => props.theme.colors.dark};
      text-decoration: none;
  }
`

export default Layout
