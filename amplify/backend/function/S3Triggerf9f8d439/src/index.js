const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Loop through records (in case of multiple uploads)
        for (const record of event.Records) {
            const bucketName = record.s3.bucket.name;
            const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
            console.log("Object key:", objectKey); // Add this line
            const params = {
                Bucket: bucketName,
                Key: objectKey,
            };
            // Get object metadata
            const metadata = await s3.headObject(params).promise();

            // Prepare data for DynamoDB
            const item = {
                ImageKey: objectKey, // Primary Key
                Size: metadata.ContentLength,
                ContentType: metadata.ContentType,
                LastModified: metadata.LastModified.toISOString(),
            };

            // Save metadata to DynamoDB
            await dynamoDB.put({
                TableName: 'ImageMetadata',
                Item: item,
            }).promise();
        }

        console.log('Metadata stored successfully');
    } catch (error) {
        console.error('Error processing S3 event', error);
        throw error;
    }
};
