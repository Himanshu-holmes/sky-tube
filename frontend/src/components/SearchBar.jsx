import { Search } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "./Input";

const SearchBar = () => {
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const search = (data) => {
    const query = data?.query;

    navigate(`/search/${query}`);
  };

  return (
    <>
      {/* <div className="relative mx-auto hidden w-full max-w-md overflow-hidden sm:block">
        <input
          className="w-full border bg-transparent py-1 pl-8 pr-3 placeholder-white outline-none sm:py-2"
          placeholder="Search"
        />
        <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2">
          <Search width={16} height={16} />
        </span>
      </div> */}
      <form
        onSubmit={handleSubmit(search)}
        className="relative mx-auto hidden w-full max-w-md overflow-hidden sm:block"
      >
        <input
          className="w-full border bg-transparent py-1 pl-8 pr-3  outline-none sm:py-2"
          placeholder="Search"
          {...register("query", { required: true })}
        />
        <span className="absolute right-2.5 top-1/2 inline-block -translate-y-1/2">
          <Search width={16} height={16} />
        </span>
      </form>
    </>
  );
};

export default SearchBar;
