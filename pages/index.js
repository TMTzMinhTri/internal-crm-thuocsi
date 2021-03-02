export function getServerSideProps() {
    return {
        redirect: {
            permanent: true,
            destination: "/crm/sku/active",
        }
    };
}

export default function IndexPage() {
    return null;
}