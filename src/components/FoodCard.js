"use client";
import { useCart } from "@/context/CartContext";

export default function FoodCard({ item, index = 0 }) {
    const { addItem, removeItem, getItemQuantity } = useCart();
    const qty = getItemQuantity(item.id);

    // Handle both camelCase (local data) and snake_case (Supabase data)
    const isNew = item.isNew || item.is_new;
    const isPopular = item.isPopular || item.is_popular;
    const originalPrice = item.originalPrice || item.original_price;
    const inStock = item.inStock !== undefined ? item.inStock : (item.in_stock !== undefined ? item.in_stock : true);

    // Parse crop data for image display
    const imagePosition = item.image_position || item.imagePosition;
    const getCropStyle = () => {
        if (!imagePosition) return {};
        try {
            const c = JSON.parse(imagePosition);
            if (c.z || c.x || c.y) {
                return {
                    transform: `scale(${c.z || 1}) translate(${c.x || 0}px, ${c.y || 0}px)`,
                    transformOrigin: 'center center',
                };
            }
        } catch { /* legacy string value, ignore */ }
        return {};
    };

    return (
        <div
            className={`bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full animate-slide-up opacity-0 stagger-${Math.min(index + 1, 6)}`}
            style={{ animationFillMode: "forwards" }}
        >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                <img
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    src={item.image}
                    loading="lazy"
                    style={getCropStyle()}
                />
                {/* Tags */}
                {!inStock && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <span className="bg-red-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sold Out</span>
                    </div>
                )}
                {isNew && (
                    <div className="absolute top-2 left-2 bg-emerald-light/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">New</span>
                    </div>
                )}
                {item.tags?.includes("bestseller") && !isNew && (
                    <div className="absolute top-2 left-2 bg-saffron/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">Bestseller</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-1">
                <div className="flex items-start gap-1.5 mb-1">
                    <div className="veg-dot mt-0.5 shrink-0"></div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-surface-dark text-sm truncate leading-tight">{item.name}</h4>
                            {item.rating && (
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <span className="material-symbols-outlined text-[11px] text-yellow-500 filled">star</span>
                                    <span className="text-[10px] font-bold text-gray-500">{item.rating}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex flex-col leading-none">
                        <span className="text-[15px] font-bold text-emerald-dark">₹{item.price}</span>
                        {originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
                        )}
                    </div>

                    {qty === 0 ? (
                        <button
                            onClick={() => inStock && addItem(item)}
                            disabled={!inStock}
                            className={`h-8 px-4 rounded-full text-[11px] font-bold uppercase tracking-wide flex items-center justify-center press-scale transition-colors ${inStock ? 'bg-emerald text-white hover:bg-emerald-dark' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                            {inStock ? 'Add' : 'Sold Out'}
                        </button>
                    ) : (
                        <div className="flex items-center gap-0 bg-emerald rounded-full overflow-hidden">
                            <button
                                onClick={() => removeItem(item.id)}
                                className="h-8 w-8 flex items-center justify-center text-white hover:bg-emerald-dark transition-colors press-scale"
                            >
                                <span className="material-symbols-outlined text-[18px]">remove</span>
                            </button>
                            <span className="text-white text-sm font-bold min-w-[20px] text-center">{qty}</span>
                            <button
                                onClick={() => addItem(item)}
                                className="h-8 w-8 flex items-center justify-center text-white hover:bg-emerald-dark transition-colors press-scale"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
