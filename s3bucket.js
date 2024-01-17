// code for Cloud Computing Ex 2.4
const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const express = require('express');


const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  forcePathStyle: true
});

const listObjectsParams = {
  Bucket: 'my-localstack-bucket'
};

const listObjectsCmd = new ListObjectsV2Command(listObjectsParams);

app.get('/images', (req, res) => {
  listObjectsParams.Bucket = 'my-localstack-bucket'; // Update the bucket name
  s3Client.send(new ListObjectsV2Command(listObjectsParams))
    .then((listObjectsResponse) => {
      console.log("Bucket Contents:", listObjectsResponse.Contents);
      res.send(listObjectsResponse);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error listing images');
    });
});

app.get('/images/:key', (req, res) => {
  const getObjectParams = {
    Bucket: 'my-localstack-bucket',
    Key: req.params.key // Use the key (filename) from the request parameters
  };

  s3Client.send(new GetObjectCommand(getObjectParams))
    .then((getObjectResponse) => {
      res.send(getObjectResponse);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error retrieving image');
    });
});

app.post('/upload', (req, res) => {
  const uploadParams = {
    Bucket: 'my-localstack-bucket',
    Key: 'test-image.jpg',
    Body: fs.createReadStream('/Users/michaelcillo/test-image.jpg'),
    ContentType: 'image/jpg'
  };

  s3Client.send(new PutObjectCommand(uploadParams))
    .then((uploadResponse) => {
      res.send(uploadResponse);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error uploading image');
    });
});

app.listen(4566, () => {
  console.log('Server is running on port 4566');
});
