import axios from "../../../../../../variables/axiosConfig";

const getFeaturedProducts = async () => {
    const { data } = await axios.get('/api/get-featured-products');
    return data.featured_products;
}

const getFeaturedProduct = async (id) => {
    const { data } = await axios.get(`/api/get-featured-product?id=${id}`);
    return data.featured_product;
}

const createFeaturedProduct = async ({ featuredProduct }) => {
    const { data } = await axios.post('/api/create-featured-product', featuredProduct);
    return data;
}

const updateFeaturedProduct = async ({ featuredProduct }) => {
    const { data } = await axios.post(`/api/update-featured-product`, featuredProduct);
    return data;
}

const deleteFeaturedProduct = async (id) => {
    await axios.delete(`/api/delete-featured-product?id=${id}`);
}

export {
    getFeaturedProduct,
    getFeaturedProducts,
    createFeaturedProduct,
    updateFeaturedProduct,
    deleteFeaturedProduct
}