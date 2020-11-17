import ProductPage, { loadProductData } from "./crm/pricing/index"

export function getServerSideProps({ query }) {
    return loadProductData(query)
}

export default function HRMIndexPage(props) {
    return ProductPage(props)
}