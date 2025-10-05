import { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface AddDebtorFormProps {
  onAdd: (name: string) => void;
}

export const AddDebtorForm = ({ onAdd }: AddDebtorFormProps) => {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
      >
        <UserPlus size={20} />
        <span className="font-semibold">Tambah Debitur Baru</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-500">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UserPlus size={20} />
        Tambah Debitur Baru
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="debtor-name" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Debitur
          </label>
          <input
            id="debtor-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama debitur"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
            }}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};
