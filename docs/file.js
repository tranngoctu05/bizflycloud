/**
 * @swagger
 * tags:
 *   name: File
 *   description: Quản lý file trên BizflyCloud
 */

/**
 * @swagger
 * /file/upload:
 *   post:
 *     summary: Tải lên file
 *     tags: [File]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: Tải lên file thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Không có file được tải lên
 *       500:
 *         description: Lỗi khi tải lên file
 */

/**
 * @swagger
 * /file/upload-multipart:
 *   post:
 *     summary: Tải lên file đa phần
 *     tags: [File]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: Tải lên file đa phần thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Không có file được tải lên
 *       500:
 *         description: Lỗi khi tải lên file đa phần
 */

/**
 * @swagger
 * /file/download:
 *   get:
 *     summary: Tải xuống file
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: bucket
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên bucket chứa file
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Key của file cần tải xuống
 *     responses:
 *       200:
 *         description: Tải xuống file thành công
 *       400:
 *         description: Thiếu thông tin bucket hoặc key
 *       500:
 *         description: Lỗi khi tải xuống file
 */

/**
 * @swagger
 * /file/object-versions:
 *   get:
 *     summary: Liệt kê các phiên bản của một đối tượng
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: bucket
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên bucket chứa đối tượng
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Key của đối tượng
 *     responses:
 *       200:
 *         description: Liệt kê các phiên bản đối tượng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Versions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Key:
 *                         type: string
 *                       VersionId:
 *                         type: string
 *                       IsLatest:
 *                         type: boolean
 *                       LastModified:
 *                         type: string
 *                         format: date-time
 *                       Size:
 *                         type: integer
 *                       ETag:
 *                         type: string
 *       400:
 *         description: Thiếu thông tin bucket hoặc key
 *       500:
 *         description: Lỗi khi liệt kê các phiên bản đối tượng
 */

/**
 * @swagger
 * /file/object-info:
 *   get:
 *     summary: Lấy thông tin của một đối tượng
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: bucket
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên bucket chứa đối tượng
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Key của đối tượng
 *     responses:
 *       200:
 *         description: Lấy thông tin đối tượng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ContentLength:
 *                   type: integer
 *                 ContentType:
 *                   type: string
 *                 ETag:
 *                   type: string
 *                 LastModified:
 *                   type: string
 *                   format: date-time
 *                 Metadata:
 *                   type: object
 *                 TagCount:
 *                   type: integer
 *                 VersionId:
 *                   type: string
 *       400:
 *         description: Thiếu thông tin bucket hoặc key
 *       500:
 *         description: Lỗi khi lấy thông tin đối tượng
 */

/**
 * @swagger
 * /file/delete-file:
 *   delete:
 *     summary: Xóa một file
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: bucketName
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên bucket chứa file
 *       - in: query
 *         name: fileName
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên file cần xóa
 *     responses:
 *       200:
 *         description: Xóa file thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Thiếu thông tin bucket hoặc tên file
 *       500:
 *         description: Lỗi khi xóa file
 */

/**
 * @swagger
 * /file/delete-file-version:
 *   delete:
 *     summary: Xóa phiên bản của một file
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: bucketName
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên bucket chứa file
 *       - in: query
 *         name: keyName
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên của file
 *       - in: query
 *         name: versionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của phiên bản cần xóa
 *     responses:
 *       200:
 *         description: Xóa phiên bản file thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Thiếu thông tin bucket, tên file hoặc versionId
 *       500:
 *         description: Lỗi khi xóa phiên bản file
 */
