import { useMemo, useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
} from "@mui/material";
import { AccountCircle, Send } from "@mui/icons-material";
import axios from "axios";

const Example = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
              Authorization: "Bearer YOUR_ACCESS_TOKEN",
            },
            params: {
              api_key: "YOUR_API_KEY",
              page: pagination.pageIndex + 1,
              pageSize: pagination.pageSize,
            },
          }
        );
        const mappedData = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          releaseDate: movie.release_date,
          overview: movie.overview,
          popularity: movie.popularity,
          voteAverage: movie.vote_average,
          posterPath: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
        }));
        setData(mappedData);
        setRowCount(response.data.total_results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pagination]);

  const columns = useMemo(
    () => [
      {
        id: "movie",
        header: "Movie",
        columns: [
          {
            accessorFn: (row) => row.title,
            id: "title",
            header: "Title",
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img
                  alt="poster"
                  height={30}
                  src={row.original.posterPath}
                  loading="lazy"
                  style={{ borderRadius: "5%" }}
                />
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "releaseDate",
            header: "Release Date",
            size: 150,
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
          },
          {
            accessorKey: "overview",
            header: "Overview",
            size: 300,
          },
          {
            accessorKey: "popularity",
            header: "Popularity",
            size: 100,
            Cell: ({ cell }) => cell.getValue().toFixed(2),
          },
          {
            accessorKey: "voteAverage",
            header: "Vote Average",
            size: 100,
            Cell: ({ cell }) => cell.getValue().toFixed(1),
          },
        ],
      },
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
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-around",
          left: "30px",
          maxWidth: "1000px",
          position: "sticky",
          width: "100%",
        }}
      >
        <img
          alt="poster"
          height={200}
          src={row.original.posterPath}
          loading="lazy"
          style={{ borderRadius: "5%" }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4">Overview:</Typography>
          <Typography variant="body1">{row.original.overview}</Typography>
        </Box>
      </Box>
    ),
    renderRowActionMenuItems: ({ closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          // View details logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        View Details
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          // Share logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Send />
        </ListItemIcon>
        Share
      </MenuItem>,
    ],
    renderTopToolbar: ({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("deactivating " + row.getValue("title"));
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("activating " + row.getValue("title"));
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("contact " + row.getValue("title"));
        });
      };

      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between",
          })}
        >
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="error"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleDeactivate}
                variant="contained"
              >
                Deactivate
              </Button>
              <Button
                color="success"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleActivate}
                variant="contained"
              >
                Activate
              </Button>
              <Button
                color="info"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleContact}
                variant="contained"
              >
                Contact
              </Button>
            </Box>
          </Box>
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

// Date Picker Imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const ExampleWithLocalizationProvider = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example />
  </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;
