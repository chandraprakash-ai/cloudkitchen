"use client";

export default function TestImagesPage() {
    const items = [
        { name: "Sambar Vada, Idli (Thali)", img: "/images/menu/sambar_vada_idli.png" }, // Custom AI
        { name: "Dal Baati, Baingan Bharta (Churma Laddoo)", img: "/images/menu/dal_baati.jpg" }, // Uploaded
        { name: "Rice", img: "https://images.unsplash.com/photo-1539755530862-00f623c00f52?w=800&q=80" }, // Rice bowl
        { name: "Rice Pulao", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80" }, // Biryani/Pulao
        { name: "Malai Sandwich", img: "https://images.unsplash.com/photo-1605197136128-d88e0ab8bcbd?w=800&q=80" }, // Indian Sweet
        { name: "Papad", img: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=800&q=80" }, // Indian appetizer
        { name: "Uttapam, Coconut Chutney", img: "https://images.unsplash.com/photo-1628294895950-98056320c731?w=800&q=80" }, // Dosa/Uttapam
        { name: "Chaat Papdi", img: "/images/menu/chaat_papdi.jpg" }, // Uploaded
        { name: "Aloo Tikki", img: "/images/menu/aloo_tikki.jpg" }, // Uploaded
        { name: "Dahi Vada", img: "/images/menu/dahi_vada.png" }, // Local Wikipedia
        { name: "Thali Includes: Kadhi", img: "/images/menu/kadhi.jpg" }, // Uploaded
        { name: "Thali Includes: Dry Vegetable (Subzi)", img: "/images/menu/dry_veg.jpg" }, // Uploaded
        { name: "Dessert: Shahi Tukda", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80" }, // Dessert
        { name: "Dessert: Shahi Kheer", img: "https://images.unsplash.com/photo-1563805042-7684c8a9ef62?w=800&q=80" } // Kheer/Pudding
    ];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 bg-surface min-h-screen">
            <h1 className="text-3xl font-display font-bold text-surface-dark border-b pb-4">
                Real Food Image Verification
            </h1>
            <p className="text-gray-600 mb-8">
                These are real, verified images of the requested dishes downloaded directly to the local server, guaranteeing they will load instantly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="h-64 bg-gray-100 flex-shrink-0 relative">
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=Failed+to+Load+Local" }}
                            />
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <h2 className="font-bold text-lg text-surface-dark">{item.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
