import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages } from "../src/js/pixabay-api.js";
import { createMarkup, clearGallery } from "../src/js/render-functions.js";


const form = document.querySelector(".search-form");
const input = document.querySelector("#search-input");
const loader = document.querySelector(".loader");
const loadBtn = document.querySelector(".load-more-btn");
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});


loader.style.display = "none";
loadBtn.style.display = "none";


form.addEventListener("submit", handleSubmit);
loadBtn.addEventListener("click", handleClick);
let page = 1;

async function handleSubmit(event) {
    event.preventDefault();

    if (input.value.trim() === "") {
        return;
    }

    loader.style.display = "block";
    clearGallery();

    page = 1;

    try {
        const response = await fetchImages(input.value.trim(), page);

        if (response.hits.length === 0) {
            iziToast.error({
                message: "Sorry, there are no images matching your search query. Please try again!",
                position: "topRight",
            })
        };

        createMarkup(response.hits);
        if (response.totalHits > 15) {
            loadBtn.style.display = "block";
        } else {
            loadBtn.style.display = "none";
        }
        lightbox.refresh();
    } catch (error) {
        console.log(error);
    } finally {
        loader.style.display = "none";
    }
}


async function handleClick() {
    page += 1;

    try {
        loader.style.display = "block";
        const response = await fetchImages(input.value.trim(), page);
        createMarkup(response.hits);
        lightbox.refresh();

        const card = document.querySelector(".gallery-item");

        if (card) {
            const cardHeight = card.getBoundingClientRect().height;

            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth"
            });
        }

        const lastPage = Math.ceil(response.totalHits / 15);
        if (lastPage === page) {
            loadBtn.style.display = "none";
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results",
                position: "topRight",
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        loader.style.display = "none";
    }
}