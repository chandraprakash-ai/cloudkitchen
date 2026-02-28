#!/bin/bash
images=(
    "sambar_vada_idli.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Idli_Sambar_and_Vada.jpg/800px-Idli_Sambar_and_Vada.jpg"
    "dal_baati.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Dal_baati_churma.jpg/800px-Dal_baati_churma.jpg"
    "rice.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Boiled_rice.jpg/800px-Boiled_rice.jpg"
    "pulao.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vegetable_Pulao.jpg/800px-Vegetable_Pulao.jpg"
    "malai_sandwich.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Malai_Sandwich_1.jpg/800px-Malai_Sandwich_1.jpg"
    "papad.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Papadum_-_Roasted.JPG/800px-Papadum_-_Roasted.JPG"
    "uttapam.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Mini_Uttappam.jpg/800px-Mini_Uttappam.jpg"
    "chaat_papdi.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Papdi_Chaat.JPG/800px-Papdi_Chaat.JPG"
    "aloo_tikki.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Aloo_Tikki_served_with_chutneys.jpg/800px-Aloo_Tikki_served_with_chutneys.jpg"
    "dahi_vada.jpg|https://upload.wikimedia.org/wikipedia/commons/2/2d/Dahi_bhalla_or_dahi_wada_or_dahi_bada.PNG"
    "kadhi.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kadhi_Pakora.jpg/800px-Kadhi_Pakora.jpg"
    "dry_veg.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Aloo_gobi.jpg/800px-Aloo_gobi.jpg"
    "shahi_tukda.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Shahi_Tukray_%28Shahi_Tukda%29.JPG/800px-Shahi_Tukray_%28Shahi_Tukda%29.JPG"
    "shahi_kheer.jpg|https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Kheer.jpg/800px-Kheer.jpg"
)

for item in "${images[@]}"; do
    IFS='|' read -ra parts <<< "$item"
    filename="${parts[0]}"
    url="${parts[1]}"
    
    echo "Downloading $filename..."
    curl -L -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" -o "public/images/menu/$filename" "$url"
done
