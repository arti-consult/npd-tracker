"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Product, ProductWithScores } from "@/lib/types";
import { enrichProduct } from "@/lib/scoring";
import { getProducts, addProduct, updateProduct, deleteProduct, seedExampleData } from "@/lib/store";
import { useTheme } from "@/components/ThemeProvider";
import FourBlockChart from "@/components/FourBlockChart";
import ProductTable from "@/components/ProductTable";
import ProductForm from "@/components/ProductForm";
import ProductDetail from "@/components/ProductDetail";
import StatsBar from "@/components/StatsBar";

type View = "dashboard" | "add" | "edit" | "detail";

export default function Home() {
  const [products, setProducts] = useState<ProductWithScores[]>([]);
  const [view, setView] = useState<View>("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const seededRef = useRef(false);

  const loadProducts = useCallback(async () => {
    const raw = await getProducts();
    setProducts(raw.map(enrichProduct));
  }, []);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    seedExampleData().then(() => loadProducts());
  }, [loadProducts]);

  const selectedProduct = products.find((p) => p.id === selectedId) || null;

  const handleAdd = async (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    await addProduct(data);
    await loadProducts();
    setView("dashboard");
  };

  const handleUpdate = async (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedId) return;
    await updateProduct(selectedId, data);
    await loadProducts();
    setView("detail");
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await loadProducts();
    if (selectedId === id) {
      setSelectedId(null);
      setView("dashboard");
    }
  };

  const handleProductClick = (id: string) => {
    setSelectedId(id);
    setView("detail");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="border-b border-[var(--border-primary)] sticky top-0 z-50 backdrop-blur-xl" style={{ backgroundColor: "var(--bg-header)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => { setView("dashboard"); setSelectedId(null); }} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">DECIDE</h1>
                <p className="text-[10px] text-[var(--text-tertiary)] tracking-wider uppercase">NPD Tracker</p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
              title={theme === "dark" ? "Bytt til lyst tema" : "Bytt til mørkt tema"}
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {view === "dashboard" && (
              <>
                <button
                  onClick={() => setShowChart(!showChart)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    showChart ? "bg-[var(--bg-tag)] text-[var(--text-primary)]" : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  }`}
                  title={showChart ? "Skjul diagram" : "Vis diagram"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("add")}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--text-primary)] text-[var(--text-inverse)] hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nytt produkt
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === "dashboard" && (
          <div className="space-y-8">
            <StatsBar products={products} />

            {showChart && (
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">4-Block kvadrantanalyse</h2>
                  <span className="text-xs text-[var(--text-tertiary)]">{products.length} produkt{products.length !== 1 ? "er" : ""}</span>
                </div>
                <FourBlockChart products={products} onProductClick={handleProductClick} />
              </div>
            )}

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Produktpipeline</h2>
              </div>
              <ProductTable products={products} onProductClick={handleProductClick} onDelete={handleDelete} />
            </div>
          </div>
        )}

        {view === "add" && (
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Legg til nytt produkt</h2>
            <ProductForm onSave={handleAdd} onCancel={() => setView("dashboard")} />
          </div>
        )}

        {view === "edit" && selectedProduct && (
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Rediger {selectedProduct.name}</h2>
            <ProductForm product={selectedProduct} onSave={handleUpdate} onCancel={() => setView("detail")} />
          </div>
        )}

        {view === "detail" && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onEdit={() => setView("edit")}
            onBack={() => { setView("dashboard"); setSelectedId(null); }}
          />
        )}
      </main>
    </div>
  );
}
