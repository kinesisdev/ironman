import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function handler(event, context) {

    const accountId = event.pathParameters.accountId;

    const params = {
        TableName: process.env.ZILEAN_ACCOUNT,
        Key: {
            accountId: accountId
        }
    };

    try {
        var result = await dynamoDbLib.call("get", params);
        if (result.Item) {
            await dynamoDbLib.call("delete", params);
            return success({
                message: "Successfully delete account from database"
            });
        } else {
            return failure(501, {message: "AccountId is not in database"});
        }
    } catch (e) {
        return failure({
            message: e.message
        });
    }
}
