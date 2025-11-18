import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', purchasePrice: '', sellingPrice: '', stock: '' });
  const [isEditing, setIsEditing] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({ name: '', purchasePrice: '', sellingPrice: '', stock: '' });
    setIsEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_BASE_URL}/products/${isEditing}` : `${API_BASE_URL}/products`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        fetchProducts(); // Refresh the list
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setIsEditing(product.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchProducts(); // Refresh the list
        }
      } catch (error)        {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">مدیریت محصولات</h1>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{isEditing ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Inputs */}
          <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="نام محصول" className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
          <input type="number" name="purchasePrice" value={form.purchasePrice} onChange={handleInputChange} placeholder="قیمت خرید" className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
          <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleInputChange} placeholder="قیمت فروش" className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
          <input type="number" name="stock" value={form.stock} onChange={handleInputChange} placeholder="موجودی" className="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />

          <div className="md:col-span-2 flex items-center gap-4">
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex-grow">
              {isEditing ? 'ذخیره تغییرات' : 'افزودن محصول'}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="bg-gray-300 dark:bg-gray-600 p-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500">
                لغو
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">لیست محصولات</h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نام</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">قیمت خرید</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">قیمت فروش</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">موجودی</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.purchasePrice}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.sellingPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">ویرایش</button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
