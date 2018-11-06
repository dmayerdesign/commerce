import * as AWS from 'aws-sdk'
import * as fs from 'fs-extra'
import { inject, injectable } from 'inversify'
import * as multer from 'multer'
import * as path from 'path'
import sharp from 'sharp'

import { AppConfig } from '@mte/app-config'
import { Types } from '@mte/common/constants/inversify/types'
import { Product } from '@mte/common/api/entities/product'
import { Revision } from '@mte/common/api/entities/revision'
import { DbClient } from '../data-access/db-client'

/**
 * AWS S3 uploads
 */
AWS.config.region = AppConfig.aws_region

@injectable()
export class UploadService {
    constructor(
        @inject(Types.DbClient) private dbClient: DbClient<Product>
    ) {}

    private s3 = new AWS.S3({
        params: {
            Bucket: AppConfig.aws_bucket,
            Key: 'default'
        },
        signatureVersion: 'v4'
    })

    public uploadCsv = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.resolve(__dirname, '../../tmp/'))
            },
            filename: function (req, file, cb) {
                console.log('req.file:', req.file)
                cb(null, req.files[0].fieldname + '_' + Date.now() + '.csv')
            }
        }),
    })

    public appendFileExt(file) {
        if (file && file.mimetype) {
            if (file.mimetype.indexOf('jpeg') > -1) return '.jpg'
            else return '.' + file.mimetype.match(/image\/(.*)/)[1]
        }
    }

    public uploadProductImage(sku) {
        if (sku) sku += '-'
        else sku = ''

        return multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, path.resolve(__dirname, 'tmp'))
                },
                filename: (req, file, cb) => {
                    console.log('file:', file)
                    cb(null, sku + Date.now().toString() + '-medium' + this.appendFileExt(file))
                },
            }),
        })
    }

    public async editImages(action, sku, editObj, done) {
        console.log('-------- Edit Product Images --------')
        console.log(editObj)

        try {
            const product = await this.dbClient.findOne(Product, { sku })

            Object.keys(editObj).forEach(field => {
                if (action === 'remove') {
                    product[field].splice(product[field].indexOf(editObj[field]), 1)
                }
                else if (action === 'add') {
                    if (field === 'featuredImages' || field === 'thumbnails') { // For now, only allowing one featured image and one thumbnail per SKU
                        product[field] = []
                    }
                    product[field].push(editObj[field])
                }
                product.markModified(field)

                /**
                 * Add to revision history
                 */
                const revision = new Revision({
                    id: product._id.toString(),
                    field: field,
                    value: product[field],
                })
                revision.save(console.log)
            })

            product.save()
                .then(async (_product) => {
                    if (!product.isVariation) {
                        done(null, _product._doc)
                    } else {
                        try {
                            const parent = await this.dbClient.findOne(Product, {sku: product.parentSku})

                            Object.keys(editObj).forEach(field => {
                                if (action === 'remove') {
                                    parent[field].splice(parent[field].indexOf(editObj[field]), 1)
                                }
                                else if (action === 'add') {
                                    parent[field].push(editObj[field])
                                }
                                parent.markModified(field)

                                /**
                                 * Add to revision history
                                 */
                                const revision = new Revision({
                                    id: parent._id.toString(),
                                    field: field,
                                    value: parent[field],
                                })
                                revision.save(console.log)
                            })

                            parent.save(($err, $product) => {
                                done($err, $product._doc)
                            })
                        }
                        catch (error) {
                            return done(error)
                        }
                    }
                })
                .catch((error) => {
                    done(error)
                })
        }
        catch (error) {
            return done(error)
        }
    }

    public crunch(file, done) {
        const newFilePath = file.path.indexOf('.') > -1 ? file.path.replace('-medium.', '-thumbnail.') : file.path + '-thumbnail'
        let thumbnailBuffer, mediumBuffer

        try {
            fs.copySync(file.path, newFilePath)
        }
        catch (err) {
            done(err)
        }

        mediumBuffer = fs.readFileSync(file.path)
        thumbnailBuffer = fs.readFileSync(newFilePath)

        sharp(mediumBuffer)
            .rotate()
            .resize(500, null)
            .toFile(file.path)
            .then(d => {
                sharp(thumbnailBuffer)
                    .rotate()
                    .resize(200, null)
                    .toFile(newFilePath)
                    .then(data => {
                        done(null, data, file.path, newFilePath)
                    }).catch(done)
            }).catch(done)
    }

    public uploadProductImageToCloud(path, destFileName, done) {
        this.s3.upload({
            Bucket: AppConfig.aws_bucket,
            ACL: 'public-read',
            Body: fs.createReadStream(path),
            Key: 'product-images/' + destFileName.toString(),
            ContentType: 'application/octet-stream',
        }).send(done)
    }
}
