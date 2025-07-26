import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Shop {
  id: number;
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
  category_name?: string;
}

interface UploadResponse {
  url: string;
}

export default function StorePage() {
  const { slug } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newCategory, setNewCategory] = useState<{ name: string; description: string; slug: string }>({ name: '', description: '', slug: '' });
  const [newProduct, setNewProduct] = useState<{ name: string; price: number; description: string; category_id: number; image_url?: string }>({ name: '', price: 0, description: '', category_id: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!slug) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/shops/${slug}`)
      .then(res => setShop(res.data as Shop))
      .catch(err => console.error('Error loading shop:', err));

    axios.get(`${import.meta.env.VITE_API_URL}/api/categories/shop/${slug}`)
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
    if (!shop) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, {
      ...newCategory,
      shopSlug: shop.slug,
    })
    .then(res => setCategories([...categories, res.data as Category]))
    .catch(err => console.error('Error adding category:', err));
  };

  const handleAddProduct = async () => {
    if (!shop) return;

    try {
      let imageUrl: string | undefined = undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await axios.post<UploadResponse>(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.url;
      }

      const productData = {
        ...newProduct,
        shop_id: shop.id,
        image_url: imageUrl,
        seller_id: 1,
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, productData);
      setProducts([...products, res.data as Product]);
    } catch (err) {
      console.error('Error adding product:', err);
    }
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
          <input type="text" placeholder="Category Slug" value={newCategory.slug} onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })} />
          <button onClick={handleAddCategory}>Add Category</button>
        </div>
      </section>

      <section>
        <h4>Products</h4>
        <ul>
          {Array.isArray(products) && products.map(prod => (
            <li key={prod.id} style={{ marginBottom: '1rem' }}>
              {prod.image_url && <img src={import.meta.env.VITE_API_URL + prod.image_url} alt={prod.name} style={{ width: '60px', marginRight: '10px' }} />}<br />
              <strong>{prod.name}</strong> - ${prod.price}<br />
              <small>Category: {prod.category_name || 'N/A'}</small>
            </li>
          ))}
        </ul>
        <div>
          <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
          <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} />
          <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
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
