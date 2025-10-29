import { useState } from 'react';
import { useCategoryStore, type Category } from '../stores/categoryStore';
import { CATEGORY_COLORS } from '../utils';

export const CategoriesTab = () => {
  const categories = useCategoryStore(state => state.categories);
  const addCategory = useCategoryStore(state => state.addCategory);
  const updateCategory = useCategoryStore(state => state.updateCategory);
  const removeCategory = useCategoryStore(state => state.removeCategory);
  const updateCategoryColor = useCategoryStore(state => state.updateCategoryColor);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const success = addCategory(newCategoryName);
    if (!success) {
      alert('Una categoria con questo nome esiste già');
      return;
    }

    setNewCategoryName('');
  };

  const handleRemoveCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);

    if (category?.isDefault) {
      alert('Non puoi eliminare le categorie predefinite');
      return;
    }

    if (confirm(`Sei sicuro di voler eliminare la categoria "${category?.name}"?`)) {
      removeCategory(categoryId);
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleSaveEdit = () => {
    if (!editingName.trim() || !editingId) return;

    const success = updateCategory(editingId, editingName);
    if (!success) {
      alert('Una categoria con questo nome esiste già');
      return;
    }

    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleChangeColor = (categoryId: string, color: string) => {
    updateCategoryColor(categoryId, color);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Gestione Categorie Spese</h2>
        <p className="text-gray-400 text-sm">
          Personalizza le categorie di spesa utilizzate nel Cash Flow. Le categorie predefinite non possono essere eliminate.
        </p>
      </div>

      {/* Add New Category */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Aggiungi Nuova Categoria</h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nome categoria (es. Palestra, Abbonamenti...)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Aggiungi
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Categorie Esistenti</h3>

        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Nessuna categoria disponibile. Aggiungi la tua prima categoria!
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors"
              >
                {/* Color Picker */}
                <div className="relative group">
                  <div
                    className="w-8 h-8 rounded cursor-pointer border-2 border-gray-500 hover:border-gray-400"
                    style={{ backgroundColor: category.color }}
                    title="Cambia colore"
                  />
                  <div className="absolute hidden group-hover:block top-10 left-0 z-10 bg-gray-600 p-2 rounded-lg shadow-lg">
                    <div className="grid grid-cols-4 gap-2">
                      {CATEGORY_COLORS.map((color) => (
                        <div
                          key={color}
                          className="w-6 h-6 rounded cursor-pointer border border-gray-400 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => handleChangeColor(category.id, color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category Name */}
                {editingId === category.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="flex-1 px-3 py-1 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    {category.isDefault && (
                      <div className="text-xs text-gray-400">Categoria predefinita</div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {editingId === category.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded transition-colors text-sm"
                      >
                        Salva
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-sm"
                      >
                        Annulla
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(category)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleRemoveCategory(category.id)}
                        disabled={category.isDefault}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors text-sm"
                      >
                        Elimina
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Come funziona</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <div className="font-semibold">Aggiungi categorie personalizzate</div>
              <div className="text-gray-400">
                Crea categorie specifiche per le tue esigenze (es. Palestra, Netflix, Benzina)
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <div className="font-semibold">Personalizza i colori</div>
              <div className="text-gray-400">
                Clicca sul quadratino colorato per cambiare il colore della categoria
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">✏️</span>
            <div>
              <div className="font-semibold">Modifica o elimina</div>
              <div className="text-gray-400">
                Puoi modificare il nome o eliminare le categorie che hai creato. Le categorie predefinite non possono essere eliminate.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-semibold">Usa le categorie nel Cash Flow</div>
              <div className="text-gray-400">
                Le categorie che crei qui saranno disponibili quando aggiungi spese nella sezione Cash Flow
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Categorie Totali</div>
          <div className="text-2xl font-bold text-blue-500">{categories.length}</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Categorie Predefinite</div>
          <div className="text-2xl font-bold text-green-500">
            {categories.filter(cat => cat.isDefault).length}
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Categorie Personalizzate</div>
          <div className="text-2xl font-bold text-purple-500">
            {categories.filter(cat => !cat.isDefault).length}
          </div>
        </div>
      </div>
    </div>
  );
};
