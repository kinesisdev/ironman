import validate from "./libs/validations/sell-product-validation";
import dynamoDb from "./libs/db-lib";
import { success, failure } from "./libs/response-lib";
import shortid from "shortid";

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
            historyId: shortid.generate(),
            productId: data.productId,
            goldPrice: data.goldPrice,
            reducedPrice: data.reducedPrice,
            totalPrice: data.totalPrice,
            soldAt: Date.now(),
            updatedAt: Date.now()
        }
    };

    const updateExpression =
        "SET #type = :type, "
            + "#name = :name, "
            + "#goldWeight = :goldWeight, "
            + "#beadWeight = :beadWeight, "
            + "#wage = :wage, "
            + "#goldPrice = :goldPrice, "
            + "#price = :price, "
            + "#updatedAt = :updatedAt, "
            + "#isSold = :isSold";

    const updateProductParams = {
        TableName: process.env.KMC_PRODUCT,
        Key: {
            productId: data.productId
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
            ":updatedAt": Date.now(),
            ":isSold": true
        },
        ExpressionAttributeNames: {
            "#type": "type",
            "#name": "name",
            "#goldWeight": "goldWeight",
            "#beadWeight": "beadWeight",
            "#price": "price",
            "#goldPrice": "goldPrice",
            "#wage": "wage",
            "#updatedAt": "updatedAt",
            "#isSold": "isSold"
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
            const historyItem = await dynamoDb.put(putHistoryParams);
            const productItem = await dynamoDb.update(updateProductParams);
            var response = {
                message: "Successfully sell product",
                historyId: historyItem.historyId,
                goldPrice: historyItem.goldPrice,
                reducedPrice: historyItem.reducedPrice,
                totalPrice: historyItem.totalPrice,
                ...productItem
            };
            return success(response);
        } else {
            return failure(501, {message: "ProductId ${productId} is not in database"});
        }
    } catch (e) {
        return failure(500, { message: e.message });
    }
}
