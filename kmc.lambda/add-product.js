import validate from "./libs/validations/add-product-validation";

import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    // const data = JSON.parse(event.body);
    //
    // const err = validate(data);
    //
    // if (err) {
    //     return failure(500, err.message);
    // }
    //
    // const putParams = {
    //     TableName: process.env.KMC_PRODUCT,
    //     Item: {
    //         addedUser: event.requestContext.identity.cognitoIdentityId,
    //         productId: data.productId,
    //         type: data.type || "",
    //         weight: data.type || "0",
    //         isSold: data.isSold || false,
    //         createdAt: Date.now(),
    //         updatedAt: Date.now()
    //     }
    // };
    //
    // const getParams = {
    //     TableName: process.env.KMC_PRODUCT,
    //     Key: {
    //         productId: data.productId
    //     }
    // };
    //
    // try {
    //     var result = await dynamoDbLib.call("get", getParams);
    //     if (result.Item) {
    //         return success({message: "Account is already in database"});
    //     } else {
    //         await dynamoDbLib.call("put", putParams);
    //         var response = {
    //             message: "Successfully add account into database",
    //             productId: putParams.Item.productId
    //         };
    //         return success(response);
    //     }
    // } catch (e) {
    //     return failure(500, { message: e.message });
    // }

    console.log(validate);
    console.log(success);
    console.log(failure);

}