//   /api/orders

import { Router } from 'express';
import handler from 'express-async-handler';
import auth from '../middleware/auth.mid.js';
import { BAD_REQUEST, UNAUTHORIZED } from '../constants/httpStatus.js';
import { OrderModel } from '../models/order.model.js';
import { ORDERSTATUS } from '../constants/orderStatus.js';
import { UserModel } from '../models/user.model.js';
import { sendEmailReceipt } from '../helpers/mail.helper.js';
import admin from '../middleware/admin.mid.js';

const router = Router();
router.use(auth);

router.post('/create', handler(async (req, res) => {
    const order = req.body;

    if (order.items.length <= 0) {
        res.status(BAD_REQUEST).send("Carrito vacío!");
    }

    // Solo puede existir una orden nueva por usuaio
    // Es por ello que se borra si ya existe otra previamente
    await OrderModel.deleteOne({
        user: req.user.id,
        status: ORDERSTATUS.NEW
    });

    // crear nueva orden
    const newOrder = new OrderModel({ ...order, user: req.user.id });
    // Guardar en la bd
    await newOrder.save();

    // Enviar el correo
    sendEmailReceipt(newOrder);

    res.send(newOrder);
}));

router.get(
    '/newOrderForCurrentUser',
    handler(async (req, res) => {
        const order = await getNewOrderForCurrentUser(req);
        if (order) res.send(order);
        else res.status(BAD_REQUEST).send();
    })
);

router.get(
    '/track/:orderId',
    handler(async (req, res) => {
        const { orderId } = req.params;
        const user = await UserModel.findById(req.user.id);

        const filter = {
            _id: orderId
        }

        if (!user.isAdmin) {
            filter.user = user._id;
        }

        const order = await OrderModel.findOne(filter);

        if (!order) return res.send(UNAUTHORIZED);

        return res.send(order);
    })
);

router.get(
    '/allstatus',
    (req, res) => {
        const allstatus = Object.values(ORDERSTATUS);
        res.send(allstatus);
    }
);

// Obtener ordenes por su estado
// Parámetro status es opcional
router.get(
    '/:status?',
    handler(async (req, res) => {
        const status = req.params.status;
        const user = await UserModel.findById(req.user.id);
        const filter = {};

        if (!user.isAdmin) filter.user = user._id;
        if (status) filter.status = status;

        const orders = await OrderModel.find(filter).sort('-createdAt');
        res.send(orders);
    })
);

router.put(
    '/updateStatus',
    admin,
    handler(async (req, res) => {
        const { id, status } = req.body;
        const order = await OrderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        res.send(order);
    })
);

router.delete(
    '/delete/:orderId',
    admin,
    handler(async (req, res) => {
        const { orderId } = req.params;
        await OrderModel.deleteOne({ _id: orderId });
        res.send();
    })
);

const getNewOrderForCurrentUser = async req =>
    await OrderModel.findOne({ user: req.user.id, status: ORDERSTATUS.NEW }).populate('user');

export default router;