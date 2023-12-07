"use client"
import { useQuery } from "@tanstack/react-query"
import React, {Fragment, useState,} from "react"
import Rating from 'react-star-rating-component';
import { usePathname  } from 'next/navigation';

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

async function getProductDetails(value: number) {
    if(value) {
        return (await fetch(`https://dummyjson.com/products/${value}`).then((res) =>
            res.json()
        )) as any[]
    }
}
export default function ProductDetail({ url }) {
    const  pathname = usePathname();
    const { data: product }: { data: ProductType } = useQuery<ResponseType[]>({
        queryKey: ["products"],
        queryFn: () => getProductDetails(pathname?.split('/')?.pop()),
    });
    const [selectedImage, setSelectedImage] = useState('')
    const calculateActualPrice = (price, discount) => Number(price) + Number((price * discount / 100).toFixed(2))
    return (
        <Fragment>
            { product?.id &&
                <div className="flex justify-center gap-5 mt-5">
                    <div className="flex flex-col gap-y-3">
                        {product.images && product.images.map(image =>
                            <span
                                className={`border-2 ${selectedImage === image ? 'border-2 border-blue-500' : ''}`}
                                onClick={() => setSelectedImage(image)}
                            >
                                <img
                                    src={image}
                                    alt={image}
                                    style={{ width: 80, height: 80 }}
                                />
                            </span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <img
                            src={selectedImage || product?.thumbnail}
                            alt={product?.title}
                            style={{width: 520, height: 320}}
                        />
                    </div>
                    <div className="flex flex-col">

                        <div className="flex flex-col ml-[12px]">
                            <span className="font-bold text-lg">{product.title}</span>
                            <span className="text-sm w-[250px]">{product.description}</span>
                            <span className="mt-2">
                                <span className="font-bold text-lg text-red-700">${product.price}</span>
                                { product.discountPercentage && (
                                    <span className="mx-2">
                                    <span className="line-through">${calculateActualPrice(product.price, product.discountPercentage)}</span>
                                    <span className="mx-2 text-sm">({product.discountPercentage}%)</span>
                                    </span>
                                )}
                            </span>
                            <span className="flex mt-1">
                                    <span className="font-bold">Brand:</span>
                                    <span className="ml-1">{product.brand}</span>
                                </span>
                            <span className="flex mt-1 ">
                                    <span className="font-bold">Category:</span>
                                    <span className="ml-1">{product.category}</span>
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
                        <span className="flex mt-1">
                            {product.price > 100 && (
                                <p>
                                    <span className="uppercase">
                                        Free
                                    </span> Delivery by our system
                                </p>
                            )}
                        </span>
                        </div>
                    </div>
                </div>

            }
        </Fragment>
    )
}