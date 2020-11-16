import ProductPage, { loadPricingData } from "./pricing/index"

export function getServerSideProps({ query }) {
    return loadPricingData(query)
}

export default function HRMIndexPage(props) {
    return ProductPage(props)
}