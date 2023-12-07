"use client"
import { useQuery } from "@tanstack/react-query"
import React, { Fragment,  } from "react"
import Rating from 'react-star-rating-component';
import Link from "next/link";
export interface ResponseType {
    data: {
        limit: number
        products: ProductType[]
        skip: number
        total: number
    }
}
export interface ProductType {
    brand: string
    category: string
    description: string
    discountPercentage: number
    id: number
    images: string[]
    price: number
    rating: number
    stock: number
    thumbnail: string
    title: string
}

async function getProducts() {
    return (await fetch("https://dummyjson.com/products").then((res) =>
        res.json()
    )) as any[]
}
export default function Products() {
    const { data } = useQuery<ResponseType[]>({
        queryKey: ["products"],
        queryFn: () => getProducts(),
    });

    const calculateActualPrice = (price, discount) => Number(price) + Number((price * discount / 100).toFixed(2))

    return (
        <Fragment>
            <div className="px-[16px] font-bold text-lg">Products</div>
            {
                <div className="flex flex-col">
                    {data?.products?.map((product) => (
                        <Link
                            key={product.id}
                            className={"p-[16px] flex"}
                            href={`products/${product.id}`}
                        >
                            <img
                                src={product.thumbnail}
                                  alt={product.name}
                                style={{ width: 180, height: 180 }}
                            />
                            <div className="flex flex-col ml-[12px]">
                                <span className="font-bold text-lg">{product.title}</span>
                                <span className="text-sm">{product.description}</span>
                                <span className="mt-2">
                                    <span className="font-bold text-lg text-red-700">${product.price}</span>
                                    {product.discountPercentage && <span className="mx-2">
                                        <span className="line-through">${calculateActualPrice(product.price, product.discountPercentage)}</span>
                                        <span className="mx-2 text-sm">({product.discountPercentage}%)</span>
                                   </span>}
                                </span>
                                <span className="flex mt-1 ">
                                    <Rating
                                        name="rating"
                                        value={product.rating}
                                        starCount={5}
                                        starColor={'#ffb400'}
                                        emptyStarColor={'#ccc'}
                                    />
                                </span>
                                <span className="flex mt-1">
                                    {product.stock > 0
                                        ? <span className="ml-1 underline text-green-700">In stock</span>
                                        : <span className="ml-1 underline text-red-700">In stock</span>
                                    }
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            }
        </Fragment>
    )
}