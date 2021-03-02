export function getServerSideProps() {
    return {
        redirect: {
            destination: "/crm/sku/active",
        }
    };
}

export default function SkuPage() {
    return null;
}