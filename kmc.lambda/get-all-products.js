import * as dynamoDbLib from "./libs/dynamoDb-lib";

import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const params = {
        TableName: process.env.KMC_PRODUCT
    };

    const isSold = event.requestContext.isSold;

    console.log(`IsSold value: ${isSold}`);

    if (isSold) {
        console.log("Sold");
        return success({});
    }

    try {
        const result = await dynamoDbLib.call("scan", params);

        // Return the matching list of items in response body
        return success(result.Items);
    } catch (e) {
        return failure(500, {
            message: e.message
        });
    }
};
