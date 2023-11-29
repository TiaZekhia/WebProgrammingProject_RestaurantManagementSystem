// controllers/menuController.js
const express = require('express');
const router = express.Router();
const menuModel = require('../models/menuModel');

// Route for viewing the menu
router.get("/", async (req, res) => {
    try {
        const menuItems = await menuModel.getMenuItems();
        const groupedItems = groupItemsByCategory(menuItems);
        res.render('viewMenu', { groupedItems });
    } catch (error) {
        res.status(500).send("<h1>Internal Server Error</h1>");
    }
});

// Helper function to group items by category
function groupItemsByCategory(items) {
    const groupedItems = {};
    items.forEach(item => {
        const category = item.category_name;
        if (!groupedItems[category]) {
            groupedItems[category] = [];
        }
        groupedItems[category].push(item);
    });
    return groupedItems;
}

module.exports = router;
