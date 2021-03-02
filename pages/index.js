export function getServerSideProps() {
    return {
        redirect: {
            destination: "/crm/sku/active",
        }
    };
}

export default function IndexPage() {
    return null;
}