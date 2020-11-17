import ProductPage, { loadProductData } from "./cms/pricing/index"

export function getServerSideProps({ query }) {
    return loadProductData(query)
}

export default function HRMIndexPage(props) {
    return ProductPage(props)
}