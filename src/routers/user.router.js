//        /api/users

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { BAD_REQUEST, NOT_ACCEPTABLE } from '../constants/httpStatus.js';
import handler from 'express-async-handler'; // manejar los errores de peticiones async
import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.mid.js';
import admin from '../middleware/admin.mid.js';

// Número de veces que se aplicará el hash/encriptación
const PASSWORD_HASH_SALT_ROUNDS = 10;
const router = Router();

router.post('/login', handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        res.send(generateTokenResponse(user));
        return;
    }

    res.status(BAD_REQUEST).send('Usuario o contraseña inválidos');
}));

router.post('/register', handler(async (req, res) => {
    const { email, password, name, address } = req.body;
    // verifica si existe el usuario por email en la bd
    const user = await UserModel.findOne({ email });

    if (user) {
        res.status(BAD_REQUEST).send('El usuario existe, por favor inicie sesión');
        return;
    }
    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);

    // crea un usuario
    const newUser = {
        password: hashedPassword,
        email: email.toLowerCase(),
        name,
        address
    };

    // crear el usuario en bd
    const result = await UserModel.create(newUser);
    res.send(generateTokenResponse(result));
}));

router.put(
    '/updateProfile',
    auth,
    handler(async (req, res) => {
        const { name, address } = req.body;
        const user = await UserModel.findByIdAndUpdate(
            req.user.id,
            { name, address },
            { new: true }
        );

        res.send(generateTokenResponse(user));
    })
);

router.put(
    '/changePassword',
    auth,
    handler(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            res.status(BAD_REQUEST).send('Falló el cambio de contraseña, hable con el administrador');
            return;
        }

        // verificar si currentPassword hace match con la contraseña de la bd
        const equal = await bcrypt.compare(currentPassword, user.password);

        if (!equal) {
            res.status(BAD_REQUEST).send('La contraseña actual no es correcta');
            return;
        };

        // Encriptando la nueva contraseña y agregando al usuario
        user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);

        // Guardamos en la bd
        await user.save();
        res.send();
    })
);

router.get(
    '/getAll/:searchTerm?',
    admin,
    handler(async (req, res) => {
        const { searchTerm } = req.params;

        const filter = searchTerm
            ? { name: { $regex: new RegExp(searchTerm, 'i') } } // se crea una expresion regular con el valor de searchTerm insensible a mayusculas y minusculas (i)
            : {};

        // {password: 0}    ->  Este es un objeto de proyección que 
        //                      le indica a Mongoose qué campos incluir o excluir en el resultado 
        //                      , se excluye el campo password de los resultados
        const users = await UserModel.find(filter, { password: 0 });
        res.send(users);
    })
);

router.put(
    '/toggleBlock/:userId',
    admin,
    handler(async (req, res) => {
        const { userId } = req.params;

        // No se puede bloquear a sí mismo
        if (userId === req.user.id) {
            res.status(BAD_REQUEST).send("No se puede bloquear a sí mismo");
            return;
        }

        const user = await UserModel.findById(userId);
        user.isBlocked = !user.isBlocked;
        user.save();

        res.send(user.isBlocked);
    })
);

router.get(
    '/getById/:userId',
    admin,
    handler(async (req, res) => {
        const { userId } = req.params;
        const user = await UserModel.findById(userId, { password: 0 });
        res.send(user);
    })
);

// Como Admin edito el perfil de un usuario cualquiera o el mio
router.put(
    '/update',
    admin,
    handler(async (req, res) => {
        const { id, name, email, address, isAdmin } = req.body;

        // Verifica si existe el email en la bd
        const user = await UserModel.findOne({ email });
        if (user && id !== user.id) {
            res.status(NOT_ACCEPTABLE).send('El correo ya existe, por favor ingrese otro');
            return;
        }

        await UserModel.findByIdAndUpdate(id, {
            name,
            email,
            address,
            isAdmin
        });
        res.send();
    })
);

router.delete(
    '/:userId',
    admin,
    handler(async (req, res) => {
        const { userId } = req.params;
        await UserModel.deleteOne({ _id: userId });
        res.send();
    })
);

const generateTokenResponse = (user) => {
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    );

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token
    }
};

export default router;