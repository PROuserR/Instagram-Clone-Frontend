import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as DotsIcon } from "../assets/dots.svg";
import { ReactComponent as PersonIcon } from "../assets/person.svg";
import { ReactComponent as ArrowIcon } from "../assets/arrow-left.svg";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import { ReactComponent as SaveIcon } from "../assets/bookmark.svg";
import { loadStripe } from "@stripe/stripe-js";
import ProductSlider from "../components/ProductSlider";

const ProductPage = () => {
  const stripePromise = loadStripe(
    "pk_test_51LizYGFynob1u1uW9MQTkCj5jgQ02IzerKXwuIjRwJKAJIEq98y5c93ou8IM3v03xP0eE5aDgANkkJ4KW5KLG0z500XbAyiulS"
  );
  const { product_name } = useParams();
  const nav = useNavigate();
  const [product, setProduct] = useState();

  const getProduct = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/get_product/${product_name}`
    );
    const data = await res.json();
    setProduct(data);
  };

  const makeCheckoutSession = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/create_stripe_checkout_session/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product?.id }),
      }
    );
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div>
      <section className="px-2 py-3 flex items-center w-full">
        <ArrowIcon onClick={() => nav(-1)} className="w-7 h-7 mr-4" />
        {localStorage.getItem("my_profile_picture") ? (
          <img
            className="w-8 h-8 rounded-full"
            src={
              !localStorage
                .getItem("my_profile_picture")
                .includes("platform-lookaside")
                ? `http://127.0.0.1:8000/media/${localStorage.getItem(
                    "my_profile_picture"
                  )}`
                : localStorage.getItem("my_profile_picture")
            }
          />
        ) : (
          <div className="w-auto h-auto bg-gray-400 rounded-full p-3.5">
            <PersonIcon />
          </div>
        )}
        <span className="ml-2">{localStorage.getItem("my_username")}</span>
        <DotsIcon className=" ml-auto" />
      </section>

      <div className="flex flex-col space-y-4">
        <ProductSlider images={product ? product.images : []} />
        <div className="w-full p-2 space-y-1">
          <div className="flex w-full">
            <div className="font-bold text-base">{product?.name}</div>
            <div className="flex space-x-2 ml-auto">
              <SendIcon className="w-6 h-6" />
              <SaveIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-lg">$ {product?.price}</div>
        </div>

        <div className="p-2">
          <button
            onClick={makeCheckoutSession}
            className="w-full bg-blue-500 p-2 rounded-lg"
          >
            Buy
          </button>
        </div>

        <div className="p-2 space-y-2">
          <span className="text-base font-bold">Description</span>
          <p className="text-gray-400">{product?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
