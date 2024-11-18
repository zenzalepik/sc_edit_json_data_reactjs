import React, { useState } from 'react';
import { nodes as initialNodes, edges as initialEdges } from '../nodes-edges'; // Import data nodes dan edges
import { Button, message } from 'antd';

const OrgChartApp = () => {
  // State untuk menyimpan data nodes, edges, dan form
  const [orgNodes, setOrgNodes] = useState(initialNodes);
  const [orgEdges, setOrgEdges] = useState(initialEdges);
  const [formData, setFormData] = useState({ id: '', name: '', position: '', leaderId: '' });
  const [isEditing, setIsEditing] = useState(false); // Menandakan apakah kita sedang dalam mode edit

  // Handle perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };
  
      // Cek apakah yang diubah adalah 'leaderId', jika iya tampilkan nama leader
      if (name === 'leaderId' && value) {
        const selectedLeader = orgNodes.find((node) => node.id === value);
      }
      
      return updatedData;
    });
  };

  // Fungsi untuk memulai pengeditan node
  const handleEdit = (node) => {
    setFormData({
      id: node.id,
      name: node.data.name,
      position: node.data.position,
      leaderId: findLeaderId(node.id), // Tentukan siapa pimpinan berdasarkan edges
    });
    setIsEditing(true);
  };

  // Fungsi untuk mencari leaderId dari node berdasarkan edges
  const findLeaderId = (id) => {
    const leaderEdge = orgEdges.find((edge) => edge.target === id); // Mencari edge yang menuju node ini
    return leaderEdge ? leaderEdge.source : ''; // Mengembalikan source sebagai leaderId
  };

  // Fungsi untuk menyimpan perubahan node yang sudah diedit
  const handleSave = (e) => {
    e.preventDefault();

    // Update nodes data dengan benar
    const updatedNodes = orgNodes.map((node) => {
      if (node.id === formData.id) {
        return {
          ...node,
          data: {
            name: formData.name,
            position: formData.position,
          },
        };
      }else{
        message.error('');
      }
      return node;
    });

    // Menambahkan perubahan leader jika diperlukan
    const updatedEdges = orgEdges.map((edge) => {
      if (edge.target === formData.id) {
        // message.success('');
        return { ...edge, source: formData.leaderId };
      }
      else{
        // message.error('');
      }
      return edge;
    });

    // Update nodes dan edges setelah edit
    setOrgNodes(updatedNodes);
    setOrgEdges(updatedEdges); // Update edges state
    setIsEditing(false); // Keluar dari mode edit
    setFormData({ id: '', name: '', position: '', leaderId: '' }); // Reset form
    message.success('Data has been saved successfully!');
  };

  // Fungsi untuk membatalkan edit
  const handleCancel = () => {
    setIsEditing(false); // Keluar dari mode edit tanpa menyimpan
    setFormData({ id: '', name: '', position: '', leaderId: '' }); // Reset form
  };

  // Fungsi untuk mendapatkan nama pimpinan berdasarkan leaderId
  const getLeaderName = (leaderId) => {
    if (!leaderId) 
        return 'No Leader'
    ;
    const leaderNode = orgNodes.find((node) => node.id === leaderId);
    return leaderNode ? leaderNode.data.name : 'No Leader';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Organizational Chart Editor</h1>

      {/* Tabel Menampilkan Nodes */}
      <table className="min-w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border border-gray-300">ID</th>
            <th className="px-4 py-2 text-left border border-gray-300">Name</th>
            <th className="px-4 py-2 text-left border border-gray-300">Position</th>
            <th className="px-4 py-2 text-left border border-gray-300">Leader</th>
            <th className="px-4 py-2 text-left border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orgNodes.map((node) => (
            <tr key={node.id} className="border-t border-gray-200">
              <td className="px-4 py-2">{node.id}</td>
              <td className="px-4 py-2">{node.data.name}</td>
              <td className="px-4 py-2">{node.data.position}</td>
              <td className="px-4 py-2">
                {getLeaderName(findLeaderId(node.id))}
              </td>
              <td className="px-4 py-2">
                <Button
                  onClick={() => handleEdit(node)}
                  type="primary"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulir Update Node */}
      {isEditing && (
        <div className="mt-4 p-6 border border-gray-300 rounded">
          <h3 className="text-2xl font-semibold mb-4">Edit Node</h3>
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Position:
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Pimpinan:
                <select
                  name="leaderId"
                  value={formData.leaderId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Leader</option>
                  {orgNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.data.name} ({node.data.position})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex space-x-4">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </Button>
              <Button
                type="default"
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrgChartApp;
