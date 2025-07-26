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
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({ name: '', description: '', slug: '' });
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'category_name'>>({ name: '', price: 0, description: '', category_id: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingShop, setEditingShop] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;

    axios.get(`${import.meta.env.VITE_API_URL}/api/shops/${slug}`)
      .then(res => setShop(res.data as Shop))
      .catch(err => console.error('Error loading shop:', err));

    axios.get(`${import.meta.env.VITE_API_URL}/api/categories/shop/${slug}`)
      .then(res => setCategories(res.data as Category[]))
      .catch(err => console.error('Error loading categories:', err));

    axios.get(`${import.meta.env.VITE_API_URL}/api/shops/${slug}/products`)
      .then(res => setProducts(res.data as Product[]))
      .catch(err => console.error('Error loading products:', err));
  }, [slug]);

  const handleAddCategory = () => {
    if (!shop) return;
    axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, {
      ...newCategory,
      shopSlug: shop.slug,
    })
      .then(res => {
        setCategories([...categories, res.data as Category]);
        setNewCategory({ name: '', description: '', slug: '' });
      })
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
        imageUrl = (uploadRes.data as UploadResponse).url;
      }

      const productData = {
        ...newProduct,
        shop_id: shop.id,
        image_url: imageUrl,
        seller_id: 1,
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, productData);
      setProducts([...products, res.data as Product]);
      setNewProduct({ name: '', price: 0, description: '', category_id: 0 });
      setImageFile(null);
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleDeleteCategory = (id: number) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`)
      .then(() => setCategories(categories.filter(cat => cat.id !== id)))
      .catch(err => console.error('Error deleting category:', err));
  };

  const handleDeleteProduct = (id: number) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/products/product/${id}`)
      .then(() => setProducts(products.filter(prod => prod.id !== id)))
      .catch(err => console.error('Error deleting product:', err));
  };

  const handleUpdateShop = () => {
    if (!shop) return;
    axios.put(`${import.meta.env.VITE_API_URL}/api/shops/${shop.id}`, shop)
      .then(res => {
        setShop(res.data as Shop);
        setEditingShop(false);
      })
      .catch(err => console.error('Error updating shop:', err));
  };

  const handleUpdateCategory = (category: Category) => {
    axios.put(`${import.meta.env.VITE_API_URL}/api/categories/${category.id}`, category)
      .then(res => {
        setCategories(categories.map(c => (c.id === category.id ? res.data as Category : c)));
        setEditingCategoryId(null);
      })
      .catch(err => console.error('Error updating category:', err));
  };

  const handleUpdateProduct = (product: Product) => {
    axios.put(`${import.meta.env.VITE_API_URL}/api/products/product/${product.id}`, product)
      .then(res => {
        setProducts(products.map(p => (p.id === product.id ? res.data as Product : p)));
        setEditingProductId(null);
      })
      .catch(err => console.error('Error updating product:', err));
  };

  return (
    <div className="store-page">
      <h2>Store Page</h2>
      {shop && (
        <div>
          {editingShop ? (
            <div>
              <input type="text" value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} />
              <input type="text" value={shop.description} onChange={(e) => setShop({ ...shop, description: e.target.value })} />
              <input type="text" value={shop.working_hours} onChange={(e) => setShop({ ...shop, working_hours: e.target.value })} />
              <button onClick={handleUpdateShop}>Save</button>
              <button onClick={() => setEditingShop(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <h3>{shop.name}</h3>
              <p>{shop.description}</p>
              <p>Working hours: {shop.working_hours}</p>
              <p>Status: {shop.is_active ? 'Active' : 'Inactive'}</p>
              <button onClick={() => setEditingShop(true)}>Edit Shop</button>
            </div>
          )}
        </div>
      )}

      <section>
        <h4>Categories</h4>
        <ul>
          {categories.map(cat => (
            <li key={cat.id}>
              {editingCategoryId === cat.id ? (
                <div>
                  <input type="text" value={cat.name} onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, name: e.target.value } : c))} />
                  <input type="text" value={cat.description} onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, description: e.target.value } : c))} />
                  <input type="text" value={cat.slug} onChange={(e) => setCategories(categories.map(c => c.id === cat.id ? { ...c, slug: e.target.value } : c))} />
                  <button onClick={() => handleUpdateCategory(cat)}>Save</button>
                  <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  {cat.name} <button onClick={() => setEditingCategoryId(cat.id)}>Edit</button>
                  <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                </>
              )}
            </li>
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
          {products.map(prod => (
            <li key={prod.id}>
              {editingProductId === prod.id ? (
                <div>
                  <input type="text" value={prod.name} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? { ...p, name: e.target.value } : p))} />
                  <input type="number" value={prod.price} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? { ...p, price: parseFloat(e.target.value) } : p))} />
                  <input type="text" value={prod.description} onChange={(e) => setProducts(products.map(p => p.id === prod.id ? { ...p, description: e.target.value } : p))} />
                  <button onClick={() => handleUpdateProduct(prod)}>Save</button>
                  <button onClick={() => setEditingProductId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  {prod.name} - ${prod.price} - {prod.category_name || 'Unknown'}
                  <button onClick={() => setEditingProductId(prod.id)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(prod.id)}>Delete</button>
                </>
              )}
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
