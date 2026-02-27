"use client";

import { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) return [];
  return res.json();
}

export async function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function seedExampleData(): Promise<void> {
  await fetch("/api/products/seed", { method: "POST" });
}
