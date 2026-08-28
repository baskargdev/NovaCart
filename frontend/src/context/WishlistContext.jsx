import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();

  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const { data } = await axiosInstance.get("/wishlist");

      if (data.success) {
        setWishlist(
          (data.wishlist || []).filter((item) => item && item.product),
        );
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.log(error);
      setWishlist([]);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      return toast.warning("Please login to use wishlist.");
    }

    try {
      const { data } = await axiosInstance.post("/wishlist/toggle", {
        productId,
      });

      if (data.success) {
        toast.success(data.message);

        await fetchWishlist();
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update wishlist.",
      );
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) => item?.product?._id?.toString() === productId?.toString(),
    );
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
