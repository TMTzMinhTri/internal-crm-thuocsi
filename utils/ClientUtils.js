export function isValid(resp) {
    return (
        resp && resp.status && resp.status === "OK" && resp.data && resp.data[0]
    );
}

export function getFirst(resp, def = null) {
    return resp && resp.data && resp.data.length > 0 ? resp.data[0] : def;
}
