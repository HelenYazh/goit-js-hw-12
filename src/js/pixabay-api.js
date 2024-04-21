import axios from 'axios';
axios.defaults.baseURL = "https://pixabay.com/api/";


export async function fetchImages(query, page = 1) {
    const API_KEY = "43383270-573d9e698d4e4b734db4ac29f";
    const params = new URLSearchParams({
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page,
        per_page: 15,
    });


    try {
        const response = await axios.get("", { params })
        return response.data;
    } catch (error) {
        console.log(error);
    }
}