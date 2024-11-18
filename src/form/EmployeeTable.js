// src/components/EmployeeTable.js
// EmployeeTable.js

import React, { useState } from 'react';

// Data nodes dan edges yang sudah disediakan
const nodes = [
  { id: '197', data: { name: 'Andi Baik Hati', position: 'CEO' } },
  { id: '2', data: { name: 'Budi Pengertian', position: 'CTO' } },
  { id: '3', data: { name: 'Bayu Pemberani', position: 'CFO' } },
  { id: '4', data: { name: 'Jono Rendah Hati', position: 'Dev Team' } },
  { id: '5', data: { name: 'Rudi Tidak Banyak Bicara', position: 'Finance Team' } },
];

const edges = [
  { id: 'e1-2', source: '197', target: '2' },  // CEO -> CTO
  { id: 'e1-3', source: '197', target: '3' },  // CEO -> CFO
  { id: 'e3-4', source: '3', target: '4' },  // CFO -> Dev Team
  { id: 'e3-5', source: '3', target: '5' },  // CFO -> Finance Team
];

function EmployeeTable() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeader, setNewLeader] = useState('');

  // Fungsi untuk membuka modal dan set karyawan yang dipilih
  const openModal = (employeeId) => {
    const employee = nodes.find((node) => node.id === employeeId);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    // Cari pimpinan dari edges yang sesuai
    const leaderEdge = edges.find((edge) => edge.target === employeeId);
    if (leaderEdge) {
      const leader = nodes.find((node) => node.id === leaderEdge.source);
      setNewLeader(leader ? leader.data.name : '');
    } else {
      setNewLeader(''); // Jika tidak ada pimpinan (seperti Andi, CEO)
    }
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewLeader('');
  };

  // Fungsi untuk mengupdate pimpinan
  const updateLeader = () => {
    if (!selectedEmployee || !newLeader) return;

    const newLeaderId = nodes.find((node) => node.data.name === newLeader)?.id;
    if (newLeaderId) {
      // Cari apakah sudah ada edge dengan target ke karyawan yang dipilih
      const existingEdge = edges.find((edge) => edge.target === selectedEmployee.id);
      if (existingEdge) {
        // Jika ada, update source-nya
        existingEdge.source = newLeaderId;
      } else {
        // Jika tidak ada, buat edge baru
        edges.push({
          id: `e${newLeaderId}-${selectedEmployee.id}`,
          source: newLeaderId,
          target: selectedEmployee.id,
        });
      }
    }

    closeModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Table</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Position</th>
            <th className="px-4 py-2 text-left">Leader</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            const leaderEdge = edges.find((edge) => edge.target === node.id);
            const leader = leaderEdge
              ? nodes.find((n) => n.id === leaderEdge.source)
              : null;
            return (
              <tr key={node.id} className="border-t">
                <td className="px-4 py-2">{node.data.name}</td>
                <td className="px-4 py-2">{node.data.position}</td>
                <td className="px-4 py-2">{leader ? leader.data.name : 'None'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(node.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Update Leader
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal Update Leader */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Update Leader</h2>
            <div>
              <label className="block mb-2">New Leader:</label>
              <select
                value={newLeader}
                onChange={(e) => setNewLeader(e.target.value)}
                className="border border-gray-300 p-2 w-full mb-4"
              >
                <option value="" disabled>Select a new leader</option>
                {nodes
                  .filter((n) => n.id !== selectedEmployee?.id) // Menghindari memilih diri sendiri
                  .map((node) => (
                    <option key={node.id} value={node.data.name}>
                      {node.data.name} ({node.data.position})
                    </option>
                  ))}
              </select>
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={updateLeader}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTable;
