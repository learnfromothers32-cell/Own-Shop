import React, { useContext } from "react";
import { ShopContext } from "../context/shopContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

function ProductsItem({ id, image, name, price }) {
  const { currency } = useContext(ShopContext);

  return (
    <div>
      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
        <div className="overflow-hidden">
          <img
            src={image?.[0] || assets.placeholder_image}
            alt={name}
            className="hover:scale-110 transition duration-200 ease-in-out"
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </Link>
    </div>
    
  );
}

export default ProductsItem;