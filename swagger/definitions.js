/**
 * @swagger
 * components:
 *   schemas:
 * 
 *   Food:
 *      type: object
 *      required:
 *          - name
 *          - description
 *          - price
 *          - image
 *          - category
 *      properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          description:
 *            type: string
 *          price:
 *            type: number
 *          image:
 *            type: string
 *          category:
 *            type: string
 *          createdAt:
 *            type: dateTime
 *          updatedAt:
 *            type: dateTime
 *      example:
 *          name: "Okok Salé"
 *          description: "Food provides essential nutrients for overall health and well-being"
 *          price: 12
 *          image: "1762216236892food_1.png"
 *          category: "Salad"
 *          createdAt: "2025-11-04T00:30:36.902Z"
 *          updatedAt: "2025-11-04T03:07:26.551Z"
 * 
 *   
 *   Order:
 *       type: object
 *       required:
 *          - userId
 *          - items
 *          - amount
 *          - address
 *       properties:
 *          id:
 *            type: string
 *          userId:
 *            type: string
 *          items:
 *            type: array
 *          amount:
 *            type: number
 *          address:
 *            type: object
 *          status:
 *            type: string
 *          payment:
 *            type: boolean
 *          createdAt:
 *            type: dateTime
 *          updatedAt:
 *            type: dateTime
 *       example:
 *          userId: "69081f0a1c399840922d30d8"
 *          items: [{}]
 *          amount: 110
 *          address: {}
 *          status: "Delivery"
 *          payment: false
 *          createdAt: "2025-11-06T07:13:09.050Z"
 *          updatedAt: "2025-11-23T04:34:27.294Z"
 * 
 * 
 *   User:
 *      type: object
 *      required:
 *          - name
 *          - email
 *          - password
 *      properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          profile:
 *            type: string
 *          role:
 *            type: string
 *          cartData:
 *            type: object
 *          createdAt:
 *            type: dateTime
 *          updatedAt:
 *            type: dateTime
 *      example:
 *          name: "Tchambi"
 *          email: "Tchambi@gmail.com"
 *          password: "$2b$10$GWLvc9PIRAqrgGbJ60Dik.TJFMrkZuCbCKdRP.9R4jLr9CYN.GpgG"
 *          profile: "1763102108827Maelle.jpeg" 
 *          role: "admin"
 *          cartData: {}
 *          createdAt: "2025-11-11T01:58:40.813Z"
 *          updatedAt: "2025-11-14T06:39:17.394Z"
 *   
 *   
 *   notification:
 *      type: object
 *      required:
 *          - userId
 *          - message
 *          - foodId
 *      properties:
 *          id:
 *            type: string
 *          userId:
 *            type: string
 *          message:
 *            type: string
 *          foodId:
 *            type: string
 *          isRead:
 *            type: boolean
 *          createdAt:
 *            type: dateTime
 *          updatedAt:
 *            type: dateTime
 *      example:
 *          userId: "69226e6129cc24b9d73b2c69"
 *          message: "Your order status has been updated to: Out for delivery"
 *          foodId: "693643c43345640b6259210d"
 *          isRead: false,
 *          createdAt: "2025-12-08T03:22:36.678Z"
 *          updatedAt: "2025-12-08T03:22:36.678Z" 
 */