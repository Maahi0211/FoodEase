'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, AlertTriangle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

interface Table {
  id: string;
  tableNumber: string;
  restaurantId: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  tableNumber: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal = ({ isOpen, tableNumber, onClose, onConfirm, isDeleting }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Delete Table
          </h3>
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete Table {tableNumber}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QRModalProps {
  isOpen: boolean;
  tableNumber: string;
  qrValue: string;
  onClose: () => void;
}

const QRCodeModal = ({ isOpen, tableNumber, qrValue, onClose }: QRModalProps) => {
  if (!isOpen) return null;

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `table-${tableNumber}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Table {tableNumber} QR Code
        </h3>
        <div className="flex justify-center mb-6">
          <QRCodeSVG
            id="qr-code-canvas"
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
            className="border p-2 rounded-lg"
          />
        </div>
        <div className="text-center text-sm text-gray-600 mb-6">
          Scan this QR code to access the menu and place orders
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={downloadQR}
            className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <QrCode size={18} />
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    tableId: '',
    tableNumber: ''
  });
  const [deletingTableId, setDeletingTableId] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState({
    isOpen: false,
    tableNumber: '',
    qrValue: ''
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://3.111.41.233:8080/api/table/restaurant/my-table', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to fetch tables');
    }
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNumber.trim()) {
      toast.error('Please enter a table number');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://3.111.41.233:8080/api/table/add-table', 
        { tableNumber: newTableNumber },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('Table added successfully');
        setNewTableNumber('');
        setShowAddForm(false);
        fetchTables();
      }
    } catch (error) {
      console.error('Error adding table:', error);
      toast.error('Failed to add table');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (tableId: string, tableNumber: string) => {
    setDeleteModal({ isOpen: true, tableId, tableNumber });
  };

  const confirmDelete = async () => {
    try {
      setDeletingTableId(deleteModal.tableId);
      const response = await axios.delete(
        `http://3.111.41.233:8080/api/table/restaurant/remove-table/${deleteModal.tableId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('Table deleted successfully');
        fetchTables();
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error('Failed to delete table');
    } finally {
      setDeletingTableId(null);
      setDeleteModal({ isOpen: false, tableId: '', tableNumber: '' });
    }
  };

  const handleShowQR = (table: Table) => {
    const qrValue = `${window.location.origin}/${table.restaurantId}/${table.id}`;
    console.log('QR Value:', qrValue);
    setQrModal({
      isOpen: true,
      tableNumber: table.tableNumber,
      qrValue
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Restaurant Tables</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add New Table
        </button>
      </div>

      {/* Add Table Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Table</h2>
            <form onSubmit={handleAddTable}>
              <div className="mb-4">
                <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Table Number
                </label>
                <input
                  type="text"
                  id="tableNumber"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., T1, Table 1"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Table'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-500">
                {table.tableNumber}
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Table {table.tableNumber}
              </h3>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleShowQR(table)}
                  className="text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <QrCode size={20} />
                </button>
                <button
                  onClick={() => handleDelete(table.id, table.tableNumber)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  disabled={deletingTableId === table.id}
                >
                  {deletingTableId === table.id ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        tableNumber={deleteModal.tableNumber}
        onClose={() => setDeleteModal({ isOpen: false, tableId: '', tableNumber: '' })}
        onConfirm={confirmDelete}
        isDeleting={deletingTableId === deleteModal.tableId}
      />

      {/* Empty State */}
      {tables.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No tables added yet
          </h3>
          <p className="text-gray-500">
            Start by adding your first table
          </p>
        </div>
      )}

      {/* Toast Container */}
      <div><Toaster position="top-right" /></div>

      <QRCodeModal
        isOpen={qrModal.isOpen}
        tableNumber={qrModal.tableNumber}
        qrValue={qrModal.qrValue}
        onClose={() => setQrModal({ isOpen: false, tableNumber: '', qrValue: '' })}
      />
    </div>
  );
}
