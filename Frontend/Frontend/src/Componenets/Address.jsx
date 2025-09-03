import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { FiArrowLeft, FiPlus, FiEdit3, FiSave, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

function Address() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editedAddress, setEditedAddress] = useState('');

  const API_BASE = "http://127.0.0.1:8000/api";
  const userPhone = localStorage.getItem('userPhone');

  // Fetch user profile and address
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userPhone) return;
      try {
        const res = await axios.get(`${API_BASE}/get-user-profile/?phone=${userPhone}`);
        if (res.data.address) {
          setAddresses([{ id: 1, address: res.data.address }]); // single address object
        }
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err);
      }
    };
    fetchProfile();
  }, [userPhone]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2) {
      try {
        const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value)}&key=f772a5f1bab443d589a9a03bc3dd9004&limit=5`);
        const data = await res.json();
        const results = data.results.map(item => item.formatted);
        setSuggestions(results);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleAddAddress = async (address) => {
    if (!address.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/update-user-profile/`, { phone_number: userPhone, address });
      setAddresses([{ id: 1, address }]);
      setSearchQuery('');
      setSuggestions([]);
    } catch (err) {
      console.error("Error adding address:", err.response?.data || err);
      alert("Failed to add address");
    }
  };

  const handleSetPrimary = (index) => setSelectedIndex(index);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedAddress(addresses[index].address);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.post(`${API_BASE}/update-user-profile/`, { phone_number: userPhone, address: editedAddress });
      const updated = [...addresses];
      updated[editIndex].address = editedAddress;
      setAddresses(updated);
      setEditIndex(null);
      setEditedAddress('');
    } catch (err) {
      console.error("Error updating address:", err.response?.data || err);
      alert("Failed to update address");
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.post(`${API_BASE}/update-user-profile/`, { phone_number: userPhone, address: "" });
      const updated = addresses.filter((_, i) => i !== index);
      setAddresses(updated);
      setSelectedIndex(0);
    } catch (err) {
      console.error("Error deleting address:", err.response?.data || err);
      alert("Failed to delete address");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fceeea] text-[#4b2c20] flex justify-center items-center px-4 py-5">
        <div className="w-full max-w-lg">

          <div className="flex items-center gap-3 mb-6">
            <FiArrowLeft size={24} className="cursor-pointer" />
            <h1 className="text-xl font-semibold">Select Location</h1>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Address"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white placeholder-gray-500 mb-2"
          />

          {suggestions.length > 0 && (
            <div className="bg-white border border-gray-300 rounded-lg mb-4 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAddAddress(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          <div
            className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm mb-6 cursor-pointer"
            onClick={() => handleAddAddress(searchQuery)}
          >
            <div className="flex items-center gap-3 text-[#d12c6a] font-semibold">
              <FiPlus size={20} />
              Add New Address
            </div>
            <span className="text-[#d12c6a] text-xl">{'>'}</span>
          </div>

          <h2 className="mt-4 mb-2 font-semibold text-lg">Saved Addresses</h2>
          <div className="space-y-4">
            {addresses.map((item, index) => (
              <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="w-full">
                    <h3 className="font-bold flex items-center justify-between">
                      Address {index + 1}
                      {selectedIndex === index && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded ml-2">
                          Selected
                        </span>
                      )}
                    </h3>

                    {editIndex === index ? (
                      <input
                        type="text"
                        className="w-full mt-2 p-2 border border-gray-300 rounded"
                        value={editedAddress}
                        onChange={(e) => setEditedAddress(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm mt-1 cursor-pointer" onClick={() => handleSetPrimary(index)}>
                        {item.address || "No address"}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {editIndex === index ? (
                      <button className="text-green-600 hover:text-green-800" onClick={handleSaveEdit} title="Save">
                        <FiSave size={18} />
                      </button>
                    ) : (
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(index)} title="Edit">
                        <FiEdit3 size={18} />
                      </button>
                    )}
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(index)} title="Delete">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <p className="text-sm text-gray-500">No addresses saved yet.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Address;
