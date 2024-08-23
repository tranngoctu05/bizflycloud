/**
 * @swagger
 * tags:
 *   name: Bucket
 *   description:  bucker trên BizflyCloud
 */
/**
/**
 * @swagger
 * /bucket/getListBucket:
 *   get:
 *     tags:
 *       - Bucket
 *     summary: Retrieve a list of S3 buckets
 *     description: Fetches the list of all S3 buckets available in your BizflyCloud account.
 *     responses:
 *       200:
 *         description: A list of buckets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Name:
 *                     type: string
 *                     description: The name of the bucket
 *                   CreationDate:
 *                     type: string
 *                     format: date-time
 *                     description: The creation date of the bucket
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bucket/createBucket:
 *   post:
 *     tags:
 *       - Bucket
 *     summary: Create a new S3 bucket
 *     description: Creates a new S3 bucket with the specified name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bucketName:
 *                 type: string
 *                 description: The name of the bucket to be created
 *     responses:
 *       200:
 *         description: Bucket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bucket/deleteBucket:
 *   delete:
 *     tags:
 *       - Bucket
 *     summary: Delete an S3 bucket
 *     description: Deletes an existing S3 bucket and its contents.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bucketName:
 *                 type: string
 *                 description: The name of the bucket to be deleted
 *     responses:
 *       200:
 *         description: Bucket deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bucket/listObjects:
 *   get:
 *     tags:
 *       - Bucket
 *     summary: List objects in a bucket
 *     description: Retrieves a list of objects from a specified S3 bucket.
 *     parameters:
 *       - in: query
 *         name: bucketName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the bucket to list objects from
 *       - in: query
 *         name: prefix
 *         schema:
 *           type: string
 *         description: Filter objects by prefix
 *       - in: query
 *         name: delimiter
 *         schema:
 *           type: string
 *         description: Delimiter for grouping keys
 *       - in: query
 *         name: maxKeys
 *         schema:
 *           type: integer
 *           format: int32
 *         description: Maximum number of keys to return
 *     responses:
 *       200:
 *         description: A list of objects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 objects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Key:
 *                         type: string
 *                         description: The key of the object
 *                       LastModified:
 *                         type: string
 *                         format: date-time
 *                         description: The last modified date of the object
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bucket/getBucketAcl:
 *   get:
 *     tags:
 *       - Bucket
 *     summary: Get the ACL of a bucket
 *     description: Retrieves the Access Control List (ACL) for a specified S3 bucket.
 *     parameters:
 *       - in: query
 *         name: bucketName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the bucket
 *     responses:
 *       200:
 *         description: The ACL of the bucket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Grants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Grantee:
 *                         type: object
 *                       Permission:
 *                         type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /bucket/setBucketAcl:
 *   post:
 *     tags:
 *       - Bucket
 *     summary: Set the ACL of a bucket
 *     description: Updates the Access Control List (ACL) for a specified S3 bucket.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bucketName:
 *                 type: string
 *                 description: The name of the bucket
 *               acl:
 *                 type: string
 *                 description: The ACL to be set (e.g., 'public-read')
 *     responses:
 *       200:
 *         description: Bucket ACL updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */