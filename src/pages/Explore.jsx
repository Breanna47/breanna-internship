import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function getExploreTimeLeft(expiryDate) {
  const difference = Number(expiryDate) - Date.now();

  if (!expiryDate || difference <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60),
    ),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

function Countdown({ expiryDate }) {
  const [timeLeft, setTimeLeft] = useState(() =>
    getExploreTimeLeft(expiryDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getExploreTimeLeft(expiryDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <div className="de_countdown">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
}

function ExploreSkeletonCard({ index }) {
  return (
    <div className="explore-card" key={index}>
      <div className="nft__item explore-skeleton-card">
        <div className="author_list_pp">
          <div className="explore-skeleton-avatar"></div>
        </div>

        <div className="explore-skeleton-countdown"></div>

        <div className="nft__item_wrap">
          <div className="explore-skeleton-image"></div>
        </div>

        <div className="nft__item_info">
          <div className="explore-skeleton-title"></div>

          <div className="explore-skeleton-bottom">
            <div className="explore-skeleton-price"></div>
            <div className="explore-skeleton-likes"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [visibleItems, setVisibleItems] = useState(8);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore",
      )
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Explore API error:", error);
      })
    .finally(() => {
  setTimeout(() => {
    setLoading(false);
  }, 1500);
});
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [items]);

  const sortedItems = useMemo(() => {
    const sorted = [...items];

    if (sortBy === "price_low_to_high") {
      sorted.sort(
        (a, b) => Number(a.price) - Number(b.price),
      );
    }

    if (sortBy === "price_high_to_low") {
      sorted.sort(
        (a, b) => Number(b.price) - Number(a.price),
      );
    }

    if (sortBy === "likes_high_to_low") {
      sorted.sort(
        (a, b) => Number(b.likes) - Number(a.likes),
      );
    }

    return sorted;
  }, [items, sortBy]);

  const handleLoadMore = () => {
    setVisibleItems((previous) => previous + 4);

    setTimeout(() => {
      AOS.refresh();
    }, 0);
  };

  return (
    <>
      <section
        className="explore-banner"
        data-aos="fade-up"
      >
        <div className="explore-banner-bubbles"></div>
        <h1>Explore</h1>
      </section>

      <div
        className="explore-filter"
        data-aos="fade-up"
      >
        <select
          id="filter-items"
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value)
          }
          disabled={loading}
        >
          <option value="">Default</option>

          <option value="price_low_to_high">
            Price, Low to High
          </option>

          <option value="price_high_to_low">
            Price, High to Low
          </option>

          <option value="likes_high_to_low">
            Most liked
          </option>
        </select>
      </div>

      <div className="explore-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <ExploreSkeletonCard
                key={index}
                index={index}
              />
            ))
          : sortedItems
              .slice(0, visibleItems)
              .map((item) => (
                <div
                  key={item.id}
                  className="explore-card"
                  data-aos="fade-up"
                >
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <Link
                        to={`/author/${item.authorId}`}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                      >
                        <img
                          className="lazy"
                          src={item.authorImage}
                          alt="Author"
                        />

                        <i className="fa fa-check"></i>
                      </Link>
                    </div>

                    <Countdown
                      expiryDate={item.expiryDate}
                    />

                    <div className="nft__item_wrap">
                      <div className="nft__item_extra">
                        <div className="nft__item_buttons">
                          <button type="button">
                            Buy Now
                          </button>

                          <div className="nft__item_share">
                            <h4>Share</h4>

                            <a
                              href="/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <i className="fa fa-facebook fa-lg"></i>
                            </a>

                            <a
                              href="/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <i className="fa fa-twitter fa-lg"></i>
                            </a>

                            <a href="/">
                              <i className="fa fa-envelope fa-lg"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/item-details/${item.nftId}`}
                      >
                        <img
                          src={item.nftImage}
                          className="lazy nft__item_preview"
                          alt={item.title}
                        />
                      </Link>
                    </div>

                    <div className="nft__item_info">
                      <Link
                        to={`/item-details/${item.nftId}`}
                      >
                        <h4>{item.title}</h4>
                      </Link>

                      <div className="nft__item_price">
                        {item.price} ETH
                      </div>

                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
      </div>

      {!loading &&
        visibleItems < sortedItems.length && (
          <div
            className="explore-load-more"
            data-aos="fade-up"
          >
            <button
              id="loadmore"
              className="btn-main lead"
              type="button"
              onClick={handleLoadMore}
            >
              Load more
            </button>
          </div>
        )}
    </>
  );
};

export default ExploreItems;