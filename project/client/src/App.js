import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Box, Typography, CircularProgress } from "@mui/material";
import ReactPaginate from "react-paginate";
import "./App.css";

const App = () => {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 12;

  // Fetch and sort extensions on mount
  useEffect(() => {
    axios
      .get("/api/extensions")
      .then((response) => {
// The data should already be sorted by the backend, so we set it directly
        setExtensions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("An error occurred while fetching extensions.");
        setLoading(false);
      });
  }, []);

  // Handle pagination change
  const handlePageChange = ({ selected }) => {
    const maxPage = Math.max(0, Math.ceil(filteredExtensions.length / itemsPerPage) - 1); // Don't allow negative pages
    const validPage = Math.min(selected, maxPage); // Ensure we're not going beyond the last page
    setCurrentPage(validPage);
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0); // Reset page to 0 whenever the search query changes
  };
  
    const filteredExtensions = extensions.filter((extension) =>
    extension.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort extensions alphabetically after filtering
  const sortedExtensions = filteredExtensions.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  // Paginating the sorted list
  const currentExtensions = sortedExtensions.slice(
    currentPage * itemsPerPage,
    Math.min((currentPage + 1) * itemsPerPage, filteredExtensions.length) // Prevent slicing beyond the available list
  );

  // Calculate the number of pages based on the filtered extensions
const pageCount = Math.ceil(filteredExtensions.length / itemsPerPage);

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: 4 }}>
      <div className="container">
        <Typography variant="h3" gutterBottom>
          VS Code Extensions
        </Typography>

        {/* Search Box */}
        <div className="text-field-wrapper">
          <TextField
            label="Search Extensions"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <>
            {/* Extensions Grid */}
            <div className="extension-grid">
              {currentExtensions.map((extension, index) => {
                const extensionNameAfterDot = extension.split(".")[1];

                return (
                  <Box className="extension-item" key={index}>
                    <Typography variant="h6">{extensionNameAfterDot}</Typography>
                  </Box>
                );
              })}
            </div>

            {/* Pagination */}
            <ReactPaginate
              pageCount={pageCount}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              activeClassName="active"
              disabledClassName="disabled"
            />
          </>
        )}
      </div>
    </Box>
  );
};

export default App;
