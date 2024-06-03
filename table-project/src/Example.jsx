import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import axios from "axios";

const Example = () => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZGEyOGY3OTU4NzkxMjM3ZjFhMGVjNDdiOWIwZjdiOSIsInN1YiI6IjY1ZTI2ZTY0NDFhNTYxMDE2MzgzNjFkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YDvypbDVCGeALh3rx1d_oe4p4N0FPYqqed8sDm6LGVU",
            },
            params: {
              api_key: "4da28f7958791237f1a0ec47b9b0f7b9",
              page: pagination.pageIndex + 1,
              pageSize: pagination.pageSize,
            },
          }
        );
        const mappedData = response.data.results.map((movie) => ({
          title: movie.title,
          releaseDate: movie.release_date,
          overview: movie.overview,
          popularity: movie.popularity,
          voteAverage: movie.vote_average,
        }));
        setData(mappedData);
        setRowCount(response.data.total_results);
      } catch (error) {
        setIsError(true);
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    };
    fetchData();
  }, [pagination]);

  const columns = useMemo(
    () => [
      { accessorKey: "title", header: "Title" },
      { accessorKey: "releaseDate", header: "Release Date" },
      { accessorKey: "overview", header: "Overview" },
      { accessorKey: "popularity", header: "Popularity" },
      { accessorKey: "voteAverage", header: "Vote Average" },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    manualPagination: true,
    rowCount,
    state: {
      pagination,
      isLoading,
    },
    onPaginationChange: setPagination,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
