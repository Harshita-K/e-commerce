import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    username: '',
    email: '',
    stats: {},
    recentActivities: [],
    isLoading: true,
    error: null
  });
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchAllProducts();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get the auth token from local storage
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/products/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDashboardData({
        ...response.data,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        ...dashboardData,
        isLoading: false,
        error: 'Failed to load dashboard data. Please try again later.'
      });
    }
  };

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      
      setProductsLoading(true);
      const response = await axios.get('http://localhost:8080/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProducts(response.data);
      setProductsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductsError('Failed to load products. Please try again later.');
      setProductsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      
      {dashboardData.isLoading ? (
        <p>Loading your dashboard data...</p>
      ) : dashboardData.error ? (
        <div className="alert alert-danger">{dashboardData.error}</div>
      ) : (
        <div>
          <div className="card mb-4">
            <div className="card-body">
              <h2>Welcome, {dashboardData.username}</h2>
              <p className="text-muted">{dashboardData.email}</p>
            </div>
          </div>
          
          {dashboardData.stats && (
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Total Items</h5>
                    <p className="card-text display-4">{dashboardData.stats.totalItems || 0}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Active Listings</h5>
                    <p className="card-text display-4">{dashboardData.stats.activeListings || 0}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Completed Sales</h5>
                    <p className="card-text display-4">{dashboardData.stats.completedSales || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Products Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h3>Your Products</h3>
            </div>
            <div className="card-body">
              {productsLoading ? (
                <p>Loading products...</p>
              ) : productsError ? (
                <div className="alert alert-danger">{productsError}</div>
              ) : products.length > 0 ? (
                <div className="row">
                  {products.map(product => (
                    <div key={product._id} className="col-md-4 mb-3">
                      <div className="card h-100">
                        {product.image && (
                          <img 
                            src={product.image} 
                            className="card-img-top" 
                            alt={product.name} 
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">${product.price}</h6>
                          <p className="card-text">{product.description.substring(0, 100)}...</p>
                          <p className="card-text">
                            <small className="text-muted">Category: {product.category}</small>
                          </p>
                          <p className="card-text">
                            <small className="text-muted">Condition: {product.condition}</small>
                          </p>
                          <p className="badge bg-info">{product.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No products found. Start selling by adding your first product!</p>
              )}
            </div>
          </div>
          
          {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3>Recent Activities</h3>
              </div>
              <ul className="list-group list-group-flush">
                {dashboardData.recentActivities.map((activity, index) => (
                  <li key={index} className="list-group-item">
                    <p className="mb-1">{activity.description}</p>
                    <small className="text-muted">{new Date(activity.timestamp).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-4">This is a protected page that only authenticated users can access.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
