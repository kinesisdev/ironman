import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function handler(event, context, callback) {
    const data = JSON.parse(event.body);

    const putParams = {
        TableName: process.env.ZILEAN_ACCOUNT,
        Item: {
            accountId: data.accountId,
            timestamp: data.timestamp,
            createdAt: Date.now()
        }
    };

    const getParams = {
        TableName: process.env.ZILEAN_ACCOUNT,
        Key: {
            accountId: data.accountId
        }
    };

    try {
        var result = await dynamoDbLib.call("get", getParams);
        if (result.Item) {
            return success({message: "Account is already in database"});
        } else {
            await dynamoDbLib.call("put", putParams);
            var response = {
                message: "Successfully add account into database",
                accountId: putParams.Item.accountId
            };
            return success(response);
        }
    } catch (e) {
        return failure(500, {message: e.message});
    }
};
