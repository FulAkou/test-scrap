import axios from "axios";
import { Chart, registerables } from "chart.js";
import { useEffect, useRef, useState } from "react";

// Enregistre tous les modules nécessaires de Chart.js
Chart.register(...registerables);

const TestScraping = () => {
  // Références pour le canvas du graphique et son instance
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // États pour les données, les filtres, le graphique et les messages
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Tous");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [chartType, setChartType] = useState("bar");
  const [errorMessage, setErrorMessage] = useState("");

  // Récupère les produits à partir du backend à l'initialisation
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (error) {
        console.error("Erreur récupération produits :", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Refiltrage dynamique en fonction des champs de recherche et des sélections
  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedBrand !== "Tous") {
      result = result.filter((product) => product.brand === selectedBrand);
    }

    if (selectedCategory !== "Toutes") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(result);
  }, [search, selectedBrand, selectedCategory, products]);

  // Génère ou met à jour le graphique en fonction des produits sélectionnés et du type de graphique
  useEffect(() => {
    if (!chartRef.current) return;

    // Supprime l'ancien graphique avant d'en créer un nouveau
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = ["Prix actuel", "Ancien prix"];
    const datasets = selectedProducts.map((product) => ({
      label: product.name,
      data: [product.price, product.old_price],
      backgroundColor: chartType === "bar" ? getRandomColor(0.6) : undefined,
      borderColor: getRandomColor(1),
      fill: chartType !== "line",
      tension: 0.4,
    }));

    // Création du nouveau graphique
    chartInstance.current = new Chart(chartRef.current, {
      type: chartType,
      data: { labels, datasets },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    });
  }, [selectedProducts, chartType]);

  // Gère l'ajout ou la suppression d'un produit à comparer
  const handleProductClick = (product) => {
    const exists = selectedProducts.find((p) => p._id === product._id);

    if (exists) {
      // Supprime le produit de la sélection
      setSelectedProducts((prev) => prev.filter((p) => p._id !== product._id));
      setErrorMessage(""); // Réinitialise le message d’erreur
    } else {
      // Limite de 3 produits comparés en même temps
      if (selectedProducts.length >= 3) {
        setErrorMessage("Vous ne pouvez comparer que 3 produits au maximum.");
        return;
      }
      setSelectedProducts((prev) => [...prev, product]);
      setErrorMessage(""); // Réinitialise le message d’erreur
    }
  };

  // Réinitialise tous les filtres
  const resetFilters = () => {
    setSearch("");
    setSelectedBrand("Tous");
    setSelectedCategory("Toutes");
    setSelectedProducts([]);
  };

  // Génère une couleur aléatoire avec opacité pour les graphiques
  const getRandomColor = (opacity) => {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Extrait les marques et catégories uniques à partir des produits
  const brands = ["Tous", ...new Set(products.map((p) => p.brand))];
  const categories = ["Toutes", ...new Set(products.map((p) => p.category))];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Filtres et contrôles */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-1">
          Analyse & Comparaison Produits
        </h2>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* Champ de recherche */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit"
            className="border rounded px-3 py-2 flex-1 min-w-[200px]"
          />

          {/* Sélection de marque */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {brands.map((brand, idx) => (
              <option key={idx} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {/* Sélection de catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sélection du type de graphique */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="radar">Radar</option>
          </select>

          {/* Bouton de réinitialisation */}
          <button
            onClick={resetFilters}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Grille contenant la liste des produits et le graphique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Liste des produits filtrés */}
        <div className="bg-slate-50 shadow-md rounded-lg p-6 space-y-4 max-h-[500px] overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Produits</h3>
          {loading ? (
            <p>Chargement...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-red-500">Aucun produit trouvé.</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className={`cursor-pointer border p-4 rounded shadow-sm ${
                  selectedProducts.some((p) => p._id === product._id)
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-blue-100"
                }`}
              >
                <h4 className="font-semibold">{product.name}</h4>
                <p>Marque : {product.brand}</p>
                <p>Catégorie : {product.category}</p>
                <p>Prix : {product.price} €</p>
                <p>
                  Ancien prix :{" "}
                  <span className="line-through">{product.old_price} €</span>
                </p>
              </div>
            ))
          )}
        </div>

        {/* Affichage du graphique comparatif */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Graphique Comparatif</h3>
          <canvas ref={chartRef}></canvas>
          {errorMessage && (
            <div className="mt-12 text-red-500 text-center bg-gray-100 py-4 px-4 rounded-md font-semibold text-[1rem]">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestScraping;
