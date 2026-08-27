import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function PrevArrow({ onClick }) {
  return (
    <button
      className="carousel-arrow carousel-arrow-left"
      onClick={onClick}
      aria-label="Previous"
    >
      ‹
    </button>
  );
}

function NextArrow({ onClick }) {
  return (
    <button
      className="carousel-arrow carousel-arrow-right"
      onClick={onClick}
      aria-label="Next"
    >
      ›
    </button>
  );
}

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="loading-dot"
            style={{ "--i": index }}
          ></span>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections",
      )
      .then((response) => {
        setCollections(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 250,
    cssEase: "linear",
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Router>
      <Nav />

      <main>
        <h1>NFT Collections</h1>

        <div className="collections-container">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Slider {...settings}>
              {collections.map((collection) => (
                <div key={collection.id}>
                  <div className="collection-card">
                    <div className="nft-image-wrapper">
                      <img
                        className="nft-image"
                        src={collection.nftImage}
                        alt={collection.title}
                      />
                    </div>

                    <img
                      className="author-image"
                      src={collection.authorImage}
                      alt="Author"
                    />

                    <h2>{collection.title}</h2>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/author" element={<Author />} />
          <Route path="/item-details" element={<ItemDetails />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
