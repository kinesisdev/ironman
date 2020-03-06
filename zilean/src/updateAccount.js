import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function handler(event, context) {
    const data = JSON.parse(event.body);

    const accountId = event.pathParameters.accountId;

    const getParams = {
        TableName: process.env.ZILEAN_ACCOUNT,
        Key: {
            accountId: accountId
        }
    };

    console.log(accountId);

    const updateParams = {
        TableName: process.env.ZILEAN_ACCOUNT,
        Key: {
            accountId: accountId
        },
        UpdateExpression: "SET #ts = :timestamp",
        ExpressionAttributeValues: {
            ":timestamp": data.timestamp || 0,
        },
        ExpressionAttributeNames: {
            "#ts": "timestamp"
        },
        ReturnValuse: "ALL_NEW"
    };

    try {
        var result = await dynamoDbLib.call("get", getParams);
        if (result.Item) {
            await dynamoDbLib.call("update", updateParams);
            var response = {
                message: "Successfully update account info",
            };
            return success(response);
        } else {
            return failure(501, {message: "AccountId is not in database"});
        }
    } catch (e) {
        return failure(500, {message: e.message});
    }
}
