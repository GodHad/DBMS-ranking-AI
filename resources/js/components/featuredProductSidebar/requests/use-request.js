import axios from '../../../variables/axiosConfig';

const getFeaturedProducts = async () => {
    const { data } = await axios.get('/api/get-featured-products?published=1');
    return data.featured_products;
}

export {
    getFeaturedProducts
}