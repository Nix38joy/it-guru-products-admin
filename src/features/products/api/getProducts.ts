import axios from 'axios';

export interface ProductItem {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  sku?: string;
  category: string;
  stock: number;
}

interface ProductsResponse {
  products: ProductItem[];
}

export const getProducts = async (): Promise<ProductItem[]> => {
  const { data } = await axios.get<ProductsResponse>('https://dummyjson.com/products', {
    params: {
      limit: 30,
    },
  });

  return data.products;
};
