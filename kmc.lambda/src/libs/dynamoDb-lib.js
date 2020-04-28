import AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();

// export default {
//   get   : (params) => client.get(params).promise(),
//   put   : (params) => client.put(params).promise(),
//   query : (params) => client.query(params).promise(),
//   update: (params) => client.update(params).promise(),
//   delete: (params) => client.delete(params).promise(),
//   scan: (params) => client.scan(params).promise(),
// };

export function get(params) {
    return client.get(params).promise();
}

export function put(params) {
    return client.put(params).promise();
}
