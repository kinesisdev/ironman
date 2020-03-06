import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function handler(event, context) {
    const accountId =  event.pathParameters.accountId;
}
