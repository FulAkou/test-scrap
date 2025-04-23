import axios from "axios";
import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        console.log("Produits récupérés :", res.data); // 👈 Ajoute ça
        setProducts(res.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des produits:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Chargement des produits...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Liste des Produits</h2>
      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product._id} className="p-2 border rounded shadow">
            <h3 className="font-semibold">{product.name}</h3>
            <p>Marque : {product.brand}</p>
            <p>Prix : {product.price} €</p>
            <p>
              Prix ancien :{" "}
              <span className="line-through">{product.old_price}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
