import { Inject, Injectable } from '@nestjs/common'
import { AppConfig } from '@qb/app-config'
import { Product } from '@qb/common/domains/product/product'
import { UpdateRequest } from '@qb/common/domains/data-access/requests/update.request'
import * as AWS from 'aws-sdk'
import * as fs from 'fs-extra'
import * as multer from 'multer'
import * as path from 'path'
import * as sharp from 'sharp'
import { ProductRepository } from '../product/product.repository'

/**
 * AWS S3 uploads
 */
AWS.config.region = AppConfig.aws_region

@Injectable()
export class UploadService {
    constructor(
        @Inject(ProductRepository) private _productRepository: ProductRepository,
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
        else sku = '

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

    public async editImages(
        action: 'add'|'remove',
        sku: string,
        editObj: Partial<Product>
    ): Promise<Product> {
        let product = await this._productRepository.lookup('sku', sku) as Product

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
        })

        product = await this._productRepository.update(new UpdateRequest<Product>({
            id: product.id,
            update: product
        })) as Product

        if (!product.isVariation) {
            return product
        }

        const parent = await this._productRepository
            .lookup('sku', product.parentSku) as Product

        Object.keys(editObj).forEach(field => {
            if (action === 'remove') {
                parent[field].splice(parent[field].indexOf(editObj[field]), 1)
            }
            else if (action === 'add') {
                parent[field].push(editObj[field])
            }
        })

        return this._productRepository.update(new UpdateRequest<Product>({
            id: parent.id,
            update: parent
        }))
    }

    public async crunch(
        { path: mediumFilePath }: { path: string }
    ): Promise<void> {
        const thumbnailFilePath = mediumFilePath.indexOf('.') > -1
            ? mediumFilePath.replace('-medium.', '-thumbnail.')
            : mediumFilePath + '-thumbnail'

        fs.copySync(mediumFilePath, thumbnailFilePath)

        const mediumBuffer = fs.readFileSync(mediumFilePath)
        const thumbnailBuffer = fs.readFileSync(thumbnailFilePath)

        await sharp(mediumBuffer)
            .rotate()
            .resize(500, null)
            .toFile(mediumFilePath)

        await sharp(thumbnailBuffer)
            .rotate()
            .resize(200, null)
            .toFile(thumbnailFilePath)
    }

    public uploadProductImageToCloud(filePath, destFileName, done) {
        this.s3.upload({
            Bucket: AppConfig.aws_bucket,
            ACL: 'public-read',
            Body: fs.createReadStream(filePath),
            Key: 'product-images/' + destFileName.toString(),
            ContentType: 'application/octet-stream',
        }).send(done)
    }
}
