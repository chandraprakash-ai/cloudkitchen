"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { categories as predefinedCategories } from "@/data/menu";
import { supabase } from "@/utils/supabase/client";

export default function MenuManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isAdjusting, setIsAdjusting] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const fileInputRef = useRef(null);
    const imgContainerRef = useRef(null);

    // Parse crop data from image_position (JSON string or legacy string)
    const parseCrop = useCallback((pos) => {
        if (!pos) return { z: 1, x: 0, y: 0 };
        try {
            const parsed = JSON.parse(pos);
            return { z: parsed.z || 1, x: parsed.x || 0, y: parsed.y || 0 };
        } catch {
            return { z: 1, x: 0, y: 0 };
        }
    }, []);

    const getCropStyle = useCallback((pos) => {
        const c = parseCrop(pos);
        return {
            transform: `scale(${c.z}) translate(${c.x}px, ${c.y}px)`,
            transformOrigin: 'center center',
        };
    }, [parseCrop]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                setItems(data);
            } else if (error) {
                console.error("Error fetching menu items:", error);
            }
        } catch (error) {
            console.error("Error fetching menu data:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStock = async (id) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        setItems(items.map(i => i.id === id ? { ...i, in_stock: !i.in_stock } : i));
        await supabase.from('menu_items').update({ in_stock: !item.in_stock }).eq('id', id);
    };

    const handleEditClick = (item) => {
        setEditingItem(item.id);
        setEditForm({ ...item, categories: [...(item.categories || [])] });
    };

    const handleAddClick = () => {
        setEditingItem('new');
        setEditForm({
            name: "",
            price: "",
            description: "",
            categories: [],
            image: "",
            image_position: "center",
            in_stock: true,
            is_popular: false,
            is_new: false,
            is_featured: false
        });
        setImageFile(null);
    };

    const handleSaveEdit = async () => {
        if (!editForm.name.trim() || !editForm.price || Number(editForm.price) <= 0) {
            alert("Please provide a valid item name and a price greater than 0.");
            return;
        }

        setIsSaving(true);
        let finalImageUrl = editForm.image;

        // If user queued an image file to upload, upload it first before saving the item
        if (imageFile) {
            try {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `items/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('menu-images')
                    .upload(filePath, imageFile, { cacheControl: '3600', upsert: false });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(filePath);
                finalImageUrl = publicUrl;

                // Cleanup: Delete old image if updating
                if (editingItem !== 'new') {
                    const oldItem = items.find(i => i.id === editingItem);
                    if (oldItem && oldItem.image && oldItem.image.includes('/storage/v1/object/public/menu-images/')) {
                        const oldPath = oldItem.image.split('/public/menu-images/')[1];
                        if (oldPath) {
                            await supabase.storage.from('menu-images').remove([oldPath]);
                        }
                    }
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image.");
                setIsSaving(false);
                return;
            }
        }

        const dataToSave = { ...editForm, image: finalImageUrl };

        if (editingItem === 'new') {
            const { id, ...insertData } = dataToSave;
            const { data, error } = await supabase.from('menu_items').insert([insertData]).select();
            if (!error && data && data.length > 0) {
                setItems([data[0], ...items]);
            } else {
                console.error("Error adding item:", error);
                alert("Failed to add item: " + error?.message);
            }
        } else {
            setItems(items.map(item => item.id === editingItem ? { ...dataToSave } : item));
            const { id, created_at, ...updateData } = dataToSave;
            const { error } = await supabase.from('menu_items').update(updateData).eq('id', editingItem);
            if (error) {
                console.error("Error updating item:", error);
                alert("Failed to update item: " + error?.message);
            }
        }

        setIsSaving(false);
        setEditingItem(null);
        setEditForm(null);
        setImageFile(null);
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this item?")) return;

        const itemToDelete = items.find(i => i.id === id);

        // Optimistic UI updates
        setItems(items.filter(i => i.id !== id));

        const { error } = await supabase.from('menu_items').delete().eq('id', id);

        if (!error && itemToDelete && itemToDelete.image && itemToDelete.image.includes('/storage/v1/object/public/menu-images/')) {
            const oldPath = itemToDelete.image.split('/public/menu-images/')[1];
            if (oldPath) {
                await supabase.storage.from('menu-images').remove([oldPath]);
            }
        }

        if (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item: " + error?.message);
        }
    };

    const toggleCategory = (categoryId) => {
        if (editForm.categories.includes(categoryId)) {
            setEditForm({ ...editForm, categories: editForm.categories.filter(id => id !== categoryId) });
        } else {
            setEditForm({ ...editForm, categories: [...editForm.categories, categoryId] });
        }
    };

    const queueImageUpload = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert("Please select an image file (JPEG, PNG, WEBP).");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB.");
            return;
        }

        // Create a local blob URL for instant preview without uploading yet
        const objectUrl = URL.createObjectURL(file);
        setEditForm(prev => ({ ...prev, image: objectUrl }));
        setImageFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            queueImageUpload(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handlePaste = (e) => {
        const file = e.clipboardData?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            e.preventDefault();
            queueImageUpload(file);
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
                <button onClick={handleAddClick} className="w-full sm:w-auto h-10 px-5 rounded-xl bg-emerald text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-dark transition-colors shadow-sm">
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
                                        <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${!item.in_stock && 'grayscale opacity-50'}`} />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="veg-dot" style={{ width: 12, height: 12 }}></div>
                                        <span className={`font-semibold text-sm ${item.in_stock ? 'text-surface-dark' : 'text-gray-400 line-through'}`}>{item.name}</span>
                                        {item.is_popular && <span className="bg-saffron/20 text-saffron-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Popular</span>}
                                    </div>
                                    <div className="text-[11px] text-gray-500 line-clamp-1 max-w-sm">{item.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {(item.categories || []).map(cat => (
                                            <span key={cat} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-medium capitalize border border-gray-200">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-sm text-surface-dark">₹{item.price}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => toggleStock(item.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.in_stock ? 'bg-emerald' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.in_stock ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <div className={`text-[10px] mt-1 font-bold ${item.in_stock ? 'text-emerald' : 'text-red-500'}`}>
                                        {item.in_stock ? 'In Stock' : 'Sold Out'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => handleEditClick(item)} className="p-2 text-gray-400 hover:text-emerald transition-colors rounded-lg hover:bg-emerald-50" title="Edit Item">
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Delete Item">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <div className="w-8 h-8 border-4 border-emerald/30 border-t-emerald rounded-full animate-spin"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <span className="material-symbols-outlined text-[48px] text-gray-200 mb-4">search_off</span>
                        <p className="text-gray-500 text-sm font-medium">No menu items found</p>
                    </div>
                ) : null}
            </div>

            {/* Edit Item Modal */}
            {editingItem && editForm && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
                    onPaste={handlePaste}
                >
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-up">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-surface-dark">{editingItem === 'new' ? 'Add New Item' : 'Edit Item'}</h2>
                            <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
                            {/* Left: Main Form */}
                            <div className="flex-1 p-6 space-y-5 min-w-0">
                                {/* Image Dropzone */}
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Item Photo</label>
                                    <div
                                        ref={imgContainerRef}
                                        className={`w-full aspect-[16/9] rounded-xl shrink-0 border-2 bg-gray-950 overflow-hidden relative group transition-all flex flex-col items-center justify-center ${editForm.image ? 'border-transparent' : 'border-dashed border-gray-300 hover:border-emerald hover:bg-emerald-50/50 cursor-pointer bg-gray-50'} ${isAdjusting ? 'cursor-grab active:cursor-grabbing ring-2 ring-emerald ring-offset-2' : ''}`}
                                        onDrop={(e) => { if (!isAdjusting) handleDrop(e); }}
                                        onDragOver={(e) => { if (!isAdjusting) handleDragOver(e); }}
                                        onClick={() => !editForm.image && !isAdjusting && fileInputRef.current?.click()}
                                        onMouseDown={(e) => {
                                            if (!isAdjusting || !editForm.image) return;
                                            e.preventDefault();
                                            const crop = parseCrop(editForm.image_position);
                                            setDragStart({ sx: e.clientX, sy: e.clientY, ox: crop.x, oy: crop.y });
                                        }}
                                        onMouseMove={(e) => {
                                            if (!dragStart || !isAdjusting) return;
                                            const crop = parseCrop(editForm.image_position);
                                            const dx = (e.clientX - dragStart.sx) / crop.z;
                                            const dy = (e.clientY - dragStart.sy) / crop.z;
                                            const newCrop = { z: crop.z, x: Math.round(dragStart.ox + dx), y: Math.round(dragStart.oy + dy) };
                                            setEditForm(prev => ({ ...prev, image_position: JSON.stringify(newCrop) }));
                                        }}
                                        onMouseUp={() => setDragStart(null)}
                                        onMouseLeave={() => setDragStart(null)}
                                        onWheel={(e) => {
                                            if (!isAdjusting || !editForm.image) return;
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const crop = parseCrop(editForm.image_position);
                                            const delta = e.deltaY > 0 ? -0.05 : 0.05;
                                            const newZoom = Math.round(Math.min(3, Math.max(1, crop.z + delta)) * 100) / 100;
                                            const newCrop = { z: newZoom, x: crop.x, y: crop.y };
                                            setEditForm(prev => ({ ...prev, image_position: JSON.stringify(newCrop) }));
                                        }}
                                    >
                                        {editForm.image ? (
                                            <>
                                                <img
                                                    src={editForm.image}
                                                    alt={editForm.name}
                                                    className="w-full h-full object-cover select-none pointer-events-none"
                                                    draggable={false}
                                                    style={getCropStyle(editForm.image_position)}
                                                />

                                                {/* Adjust mode overlay */}
                                                {isAdjusting && (
                                                    <div className="absolute inset-0 pointer-events-none">
                                                        {/* Crosshair guides */}
                                                        <div className="absolute inset-0 border border-white/20" />
                                                        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/15" />
                                                        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/15" />
                                                        <div className="absolute left-0 right-0 top-1/3 h-px bg-white/15" />
                                                        <div className="absolute left-0 right-0 top-2/3 h-px bg-white/15" />
                                                    </div>
                                                )}

                                                {/* Adjust mode toolbar at bottom */}
                                                {isAdjusting && (
                                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex items-center justify-between pointer-events-auto">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Zoom</span>
                                                            <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                                                                {Math.round(parseCrop(editForm.image_position).z * 100)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                onClick={() => setEditForm(prev => ({ ...prev, image_position: JSON.stringify({ z: 1, x: 0, y: 0 }) }))}
                                                                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition-colors backdrop-blur-sm"
                                                            >Reset</button>
                                                            <button
                                                                onClick={() => { setIsAdjusting(false); setDragStart(null); }}
                                                                className="px-3 py-1 rounded-lg bg-emerald hover:bg-emerald-dark text-white text-[11px] font-bold transition-colors"
                                                            >Done</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Hover overlay — only when NOT adjusting */}
                                                {!isAdjusting && (
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[12px] font-semibold transition-colors backdrop-blur-sm"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                                                            Change
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setIsAdjusting(true); }}
                                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[12px] font-semibold transition-colors backdrop-blur-sm"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">crop</span>
                                                            Adjust
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setEditForm({ ...editForm, image: '', image_position: JSON.stringify({ z: 1, x: 0, y: 0 }) }); setImageFile(null); }}
                                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/30 hover:bg-red-500/50 text-white text-[12px] font-semibold transition-colors backdrop-blur-sm"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-emerald transition-colors pointer-events-none p-6 text-center">
                                                <span className="material-symbols-outlined text-[40px] mb-2 opacity-80">cloud_upload</span>
                                                <span className="text-sm font-bold text-surface-dark mb-0.5">Click to browse or drag & drop</span>
                                                <span className="text-[11px] font-medium text-gray-400">Paste (Cmd/Ctrl + V) also works</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/webp"
                                            onChange={(e) => queueImageUpload(e.target.files[0])}
                                        />
                                    </div>
                                </div>

                                {/* Name + Price Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Item Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald font-medium transition-colors"
                                            placeholder="E.g., Shahi Paneer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value === '' ? '' : Number(e.target.value) })}
                                            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/20 focus:border-emerald font-bold text-surface-dark transition-colors"
                                            placeholder="Price"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                                    <textarea
                                        rows="2"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-light/30 focus:border-emerald resize-none"
                                    />
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</label>
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

                            {/* Right: Side Stripe — Badges */}
                            <div className="w-full md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/60 p-5 flex flex-col gap-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Visibility</label>

                                {[
                                    { key: 'is_popular', label: 'Popular', icon: 'local_fire_department', activeColor: '#f59e0b' },
                                    { key: 'is_featured', label: 'Featured', icon: 'star', activeColor: '#10b981' },
                                    { key: 'is_new', label: 'New Item', icon: 'fiber_new', activeColor: '#3b82f6' },
                                ].map(badge => {
                                    const isOn = !!editForm[badge.key];
                                    return (
                                        <button
                                            key={badge.key}
                                            onClick={() => setEditForm({ ...editForm, [badge.key]: !isOn })}
                                            className="flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-left w-full"
                                            style={{
                                                borderColor: isOn ? badge.activeColor : '#e5e7eb',
                                                backgroundColor: isOn ? `${badge.activeColor}10` : '#ffffff',
                                            }}
                                        >
                                            <span
                                                className="material-symbols-outlined text-[20px]"
                                                style={{ color: isOn ? badge.activeColor : '#9ca3af' }}
                                            >{badge.icon}</span>
                                            <span className={`text-[13px] font-semibold flex-1 ${isOn ? 'text-surface-dark' : 'text-gray-500'}`}>
                                                {badge.label}
                                            </span>
                                            {/* Toggle Pill */}
                                            <div
                                                className="relative rounded-full transition-colors shrink-0"
                                                style={{
                                                    width: 36,
                                                    height: 20,
                                                    backgroundColor: isOn ? badge.activeColor : '#d1d5db',
                                                }}
                                            >
                                                <span
                                                    className="absolute rounded-full bg-white shadow-sm transition-transform"
                                                    style={{
                                                        width: 16,
                                                        height: 16,
                                                        top: 2,
                                                        left: isOn ? 18 : 2,
                                                        transition: 'left 0.2s ease',
                                                    }}
                                                />
                                            </div>
                                        </button>
                                    );
                                })}

                                <div className="border-t border-gray-200 my-1" />
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</label>

                                <button
                                    onClick={() => setEditForm({ ...editForm, in_stock: !editForm.in_stock })}
                                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-left w-full"
                                    style={{
                                        borderColor: editForm.in_stock ? '#10b981' : '#ef4444',
                                        backgroundColor: editForm.in_stock ? '#10b98110' : '#ef444410',
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined text-[20px]"
                                        style={{ color: editForm.in_stock ? '#10b981' : '#ef4444' }}
                                    >{editForm.in_stock ? 'check_circle' : 'cancel'}</span>
                                    <span className={`text-[13px] font-semibold flex-1 ${editForm.in_stock ? 'text-surface-dark' : 'text-red-500'}`}>
                                        {editForm.in_stock ? 'In Stock' : 'Sold Out'}
                                    </span>
                                    <div
                                        className="relative rounded-full shrink-0"
                                        style={{
                                            width: 36,
                                            height: 20,
                                            backgroundColor: editForm.in_stock ? '#10b981' : '#ef4444',
                                        }}
                                    >
                                        <span
                                            className="absolute rounded-full bg-white shadow-sm"
                                            style={{
                                                width: 16,
                                                height: 16,
                                                top: 2,
                                                left: editForm.in_stock ? 18 : 2,
                                                transition: 'left 0.2s ease',
                                            }}
                                        />
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
                            <button onClick={() => setEditingItem(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-white transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSaveEdit} disabled={isSaving} className={`px-6 py-2.5 rounded-xl bg-emerald text-white text-sm font-bold hover:bg-emerald-dark transition-colors shadow-sm flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {isSaving ? (
                                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                )}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
