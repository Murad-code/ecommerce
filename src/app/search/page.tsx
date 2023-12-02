import PaginationBar from "@/components/PaginationBar";
import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/db/prisma";
import { Metadata } from "next";
import React from "react";

interface ISearchPage {
  searchParams: { query: string };
}

export function generateMetadata({
  searchParams: { query },
}: ISearchPage): Metadata {
  return {
    title: `Search: ${query} - Ecommerce`,
  };
}

export default async function SearchPage({
  searchParams: { query },
}: ISearchPage) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: { contains: query, mode: "insensitive" },
          description: { contains: query, mode: "insensitive" },
        },
      ],
    },
    orderBy: { id: "desc" },
  });

  if (products.length === 0) {
    return <div className="text-center">No products found</div>;
  }

  return (
    <>
      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}