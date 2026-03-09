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
  const normalizedQuery = query.trim();

  try {
    const { data } = await axios.get<ProductsResponse>('https://dummyjson.com/products/search', {
      params: {
        limit,
        q: normalizedQuery,
      },
      timeout: 10000,
    });

    return data.products;
  } catch (error) {
    if (!normalizedQuery) {
      const { data } = await axios.get<ProductsResponse>('https://dummyjson.com/products', {
        params: { limit },
        timeout: 10000,
      });

      return data.products;
    }

    throw error;
  }
};
