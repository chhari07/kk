import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { PlusCircle, Store, Edit3, BarChart2 } from 'lucide-react';

const ICON_TABS = [
  { name: 'Add Product', icon: <PlusCircle size={24} /> },
  { name: 'My Shop', icon: <Store size={24} /> },
  { name: 'Edit Products', icon: <Edit3 size={24} /> },
  { name: 'Analytics', icon: <BarChart2 size={24} /> },
];

const ShopDashboard = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Add Product');
  const [newProduct, setNewProduct] = useState({
    title: '',
    type: '',
    image: '',
    status: 'Sell',
    statusTag: ['Good Condition', 'Tested', 'Available'],
    additionalImages: [],
    price: '',
    description: '',
  });

  useEffect(() => {
    const fetchUserAndProducts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
      const localData = JSON.parse(localStorage.getItem(`products-${user.id}`)) || [];
      setProducts(localData);
      setLoading(false);
    };
    fetchUserAndProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAdditionalImages = (e) => {
    const urls = e.target.value.split(',').map(url => url.trim());
    setNewProduct(prev => ({ ...prev, additionalImages: urls }));
  };

  const addProduct = () => {
    const product = { ...newProduct, price: parseFloat(newProduct.price), userId: user.id };
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem(`products-${user.id}`, JSON.stringify(updatedProducts));
    setNewProduct({ title: '', type: '', image: '', status: 'Sell', statusTag: ['Good Condition', 'Tested', 'Available'], additionalImages: [], price: '', description: '' });
    alert('✅ Product added locally');
  };

  const deleteProduct = (idx) => {
    const updated = products.filter((_, i) => i !== idx);
    setProducts(updated);
    localStorage.setItem(`products-${user.id}`, JSON.stringify(updated));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let parsedProducts = [];
        const content = event.target.result;
        if (file.name.endsWith('.json')) parsedProducts = JSON.parse(content);
        else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').filter(Boolean);
          const headers = lines[0].split(',').map(h => h.trim());
          parsedProducts = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            obj.userId = user.id;
            return obj;
          });
        }
        const updatedProducts = [...products, ...parsedProducts];
        setProducts(updatedProducts);
        localStorage.setItem(`products-${user.id}`, JSON.stringify(updatedProducts));
        alert(`✅ Imported ${parsedProducts.length} product(s)`);
      } catch {
        alert('❌ Failed to import file.');
      }
    };
    reader.readAsText(file);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  const analyticsData = [
    { name: 'Total Products', value: products.length },
    { name: 'With Price', value: products.filter(p => p.price).length },
    { name: 'Exchange', value: products.filter(p => p.status?.toLowerCase().includes('exchange')).length },
  ];
  const COLORS = ['#34D399', '#60A5FA', '#FBBF24'];

  return (
    <div className="min-h-screen mt-16   bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="flex md:flex-col justify-around md:justify-start md:w-20 bg-white shadow-md py-4 md:py-8 fixed md:relative w-full bottom-0 md:top-0 z-50">
        {ICON_TABS.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex md:flex-col items-center justify-center p-3 md:my-2 rounded-md transition-colors ${
              activeTab === tab.name ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:ml-20">
        {activeTab === 'Add Product' && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">➕ Add New Product</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="title" placeholder="Title" value={newProduct.title} onChange={handleChange} className="p-2 border rounded w-full" />
              <input name="type" placeholder="Category" value={newProduct.type} onChange={handleChange} className="p-2 border rounded w-full" />
              <input name="image" placeholder="Main Image URL" value={newProduct.image} onChange={handleChange} className="p-2 border rounded w-full" />
              <input name="price" placeholder="Price" type="number" value={newProduct.price} onChange={handleChange} className="p-2 border rounded w-full" />
              <input name="additionalImages" placeholder="Additional Images (comma separated)" onChange={handleAdditionalImages} className="p-2 border rounded col-span-2 w-full" />
              <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleChange} className="p-2 border rounded col-span-2 w-full"></textarea>
            </div>
            <button onClick={addProduct} className="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-green-700">Add Product</button>
            <div className="mt-6">
              <input type="file" accept=".json,.csv" onChange={handleFileUpload} className="block w-full border p-2 rounded-md" />
            </div>
          </div>
        )}

        {activeTab === 'My Shop' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {products.map((product, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4">
                <img src={product.image} alt={product.title} className="h-48 w-full object-cover rounded-md" />
                <h3 className="font-semibold text-lg mt-2">{product.title}</h3>
                <p className="text-gray-500">₹ {product.price || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Edit Products' && (
          <div className="space-y-4 mb-6">
            {products.map((product, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                <div>
                  <h4 className="font-medium">{product.title}</h4>
                  <p className="text-gray-500 text-sm">Category: {product.type}</p>
                </div>
                <button onClick={() => deleteProduct(idx)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2 sm:mt-0">Delete</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="font-semibold mb-2">Product Overview</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="font-semibold mb-2">Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={analyticsData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {analyticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDashboard;
