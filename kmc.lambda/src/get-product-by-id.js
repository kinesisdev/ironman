import dynamoDb from "./libs/db-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const getParams = {
        TableName: process.env.KMC_PRODUCT,
        Key: {
            productId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDb.get(getParams);
        if (result.Item) {
            return success({product: result.Item});
        } else {
            return failure(500, {
                message: "Item not found"
            });
        }
    } catch (e) {
        return failure(500, {
            message: e.message
        });
    }
}
