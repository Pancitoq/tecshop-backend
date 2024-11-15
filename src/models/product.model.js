// Producto
import { model, Schema } from 'mongoose';

export const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        tags: { type: [String] }, // categorías
        imageUrl: { type: String, required: true },
        description: { type: String},
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const ProductModel = model('product', ProductSchema);