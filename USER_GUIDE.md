# Cloud Kitchen - User Guide

Welcome to the Cloud Kitchen platform! This guide walks you through the current working functionalities of the website, divided into three distinct roles: the **Customer**, the **Admin**, and the **Delivery Partner**. 

All features described below are fully implemented and connected to the live database (Supabase).

---

## 1. Customer Portal 
**URL:** `/` (Main Website Homepage)

The Customer Portal is where your users discover food, place orders, and track them in real time. 

### A. Browsing the Menu
*   **Home Page (`/`)**: Displays active ongoing orders (if any exist for the user session), quick category links, and top highlighted food items.
*   **Menu Page (`/menu`)**: A comprehensive list of all available food items. 
    *   **Filtering**: Customers can view items categorized by types (e.g., Starters, Main Course, etc.).
    *   **Ordering**: Customers can click to add items directly to their cart. Items marked out of stock by the admin will not be purchasable.

### B. Cart & Checkout
*   **Cart (`/cart`)**: Accessible via the bottom navigation or header, this page shows all selected items.
    *   **Adjustments**: Customers can increase, or decrease the quantity of items, or remove them completely before purchasing.
    *   **Checkout**: Clicking the checkout button finalizes the order and formally places it into the system. The order status is initially set to **"New" (Placed)**.

### C. Tracking Orders
*   **Order History & Live Tracking (`/orders`)**: Customers can view all their past and current orders.
*   **Order Tracking View (`/orders/[id]`)**: Each order has a detailed view showing the exact status as it updates in real time:
    1.  *Placed (New)*: Admin has received the order.
    2.  *Cooking*: Admin has started preparing the food.
    3.  *Ready*: Food is cooked and waiting for the delivery partner.
    4.  *Delivered*: The delivery partner has successfully dropped off the food.

---

## 2. Admin Portal
**URL:** `/admin`

The Admin Portal represents the restaurant's operational kitchen and management staff. It controls the incoming orders and the core menu catalog.

### A. Admin Dashboard
*   **Dashboard (`/admin`)**: A high-level view showing basic daily metrics like "Today's Sales", "Active Orders", and "Recent Orders". *(Note: Some dashboard visualization widgets may currently display placeholder data for UI demonstration purposes).*

### B. Kitchen Order Management (Kanban Board)
*   **Orders Pipeline (`/admin/orders`)**: Incoming orders from customers immediately appear here. The admin uses a Kanban-style pipeline to move orders through different preparation phases:
    *   **New**: Acknowledging the customer's fresh order.
    *   **Cooking**: By moving an order here, the admin signals the kitchen has started food preparation. *(The customer sees "Cooking" on their end).*
    *   **Ready**: Once cooking is complete, the admin moves the order to "Ready". At this stage, the order is forwarded to the Delivery Portal for a driver to pick up.

### C. Menu Management
*   **Menu Catalog (`/admin/menu`)**: A full control center for the restaurant's offerings.
    *   **Toggle Stock**: Instantly flip a switch to mark an item 'In-Stock' or 'Out-of-Stock'.
    *   **Edit Items**: Update the price, name, description, and categories of existing food items.
    *   **Add New Items**: Create new food entries, including uploading a custom image for the item.
    *   **Delete Items**: Remove retired dishes from the catalog permanently.

---

## 3. Delivery Portal
**URL:** `/delivery`

The Delivery Portal is built exclusively for your delivery drivers/partners on the ground.

### A. Order Fulfillment
*   **Delivery Dashboard (`/delivery`)**: 
    *   **Pickup Pipeline**: As soon as the Admin marks an order as "Ready" in the kitchen, it instantly pops up on the driver's dashboard.
    *   **Mark as Delivered**: The driver picks up the physical order from the restaurant and heads out. Upon handing the food to the customer, the driver clicks **"Mark Delivered"**. 
    *   **Lifecycle Complete**: This action permanently closes the active order loop, updating the customer's tracking screen to "Delivered" and moving the order to the historical archives. 

---
*Note: Any routing outside of this explicitly documented functional loop (such as payment gateway integrations, real-time map driver tracking, or advanced user authentication/login logic) falls under future or WIP developments.*
