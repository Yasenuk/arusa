import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/products/ProductsList';
import ProductCreate from './pages/products/ProductCreate';
import ProductEdit from './pages/products/ProductEdit';
import CategoriesList from './pages/categories/CategoriesList';
import CategoryCreate from './pages/categories/CategoryCreate';
import ArticlesList from './pages/articles/ArticlesList';
import ArticleCreate from './pages/articles/ArticleCreate';
import ArticleEdit from './pages/articles/ArticleEdit';
import OrdersList from './pages/orders/OrdersList';
import OrderDetail from './pages/orders/OrderDetail';
import UsersList from './pages/users/UsersList';
import PaymentsList from './pages/payments/PaymentsList';
import Login from './pages/Login';

export default function AdminRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/create" element={<ProductCreate />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="categories" element={<CategoriesList />} />
        <Route path="categories/create" element={<CategoryCreate />} />
        <Route path="articles" element={<ArticlesList />} />
        <Route path="articles/create" element={<ArticleCreate />} />
        <Route path="articles/:id/edit" element={<ArticleEdit />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="users" element={<UsersList />} />
        <Route path="payments" element={<PaymentsList />} />
      </Route>
    </Routes>
  );
}