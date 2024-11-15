import { getClient } from "../config/mail.config.js"

export const sendEmailReceipt = function (order) {
    const mailClient = getClient();

    mailClient.messages.create(
        'sandbox256fcc4e3fba4619bfe918f0badf4859.mailgun.org',
        {
            from: 'orders@tecshop.com',
            to: 'matiasdev084@gmail.com',
            subject: `Nueva orden ${order.id}`,
            html: getReceiptHtml(order)
        }
    )
        .then(msg => console.log(msg))
        .catch(err => console.log(err))
};

const getReceiptHtml = function (order) {
    return `
        <html>
            <head>
                <style>
                    table{
                        border-collapse: collapse;
                        max-width: 35rem;
                        width: 100%;
                    }
                    th,td{
                        text-align: left;
                        padding: 8px;
                    }
                    th{
                        border-bottom: 1px solid #ddd;
                    }
                </style>
            </head>
            <body>
                <h1>Nueva Orden Creada</h1>
                <p>Hola, Administrador, tiene una orden de ${order.name}.</p>
                <p><strong>Orden ID:</strong> ${order.id}</p>
                <p><strong>Fecha:</strong> ${order.createdAt
            .toISOString()
            .replace('T', ' ')
            .substr(0, 10)}
                </p>
                <h2>Detalle de la Orden</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Precio Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items
            .map(
                item =>
                    `
                            <tr>
                            <td>${item.product.name}</td>
                            <td>S/ ${item.product.price}</td>
                            <td>${item.quantity}</td>    
                            <td>S/ ${item.price.toFixed(2)}</td>
                            </tr>
                            `
            )
            .join('\n')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3"><strong>Total:</strong></td>
                            <td>S/ ${order.totalPrice}</td>
                        </tr>
                    </tfoot>
                </table>
                <p><strong>Dirección de envío:</strong> ${order.address}</p>
            </body>
        </html>
    `
}