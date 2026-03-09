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

interface GetProductsParams {
  query?: string;
  limit?: number;
}

export const getProducts = async (params: GetProductsParams = {}): Promise<ProductItem[]> => {
  const { query = '', limit = 50 } = params;
  const endpoint = query.trim()
    ? 'https://dummyjson.com/products/search'
    : 'https://dummyjson.com/products';

  const { data } = await axios.get<ProductsResponse>(endpoint, {
    params: {
      limit,
      ...(query.trim() ? { q: query.trim() } : {}),
    },
  });

  return data.products;
};
