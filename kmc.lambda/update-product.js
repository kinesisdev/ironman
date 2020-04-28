import * as dynamoDbLib from "./libs/dynamoDb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const data = JSON.parse(event.body);

    const productId = event.pathParameters.id;

    const getParams = {
        TableName: process.env.KMC_PRODUCT,
        Key: {
            productId: productId
        }
    };

    console.log(productId);

    const updateExpression =
        "SET #type = :type, "
            + "#name = :name, "
            + "#goldWeight = :goldWeight, "
            + "#beadWeight = :beadWeight, "
            + "#wage = :wage, "
            + "#goldPrice = :goldPrice, "
            + "#price = :price, "
            + "#updatedAt = :updatedAt";

    const updateParams = {
        TableName: process.env.KMC_PRODUCT,
        Key: {
            productId: productId
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: {
            ":type": data.type || null,
            ":name": data.name || null,
            ":goldWeight": data.goldWeight || null,
            ":beadWeight": data.beadWeight || null,
            ":price": data.price || null,
            ":goldPrice": data.goldPrice || null,
            ":wage": data.wage || null,
            ":updatedAt": Date.now()
        },
        ExpressionAttributeNames: {
            "#type": "type",
            "#name": "name",
            "#goldWeight": "goldWeight",
            "#beadWeight": "beadWeight",
            "#price": "price",
            "#goldPrice": "goldPrice",
            "#wage": "wage",
            "#updatedAt": "updatedAt"
        },
        ReturnValuse: "ALL_NEW"
    };

    try {
        var result = await dynamoDbLib.call("get", getParams);
        if (result.Item) {
            await dynamoDbLib.call("update", updateParams);
            var response = {
                message: `Successfully update product ${productId} info`,
            };
            return success(response);
        } else {
            return failure(501, {message: `ProductId ${productId} is not in database`});
        }
    } catch (e) {
        return failure(500, {message: e.message});
    }
}
