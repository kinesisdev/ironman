export default function (data) {
    if (data.productId == "" || data.productId == null) {
        return {
            message: "Missing product id"
        };
    }

    return null;
};
