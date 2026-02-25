"use client";
import { useCart } from "@/context/CartContext";

export default function FoodCard({ item, index = 0 }) {
    const { addItem, removeItem, getItemQuantity } = useCart();
    const qty = getItemQuantity(item.id);

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
                />
                {/* Rating badge */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-[12px] text-yellow-500 filled">star</span>
                    <span className="text-[10px] font-bold text-gray-800">{item.rating}</span>
                </div>
                {/* Tags */}
                {item.isNew && (
                    <div className="absolute top-2 left-2 bg-emerald-light/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">New</span>
                    </div>
                )}
                {item.tags?.includes("bestseller") && !item.isNew && (
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
                        <h4 className="font-semibold text-surface-dark text-sm truncate leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex flex-col leading-none">
                        <span className="text-[15px] font-bold text-emerald-dark">₹{item.price}</span>
                        {item.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">₹{item.originalPrice}</span>
                        )}
                    </div>

                    {qty === 0 ? (
                        <button
                            onClick={() => addItem(item)}
                            className="h-8 px-4 rounded-full bg-emerald text-white hover:bg-emerald-dark transition-colors text-[11px] font-bold uppercase tracking-wide flex items-center justify-center press-scale"
                        >
                            Add
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
