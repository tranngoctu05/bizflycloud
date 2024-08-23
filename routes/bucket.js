const express = require('express');
const router = express.Router();
const { S3Client,
    ListBucketsCommand,
    DeleteObjectCommand,
    CreateBucketCommand,
    ListObjectsV2Command,
    GetBucketAclCommand,
    PutBucketAclCommand,
    DeleteBucketCommand} = require('@aws-sdk/client-s3');

require('dotenv').config();

const s3 = new S3Client({
    region: 'hn',
    endpoint: 'https://hn.ss.bfcplatform.vn',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

router.get('/getListBucket', async (req, res, next) => {
    try {
        const command = new ListBucketsCommand({});
        const data = await s3.send(command);
        res.json(data.Buckets);
        console.log('Buckets:', data.Buckets);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching bucket list');
    }
});
router.post('/createBucket', async (req, res, next) => {
    const { bucketName } = req.body;
    if (!bucketName) {
        return res.status(400).send('Bucket name is required');
    }

    try {
        const command = new CreateBucketCommand({ Bucket: bucketName });
        const data = await s3.send(command);
        res.json(data);
        console.log('Bucket created successfully:', data);

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error creating bucket');
    }
});
router.delete('/deleteBucket', async (req, res, next) => {
    const { bucketName } = req.body;
    if (!bucketName) {
        return res.status(400).send('Bucket name is required');
    }

    try {
        const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucketName });
        const listObjectsData = await s3.send(listObjectsCommand);

        if (listObjectsData.Contents) {
            for (const object of listObjectsData.Contents) {
                const deleteObjectCommand = new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: object.Key
                });
                await s3.send(deleteObjectCommand);
            }
        }
        const deleteBucketCommand = new DeleteBucketCommand({ Bucket: bucketName });
        await s3.send(deleteBucketCommand);
        res.status(200).json({ message: 'Bucket deleted successfully' });
        console.log('Bucket deleted successfully:', bucketName);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error deleting bucket');
    }
});
const listObjects = async (bucketName, prefix = 'Test', delimiter = '', maxKeys = 1000) => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix,
            Delimiter: delimiter,
            MaxKeys: maxKeys
        });
        const data = await s3.send(command);
        console.log('File list:', data.Contents);
        return data.Contents;
    } catch (err) {
        console.error('Error listing objects', err);
        throw err;
    }
};

router.get('/listObjects', async (req, res, next) => {
    const { bucketName, prefix, delimiter, maxKeys } = req.query;

    if (!bucketName) {
        return res.status(400).json({ error: 'Bucket name is required' });
    }

    try {
        const objects = await listObjects(bucketName, prefix, delimiter, parseInt(maxKeys, 10));
        res.status(200).json({ objects });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Error listing objects', details: err.message });
    }
});

const getBucketAcl = async (bucketName) => {
    try {
        const command = new GetBucketAclCommand({ Bucket: bucketName });
        const data = await s3.send(command);
        console.log('Bucket ACL:', data);
        return data;
    } catch (err) {
        console.error('Error getting bucket ACL', err);
        throw err;
    }
};

router.get('/getBucketAcl', async (req, res, next) => {
    const { bucketName } = req.query;

    if (!bucketName) {
        return res.status(400).json({ error: 'Bucket name is required' });
    }

    try {
        const acl = await getBucketAcl(bucketName);
        res.status(200).json({ acl });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Error getting bucket ACL', details: err.message });
    }
});
const setBucketAcl = async (bucketName, acl) => {
    try {
        const command = new PutBucketAclCommand({
            Bucket: bucketName,
            ACL: acl,
        });
        const data = await s3.send(command);
        console.log('Updated Bucket ACL:', data);
        return data;
    } catch (err) {
        console.error('Error setting bucket ACL', err);
        throw err;
    }
};
router.post('/setBucketAcl', async (req, res, next) => {
    const { bucketName, acl } = req.body;

    if (!bucketName || !acl) {
        return res.status(400).json({ error: 'Bucket name and ACL are required' });
    }

    try {
        const result = await setBucketAcl(bucketName, acl);
        res.status(200).json({ message: 'Bucket ACL updated successfully', data: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Error updating bucket ACL', details: err.message });
    }
});
module.exports = router;