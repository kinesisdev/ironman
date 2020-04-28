import validate from "./libs/validations/sell-product-validation";
import dynamoDb from "./libs/db-lib";
import { success, failure } from "./libs/response-lib";
import * as uuid from "uuid";

export async function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const err = validate(data);

    if (err) {
        return failure(500, err.message);
    }

    const putHistoryParams = {
        TableName: process.env.KMC_HISTORY,
        Item: {
            soldUser: event.requestContext.identity.cognitoIdentityId,
            historyId: uuid.v1(),
            productId: data.productId,
            soldAt: Date.now(),
            updatedAt: Date.now()
        }
    };

    const updateProductParams = {
        TableName: process.env.KMC_PRODUCT,
        Key: {
            productId: data.productId
        },
        UpdateExpression: "SET isSold = :isSold",
        ExpressionAttributeValues: {
            ":isSold": true,
        },
        ReturnValuse: "ALL_NEW"
    };

    const getProductParams = {
        TableName: process.env.KMC_PRODUCT,
        Key: {
            productId: data.productId
        }
    };

    try {
        var product = await dynamoDb.get(getProductParams);
        if (product.Item) {
            await dynamoDb.put(putHistoryParams);
            await dynamoDb.update(updateProductParams);
            var response = {
                message: "Successfully sell product",
                productId: putHistoryParams.Item.productId
            };
            return success(response);
        } else {
            return failure(501, {message: "ProductId ${productId} is not in database"});
        }
    } catch (e) {
        return failure(500, { message: e.message });
    }
}
