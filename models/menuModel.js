// models/menuModel.js
const connect = require("../DBconnection");

const menuModel = {
    getMenuItems: () => {
        return new Promise((resolve, reject) => {
            connect.connection.query(
                "SELECT menu.item_id, menu.item_name, menu.item_description, menu.item_price, categories.category_name " +
                "FROM menu " +
                "INNER JOIN categories ON menu.category_id = categories.category_id",
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },
};

module.exports = menuModel;
