//        /api/foods

import { Router } from 'express';
import handler from 'express-async-handler';
import { ProductModel } from '../models/product.model.js';
import admin from '../middleware/admin.mid.js';

const router = Router();

router.get('/', handler(async (req, res) => {
    const products = await ProductModel.find({});
    res.send(products);
}));

router.post(
    '/',
    admin,
    handler(async (req, res) => {
        const { name, price, tags, imageUrl, description } = req.body;

        const product = new ProductModel({
            name,
            price,
            tags: tags.split ? tags.split(',') : tags,
            imageUrl,
            description
        });

        await product.save();
        res.send(product);
    })
);

router.put(
    '/',
    admin,
    handler(async (req, res) => {
        const { id, name, price, tags, imageUrl, description } = req.body;
        await ProductModel.updateOne(
            { _id: id },
            {
                name,
                price,
                tags: tags.split ? tags.split(',') : tags,
                imageUrl,
                description
            }
        );

        res.send();
    })
);

router.delete(
    '/:productId',
    admin,
    handler(async (req, res) => {
        const { productId } = req.params;
        await ProductModel.deleteOne({ _id: productId });
        res.send();
    })
);

router.get(
    '/tags',
    handler(async (req, res) => {

        const tags = await ProductModel.aggregate([
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({ count: -1 });

        const all = {
            name: 'Todos',
            count: await ProductModel.countDocuments()
        };

        tags.unshift(all);

        res.send(tags);
    }));

router.get('/search/:searchTerm', handler(async (req, res) => {
    const { searchTerm } = req.params;
    // creando una expresión regular que no distingue entre mayúsculas y minústulas (i)
    const searchRegex = new RegExp(searchTerm, 'i');

    const products = await ProductModel.find({ name: { $regex: searchRegex } });
    res.send(products);
}))

router.get('/tag/:tag', handler(async (req, res) => {
    const { tag } = req.params;
    const products = await ProductModel.find({ tags: tag });
    res.send(products);
}));

router.get('/:productId', handler(async (req, res) => {
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);
    res.send(product);
}));

export default router;
