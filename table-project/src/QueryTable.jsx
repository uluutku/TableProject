import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query"; //note: this is TanStack React Query V5
import axios from "axios";

const QueryTable = () => {
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  //fetch data from TMDB API
  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "table-data",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
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
      return {
        data: response.data.results.map((movie) => ({
          title: movie.title,
          releaseDate: movie.release_date,
          overview: movie.overview,
          popularity: movie.popularity,
          voteAverage: movie.vote_average,
        })),
        meta: { totalRowCount: response.data.total_results },
      };
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

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
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const QueryTableWithReactQueryProvider = () => (
  <QueryClientProvider client={queryClient}>
    <QueryTable />
  </QueryClientProvider>
);

export default QueryTableWithReactQueryProvider;
