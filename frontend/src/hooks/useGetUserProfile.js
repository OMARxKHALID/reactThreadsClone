import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";
import { setUserProfile } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const useGetUserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false); 
  const { username } = useParams();
  const showToast = useShowToast();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        dispatch(setUserProfile(null));
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setNotFound(true);
          return;
        }
        dispatch(setUserProfile(data));

      } catch (error) {
        showToast("Error", error.message, "error");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, dispatch, setUserProfile]);

  return { loading, notFound };
};

export default useGetUserProfile;
