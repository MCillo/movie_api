
const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3'); // imports S3 client and commands to interact with bucket
const fs = require('fs');

// Instantiate's an S3 Client Object
const s3Client = new S3Client({ // Create a new S3Client for 
  region: 'us-east-1', // passing region when working with AWS or Localstack
  endpoint: 'http://localhost:4566', // Passing endpoint and forcePathStyle when working with localstack
  forcePathStyle: true
});

const listObjectsParams = { // Instantiates an object from classes for individual commands
  Bucket: 'my-cool-local-bucket' // parameter of bucket name
}

const listObjectsCmd = new ListObjectsV2Command(listObjectsParams) // Instantiates ListObjectsV2Command object to pass to S3 client 
