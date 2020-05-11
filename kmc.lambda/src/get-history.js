import dynamoDb from "./libs/db-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const historyId = event.pathParameters.id;

    const getHistoryParams = {
        TableName: process.env.KMC_HISTORY,
        Key: {
            historyId: historyId
        }
    };

    try {
        var historyItem = await dynamoDb.get(getHistoryParams);
        if (historyItem.Item) {
            const getProductParams = {
                TableName: process.env.KMC_PRODUCT,
                Key: {
                    productId: historyItem.Item.productId
                }
            };
            const productItem = await dynamoDb.get(getProductParams);
            if (productItem.Item) {
                var response = {
                    message: "Successfully get history",
                    history: {
                        historyId: historyItem.Item.historyId,
                        goldPrice: historyItem.Item.goldPrice,
                        reducedPrice: historyItem.Item.reducedPrice,
                        totalPrice: historyItem.Item.totalPrice,
                        ...productItem.Item
                    }
                };
                return success(response);
            } else {
                return failure(501, {message: "ProductId ${productId} is not in database"});
            }
        } else {
            return failure(501, {message: "HistoryId ${historyId} is not in database"});
        }
    } catch (e) {
        return failure(500, { message: e.message });
    }
}
