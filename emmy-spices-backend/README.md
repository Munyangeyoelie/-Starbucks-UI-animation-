# Emmy Spices Backend

A comprehensive Django REST API backend for the Emmy Spices e-commerce platform.

## Features

- **Product Management**: Complete CRUD operations for products, categories, and reviews
- **Order Management**: Handle retail and wholesale orders with status tracking
- **User Management**: Customer, distributor, and admin user types
- **Analytics**: Sales, inventory, and user behavior tracking
- **Payment Integration**: Payment processing and tracking
- **Shipping**: Multiple shipping methods and tracking
- **Admin Dashboard**: Comprehensive admin interface

## Tech Stack

- **Django 5.2.4**: Web framework
- **Django REST Framework**: API framework
- **SQLite**: Database (can be changed to PostgreSQL/MySQL for production)
- **Pillow**: Image processing
- **django-cors-headers**: CORS handling for frontend integration

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emmy-spices-backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `POST /api/products/` - Create a new product
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/low_stock/` - Get low stock products
- `GET /api/products/top_rated/` - Get top rated products

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{id}/` - Get category details
- `GET /api/categories/{id}/products/` - Get products in category

### Orders
- `GET /api/orders/` - List all orders
- `POST /api/orders/` - Create a new order
- `GET /api/orders/{id}/` - Get order details
- `PUT /api/orders/{id}/` - Update order
- `POST /api/orders/{id}/status/` - Update order status

### Users
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user

### Analytics
- `GET /api/analytics/sales/` - Get sales analytics
- `GET /api/analytics/products/` - Get product analytics
- `GET /api/analytics/users/` - Get user analytics

## Models

### Products App
- **Product**: Main product model with pricing, stock, and ratings
- **Category**: Product categories
- **ProductImage**: Additional product images
- **ProductReview**: Customer reviews and ratings

### Orders App
- **Order**: Main order model for both retail and wholesale
- **OrderItem**: Individual items in orders
- **ShippingMethod**: Available shipping options
- **Payment**: Payment tracking

### Users App
- **UserProfile**: Extended user profile with user types
- **DistributorApplication**: Distributor application process
- **UserActivity**: User behavior tracking
- **Notification**: User notifications
- **UserSession**: Session tracking

### Analytics App
- **SalesAnalytics**: Daily sales metrics
- **ProductAnalytics**: Product-specific analytics
- **UserAnalytics**: User behavior analytics
- **WebsiteAnalytics**: Website-wide metrics
- **InventoryAnalytics**: Stock and inventory tracking

## Admin Interface

Access the Django admin interface at `/admin/` to manage:
- Products and categories
- Orders and payments
- Users and profiles
- Analytics data
- System settings

## Development

### Adding New Features
1. Create models in the appropriate app
2. Create serializers for API endpoints
3. Create views for business logic
4. Add URL patterns
5. Register models in admin.py
6. Run migrations

### Testing
```bash
python manage.py test
```

### Code Style
Follow PEP 8 guidelines and use Django best practices.

## Deployment

### Production Settings
1. Set `DEBUG = False`
2. Configure production database (PostgreSQL recommended)
3. Set up static file serving
4. Configure CORS for production domains
5. Set up environment variables

### Environment Variables
Create a `.env` file:
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. 