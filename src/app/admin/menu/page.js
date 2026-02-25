"use client";
import { useState, useMemo } from "react";
import { menuItems as initialData, categories as predefinedCategories } from "@/data/menu";

export default function MenuManager() {
    const [items, setItems] = useState(
        initialData.map(item => ({ ...item, inStock: true }))
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const toggleStock = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, inStock: !item.inStock } : item
        ));
    };

    const handleEditClick = (item) => {
        setEditingItem(item.id);
        setEditForm({ ...item, categories: [...item.categories] });
    };

    const handleSaveEdit = () => {
        setItems(items.map(item => item.id === editingItem ? { ...editForm } : item));
        setEditingItem(null);
        setEditForm(null);
    };

    const toggleCategory = (categoryId) => {
        if (editForm.categories.includes(categoryId)) {
            setEditForm({ ...editForm, categories: editForm.categories.filter(id => id !== categoryId) });
        } else {
            setEditForm({ ...editForm, categories: [...editForm.categories, categoryId] });
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [items, searchTerm]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in flex flex-col h-full overflow-hidden">
            {/* Header Actions */}
            <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center sticky top-0 bg-white rounded-t-2xl z-20">
                <div className="relative w-full sm:w-auto">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[18px]">search</span>
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 h-10 pl-9 pr-4 rounded-xl bg-surface border-0 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-light/30"
                    />
                </div>
                <button className="w-full sm:w-auto h-10 px-5 rounded-xl bg-emerald text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-dark transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add New Item
                </button>
            </div>

            {/* Data Table */}
            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left border-collapse min-w-[850px]">
                    <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-12 text-center">No.</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-16">Image</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Item Name & Details</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-32">Category</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-32">Price</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-40 text-center">Stock Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider w-24 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredItems.map((item, i) => (
                            <tr key={item.id} className={`hover:bg-gray-50/50 transition-colors animate-slide-up opacity-0 stagger-${Math.min(i + 1, 6)}`} style={{ animationFillMode: 'forwards' }}>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-xs font-bold text-gray-400">{i + 1}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200/50">
                                        <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${!item.inStock && 'grayscale opacity-50'}`} />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="veg-dot" style={{ width: 12, height: 12 }}></div>
                                        <span className={`font-semibold text-sm ${item.inStock ? 'text-surface-dark' : 'text-gray-400 line-through'}`}>{item.name}</span>
                                        {item.isPopular && <span className="bg-saffron/20 text-saffron-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Popular</span>}
                                    </div>
                                    <div className="text-[11px] text-gray-500 line-clamp-1 max-w-sm">{item.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.categories.map(cat => (
                                            <span key={cat} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-medium capitalize border border-gray-200">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-surface-dark">₹{item.price}</span>
                                        <button onClick={() => handleEditClick(item)} className="p-1 hover:bg-emerald-50 rounded-md transition-colors group">
                                            <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-emerald transition-colors">edit</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => toggleStock(item.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.inStock ? 'bg-emerald' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.inStock ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <div className={`text-[10px] mt-1 font-bold ${item.inStock ? 'text-emerald' : 'text-red-500'}`}>
                                        {item.inStock ? 'In Stock' : 'Sold Out'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-gray-400 hover:text-emerald transition-colors rounded-lg hover:bg-emerald-50">
                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <span className="material-symbols-outlined text-[48px] text-gray-200 mb-4">search_off</span>
                        <p className="text-gray-500 text-sm font-medium">No menu items found</p>
                    </div>
                )}
            </div>

            {/* Edit Item Modal */}
            {editingItem && editForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-surface-dark">Edit Item</h2>
                            <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="flex gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-gray-100 shrink-0 border border-gray-200/50 overflow-hidden relative">
                                    <img src={editForm.image} alt={editForm.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <span className="material-symbols-outlined text-white text-[20px]">photo_camera</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Item Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-light/30 focus:border-emerald"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-light/30 focus:border-emerald font-bold text-surface-dark"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                <textarea
                                    rows="2"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-light/30 focus:border-emerald resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Categories (Multiple)</label>
                                <div className="flex flex-wrap gap-2">
                                    {predefinedCategories.filter(c => c.id !== 'all').map(cat => {
                                        const isSelected = editForm.categories.includes(cat.id);
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors border ${isSelected
                                                        ? 'bg-emerald border-emerald text-white shadow-sm'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {isSelected && <span className="material-symbols-outlined text-[14px] align-middle mr-1 -ml-1">check</span>}
                                                {cat.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
                            <button onClick={() => setEditingItem(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-white transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSaveEdit} className="px-6 py-2.5 rounded-xl bg-emerald text-white text-sm font-bold hover:bg-emerald-dark transition-colors shadow-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
