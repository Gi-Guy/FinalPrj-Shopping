import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Shop {
  name: string;
  description: string;
  working_hours: string;
  is_active: boolean;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string;
}

export default function StorePage() {
  const { slug } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newCategory, setNewCategory] = useState<{ name: string; description: string }>({ name: '', description: '' });
  const [newProduct, setNewProduct] = useState<{ name: string; price: number; description: string; category_id: number }>({ name: '', price: 0, description: '', category_id: 0 });

  useEffect(() => {
    if (!slug) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/shops/${slug}`)
      .then(res => setShop(res.data as Shop))
      .catch(err => console.error('Error loading shop:', err));

    axios.get(`${import.meta.env.VITE_API_URL}/api/categories/shops/${slug}/all`)
      .then(res => {
        if (Array.isArray(res.data)) setCategories(res.data as Category[]);
        else console.error('Categories response is not an array:', res.data);
      })
      .catch(err => console.error('Error loading categories:', err));

    axios.get(`${import.meta.env.VITE_API_URL}/api/products/shop/${slug}`)
      .then(res => {
        if (Array.isArray(res.data)) setProducts(res.data as Product[]);
        else console.error('Products response is not an array:', res.data);
      })
      .catch(err => console.error('Error loading products:', err));
  }, [slug]);

  const handleAddCategory = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, {
      ...newCategory,
      shop_slug: slug,
    })
    .then(res => setCategories([...categories, res.data as Category]))
    .catch(err => console.error('Error adding category:', err));
  };

  const handleAddProduct = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {
      ...newProduct,
      shop_slug: slug,
    })
    .then(res => setProducts([...products, res.data as Product]))
    .catch(err => console.error('Error adding product:', err));
  };

  return (
    <div className="store-page">
      <h2>Store Page</h2>
      {shop && (
        <div>
          <h3>{shop.name}</h3>
          <p>{shop.description}</p>
          <p>Working hours: {shop.working_hours}</p>
          <p>Status: {shop.is_active ? 'Active' : 'Inactive'}</p>
        </div>
      )}

      <section>
        <h4>Categories</h4>
        <ul>
          {Array.isArray(categories) && categories.map(cat => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
        <div>
          <input type="text" placeholder="Category Name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
          <input type="text" placeholder="Description" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />
          <button onClick={handleAddCategory}>Add Category</button>
        </div>
      </section>

      <section>
        <h4>Products</h4>
        <ul>
          {Array.isArray(products) && products.map(prod => (
            <li key={prod.id}>{prod.name} - ${prod.price}</li>
          ))}
        </ul>
        <div>
          <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} />
          <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
          <select value={newProduct.category_id} onChange={(e) => setNewProduct({ ...newProduct, category_id: parseInt(e.target.value) })}>
            <option value={0}>Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button onClick={handleAddProduct}>Add Product</button>
        </div>
      </section>
    </div>
  );
}
