const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { S3Client, ListBucketsCommand, DeleteObjectCommand, ListObjectVersionsCommand, HeadObjectCommand, CreateBucketCommand, ListObjectsV2Command, GetBucketAclCommand, PutBucketAclCommand, PutObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

require('dotenv').config();

// console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
// console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);

const s3 = new S3Client({
    region: 'hn',
    endpoint: 'https://hn.ss.bfcplatform.vn',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

router.get('/', async (req, res, next) => {
    try {
        // listObjects('testlaine')
        // await createBucket('my-new-bucket-name');
        // getBucketAcl('testlaine');
        // setBucketAcl('testlaine', 'public-read');
        // const command = new ListBucketsCommand({});
        // const data = await s3.send(command);
        // res.json(data.Buckets);
        // console.log('Buckets:', data.Buckets);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error fetching bucket list');
    }
});
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const bucketName = 'testlaine';

        const result = await uploadFile(fileBuffer, fileName, bucketName);
        res.json({ message: 'File uploaded successfully!', data: result });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error uploading file.');
    }
});

router.post('/upload-multipart', async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileBuffer = req.file.buffer;
        const fileName = file.name;
        const bucketName = 'testlaine';
        const partSize = 1024 * 1024 * 5; // 5MB per part
        let partNum = 0;
        let numPartsLeft = Math.ceil(fileBuffer.length / partSize);
        const multipartMap = { Parts: [] };

        const startTime = new Date();

        const createMultipartUploadCommand = new CreateMultipartUploadCommand({
            Bucket: bucketName,
            Key: fileName,
            ContentType: file.mimetype,
        });

        const multipart = await s3.send(createMultipartUploadCommand);

        const completeMultipartUpload = async (uploadId) => {
            try {
                const doneParams = {
                    Bucket: bucketName,
                    Key: fileName,
                    MultipartUpload: multipartMap,
                    UploadId: uploadId,
                };

                const completeCommand = new CompleteMultipartUploadCommand(doneParams);
                const data = await s3.send(completeCommand);
                const delta = (new Date() - startTime) / 1000;
                console.log('Completed upload in', delta, 'seconds');
                res.json({ message: 'File uploaded successfu1lly!', data });
            } catch (err) {
                console.error('Error completing multipart upload:', err);
                res.status(500).send('Error completing multipart upload.');
            }
        };

        const uploadPart = async (partNum, bufferSlice, uploadId) => {
            try {
                const partParams = {
                    Bucket: bucketName,
                    Key: fileName,
                    PartNumber: partNum,
                    UploadId: uploadId,
                    Body: bufferSlice,
                };

                const uploadPartCommand = new UploadPartCommand(partParams);
                const data = await s3.send(uploadPartCommand);

                multipartMap.Parts[partNum - 1] = {
                    ETag: data.ETag,
                    PartNumber: partNum,
                };

                console.log('Completed part', partNum);

                if (--numPartsLeft === 0) {
                    await completeMultipartUpload(uploadId);
                }
            } catch (err) {
                console.error('Error uploading part:', err);
                res.status(500).send('Error uploading part.');
            }
        };

        for (let rangeStart = 0; rangeStart < fileBuffer.length; rangeStart += partSize) {
            partNum++;
            const end = Math.min(rangeStart + partSize, fileBuffer.length);
            const bufferSlice = fileBuffer.slice(rangeStart, end);

            console.log('Uploading part:', partNum);
            uploadPart(partNum, bufferSlice, multipart.UploadId);
        }
    } catch (err) {
        console.error('Error initiating multipart upload:', err);
        res.status(500).send('Error initiating multipart upload.');
    }
});
router.delete('/delete-file-version', async (req, res) => {
    try {
        const { bucketName, keyName, versionId, mfaToken } = req.query;

        if (!bucketName || !keyName || !versionId) {
            return res.status(400).send('Bucket name, key name, and version ID are required.');
        }

        const params = {
            Bucket: bucketName,
            Key: keyName,
            VersionId: versionId,
            // MFA: mfaToken 
        };

        const command = new DeleteObjectCommand(params);
        const data = await s3.send(command);
        res.json({ message: 'File version deleted successfully', data });
    } catch (err) {
        console.error('Error deleting file version:', err);
        res.status(500).send('Error deleting file version.');
    }
});
router.delete('/delete-file', async (req, res) => {
    try {
        const { bucketName, fileName } = req.query;
        if (!bucketName || !fileName) {
            return res.status(400).send('Bucket name and file name are required.');
        }

        const params = {
            Bucket: bucketName,
            Key: fileName
        };

        const command = new DeleteObjectCommand(params);
        const data = await s3.send(command);
        res.json({ message: 'File deleted successfully', data });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file.');
    }
});

router.get('/object-info', async (req, res) => {
    try {
        const bucketName = req.query.bucket;
        const key = req.query.key;

        if (!bucketName || !key) {
            return res.status(400).send('Bucket name and key are required.');
        }

        const params = {
            Bucket: bucketName,
            Key: key
        };

        const command = new HeadObjectCommand(params);
        const data = await s3.send(command);

        res.json({
            ContentLength: data.ContentLength,
            ContentType: data.ContentType,
            ETag: data.ETag,
            LastModified: data.LastModified,
            Metadata: data.Metadata,
            TagCount: data.TagCount,
            VersionId: data.VersionId
        });
    } catch (err) {
        console.error('Error getting object info:', err);
        res.status(500).send('Error retrieving object information.');
    }
});
router.get('/object-versions', async (req, res) => {
    try {
        const bucketName = req.query.bucket;
        const keyPrefix = req.query.key;

        if (!bucketName || !keyPrefix) {
            return res.status(400).send('Bucket name and prefix are required.');
        }

        const params = {
            Bucket: bucketName,
            Prefix: keyPrefix
        };
        const command = new ListObjectVersionsCommand(params);
        const data = await s3.send(command);
        res.json({
            Versions: data.Versions.map(version => ({
                Key: version.Key,
                VersionId: version.VersionId,
                IsLatest: version.IsLatest,
                LastModified: version.LastModified,
                Size: version.Size,
                ETag: version.ETag
            }))
        });

    } catch (err) {
        console.error('Error listing object versions:', err);
        res.status(500).send('Error listing object versions.');
    }


})

router.get('/download', async (req, res) => {
    try {
        const bucketName = req.query.bucket;
        const key = req.query.key;
        const destPath = path.join(__dirname, 'downloads', key);

        if (!bucketName || !key) {
            return res.status(400).send('Bucket name and key are required.');
        }

        const params = {
            Bucket: bucketName,
            Key: key
        };

        const command = new GetObjectCommand(params);
        const s3Stream = await s3.send(command);

        // Tạo stream để đọc từ S3 và ghi vào file
        const fileStream = fs.createWriteStream(destPath);
        s3Stream.Body.pipe(fileStream);

        fileStream.on('error', (err) => {
            console.error('Error writing file:', err);
            res.status(500).send('Error saving file.');
        });

        fileStream.on('finish', () => {
            res.download(destPath, key, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('Error sending file.');
                } else {
                    fs.unlink(destPath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error('Error deleting file:', unlinkErr);
                        }
                    });
                }
            });
        });
    } catch (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file.');
    }
});


const setBucketAcl = async (bucketName, acl) => {
    try {
        const command = new PutBucketAclCommand({
            Bucket: bucketName,
            ACL: acl,  // Giá trị của <CANNED_ACL> như public-read, private, etc.
        });
        const data = await s3.send(command);
        console.log('Updated Bucket ACL:', data);
        return data;
    } catch (err) {
        console.error('Error setting bucket ACL', err);
        throw err;
    }
};

const uploadFile = async (fileBuffer, fileName, bucketName) => {
    try {
        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: 'text/plain',
            ACL: 'public-read',
            Metadata: {
                'x-amz-meta-customLabel': 'value',
            }
        };

        const command = new PutObjectCommand(uploadParams);
        const data = await s3.send(command);
        console.log('Upload Success:', data);
        return data;
    } catch (err) {
        console.error('Error Uploading File:', err);
        throw err;
    }
};



const createBucket = async (bucketName) => {
    try {
        const command = new CreateBucketCommand({ Bucket: bucketName });
        const data = await s3.send(command);
        console.log('Bucket created successfully:', data);
    } catch (err) {
        console.error('Error creating bucket:', err);
    }
};
const listObjects = async (bucketName, prefix = 'Test', delimiter = '', maxKeys = 1000) => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix,    // Để lọc theo tiền tố (ví dụ: thư mục)
            Delimiter: delimiter,  // Để phân loại kết quả (ví dụ: '/', '' để không phân loại)
            MaxKeys: maxKeys    // Số lượng kết quả tối đa trả về (mặc định 1000)
        });
        const data = await s3.send(command);
        console.log('File list:', data.Contents);
        return data.Contents;  // Trả về danh sách các đối tượng
    } catch (err) {
        console.error('Error listing objects', err);
        throw err;
    }
};
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



module.exports = router;
