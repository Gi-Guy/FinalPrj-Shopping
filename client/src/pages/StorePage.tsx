import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
  price: number;
  description: string;
  category_id: number;
}

export default function StorePage() {
  const { slug } = useParams();

  const [shop, setShop] = useState<Shop | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, description: "", category_id: 0 });

  useEffect(() => {
    if (!slug) return;

    axios.get(`${API_URL}/api/shops/${slug}`).then((res) => setShop(res.data as Shop));

    axios.get(`${API_URL}/api/categories/shops/${slug}/all`).then((res) => {
      setCategories(res.data as Category[]);
    });

    axios.get(`${API_URL}/api/products/shop/${slug}`).then((res) => {
      setProducts(res.data as Product[]);
    });
  }, [slug]);

  const handleAddCategory = () => {
    axios
      .post(`${API_URL}/api/categories`, {
        ...newCategory,
        shop_slug: slug,
      })
      .then((res) => setCategories([...categories, res.data as Category]));
  };

  const handleAddProduct = () => {
    axios
      .post(`${API_URL}/api/products`, {
        ...newProduct,
        shop_slug: slug,
      })
      .then((res) => setProducts([...products, res.data as Product]));
  };

  if (!shop) return <div>Loading...</div>;

  return (
    <div className="store-page">
      <h1>{shop.name}</h1>
      <p>{shop.description}</p>
      <p>Working Hours: {shop.working_hours}</p>
      <p>Status: {shop.is_active ? "Active" : "Inactive"}</p>

      <hr />

      <section>
        <h2>Categories</h2>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <button onClick={handleAddCategory}>Add Category</button>
        </div>
      </section>

      <hr />

      <section>
        <h2>Products</h2>
        <ul>
          {products.map((prod) => (
            <li key={prod.id}>
              {prod.name} - ₪{prod.price}
            </li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <select
            value={newProduct.category_id}
            onChange={(e) => setNewProduct({ ...newProduct, category_id: parseInt(e.target.value) })}
          >
            <option value="0">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddProduct}>Add Product</button>
        </div>
      </section>
    </div>
  );
}
