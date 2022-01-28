import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { REST_URL } from "../../../utils/urls";
import axios from "axios";
import LoadResults from "./LoadResults";
import LoadingComponent from "../../UtilityComponents/LoadingComponent";

const ViewUser = () => {
  const { school, role } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [found, setFound] = useState();

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let url = `${REST_URL.SEARCH_IN_SPECIFIC_SCHOOL}${school}/${search}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.length === 0) setFound(false);
        else {
          setSearchResult(res.data);
          setFound(true);
        }
        setIsLoading(false);
      })
      .catch((err) => setFound(false));
  };

  useEffect(() => {
    if (role === null) return;
    else if (role === "STUDENT") return navigate("/access_denied");
    else document.title = "View Student / Teacher";
  }, [navigate, role]);

  if (isLoading) return <LoadingComponent />;

  return (
    <div className='container my-3'>
      <div className='text-center'>
        <form onSubmit={handleSearch}>
          <input
            className='bg-black border border-secondary rounded text-white p-2 w-50'
            name='search'
            type='search'
            placeholder='Search by name or username or admission no'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </form>
      </div>
      {found === false ? (
        <div className='text-center mt-3'>
          <p className='styledFont2 text-revert'>No student or teacher found</p>
        </div>
      ) : (
        <LoadResults searchResult={searchResult} role={role} />
      )}
    </div>
  );
};

export default ViewUser;
