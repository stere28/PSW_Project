const BASE_URL = "http://localhost:9090/API";



export const ApiService = {
    getProducts: async () => {
        const response = await fetch(`${BASE_URL}/products`);
        return response.json();
    },

    getProductPaged: async (page, size) => {
        const response = await fetch(`${BASE_URL}/products/paged?page=${page}&size=${size}`);
        return response.json();
    },

    getProductsByFilter: async (filters) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${BASE_URL}/products/filter?${queryParams}`);
        return response.json();
    },

    addProduct: async (product) => {
        const response = await fetch(`${BASE_URL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
        return response.json();
    },
    updateProduct: async (productId, product) => {
        const response = await fetch(`${BASE_URL}/products/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
        return response.json();
    },
    deleteProduct: async (productId) => {
        const response = await fetch(`${BASE_URL}/products/${productId}`, {
            method: "DELETE",
        });
        return response.json();
    },
};