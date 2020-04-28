import dynamoDb from "./libs/dynamodb-lib";

import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const params = {
        TableName: process.env.KMC_PRODUCT
    };

    // const isSold = event.requestContext.isSold;

    try {
        const result = await dynamoDb.scan(params);

        // Return the matching list of items in response body
        return success(result.Items);
    } catch (e) {
        return failure(500, {
            message: e.message
        });
    }
};
