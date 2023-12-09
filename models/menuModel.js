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
    getAllItemNames: async () => {
        try {
            const results = await menuModel.getMenuItems();
            return menuModel.extractItemNames(results);
        } catch (error) {
            throw error;
        }
    },

    extractItemNames: (results) => {
        if (Array.isArray(results)) {
            return results.map(result => result.item_name);
        } else {
            console.log('Results is not an array:', results);
            return [];
        }
    },
  
    
      
    getItemIdByItemName: (item_name, callback) => {
        connect.connection.query(
            'SELECT item_id FROM menu WHERE item_name = ?',
            [item_name],
            (error, results) => {
                if (error) {
                    callback(error, null);
                } else {
                    const itemId = results.length > 0 ? results[0].item_id : null;
                    callback(null, itemId);
                }
            }
        );
    },

    getItemById: async (item_id) => {
        return new Promise((resolve, reject) => {
          connect.connection.query('SELECT * FROM menu WHERE item_id = ?', [item_id], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          });
        });
      },
  
  
};

module.exports = menuModel;
