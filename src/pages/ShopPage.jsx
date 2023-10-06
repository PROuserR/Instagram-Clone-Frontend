import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { ReactComponent as ListIcon } from "../assets/list.svg";
import { ReactComponent as SearchIcon } from "../assets/search.svg";
import { ReactComponent as PersonIcon } from "../assets/person.svg";
import { ReactComponent as ArrowIcon } from "../assets/arrow-left.svg";
import { useNavigate, useParams } from "react-router-dom";

const ShopPage = () => {
  const searchQuery = useRef("");
  const nav = useNavigate();
  const { shop_name } = useParams();
  const [products, setProducts] = useState([]);

  const search = () => {
    console.log(searchQuery.current.value);
  };

  const getProducts = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/get_products/${shop_name}`
    );
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <section className="px-2 py-3 flex items-center w-full">
        <ArrowIcon
          onClick={() => {
            nav("/my-profile");
          }}
          className="w-7 h-7 mr-4"
        />
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
        <ListIcon className="w-8 h-8 ml-auto" />
      </section>

      <section className="p-2 space-y-2">
        <div className="flex bg-zinc-800 py-1 px-3 rounded-lg">
          <SearchIcon className="text-zinc-500 w-5" />
          <input
            ref={searchQuery}
            onChange={search}
            className="ml-3 text-base outline-none bg-transparent w-3/4"
            placeholder={"Search"}
          />
        </div>
      </section>

      <section className="p-2 grid grid-cols-2 md:grid-cols-4 gap-px overflow-y-scroll pb-14">
        {products.map((product, index) => (
          <div
            key={index}
            onClick={() => nav(`/product/${product.name}`)}
            className="flex flex-col space-y-1"
          >
            <img src={`http://127.0.0.1:8000/media/${product.images[0]}`} />
            <div className="font-semibold">{product.name}</div>
            <div className="text-gray-400">$ {product.price}</div>
          </div>
        ))}
      </section>

      <NavBar />
    </div>
  );
};

export default ShopPage;
