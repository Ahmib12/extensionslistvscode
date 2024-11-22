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
    setCurrentPage(selected);
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredExtensions = extensions.filter((extension) =>
    extension.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort extensions alphabetically after filtering
  const sortedExtensions = filteredExtensions.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
  // Slice the sorted and filtered array to get the current page items
  const currentExtensions = filteredExtensions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );


  // ================ output==========
// (68) ['aluisiodeavila.fuedskeps-theme', 'AndrewMcGoveran.react-component-generator', 'aPinix.apinix-theme', 'batisteo.vscode-django', 'bceskavich.theme-dracula-at-night', 'benjaminbenais.copilot-theme', 'Blackboxapp.blackbox', 'burkeholland.simple-react-snippets', 'chris-noring.node-snippets', 'DaltonMenezes.aura-theme', 'daniel-lvovsky.galax-theme', 'danwahlin.angular2-snippets', 'donjayamanne.python-environment-manager', 'donjayamanne.python-extension-pack', 'eamodio.gitlens', 'ecmel.vscode-html-css', 'EQuimper.react-native-react-redux', 'esbenp.prettier-vscode', 'evondev.indent-rainbow-palettes', 'formulahendry.auto-close-tag', 'formulahendry.auto-rename-tag', 'GitHub.copilot', 'GitHub.copilot-chat', 'jundat95.react-native-snippet', 'kevinnorman.jammy-jellyfish-color-theme', 'KevinRose.vsc-python-indent', 'lakshits11.best-themes-redefined', 'lakshits11.neon-city', 'leizongmin.node-module-intellisense', 'miguelsolorio.min-theme', 'mikejk8s.pink-cyan', 'miramac.vscode-exec-node', 'mohd-akram.vscode-html-format', 'moondevaa.moon-violet-dark-plus', 'ms-python.debugpy', 'ms-python.python', 'ms-python.vscode-pylance', 'ms-toolsai.jupyter', 'ms-toolsai.jupyter-keymap', 'ms-toolsai.jupyter-renderers', 'ms-toolsai.vscode-jupyter-cell-tags', 'ms-toolsai.vscode-jupyter-slideshow', 'msjsdiag.vscode-react-native', 'nerudevs.jellyfish-dark', 'NguyenHoangLam.beautiful-dracula', 'njpwerner.autodocstring', 'njqdev.vscode-python-typehint', 'oderwat.indent-rainbow', 'PawelBorkar.jellyfish', 'planbcoding.vscode-react-refactor', 'ritwickdey.LiveServer', 'rodrigovallades.es7-react-js-snippets', 'roerohan.mongo-snippets-for-node-js', 'rvest.vs-code-prettier-eslint', 'shiro.pythonpack', 'sidthesloth.html5-boilerplate', 'stylelint.vscode-stylelint', 'tal7aouy.icons', 'tgreen7.vs-code-node-require', 'VisualStudioExptTeam.intellicode-api-usage-examples', 'VisualStudioExptTeam.vscodeintellicode', 'vscode-icons-team.vscode-icons', 'wholroyd.jinja', 'Wscats.delete-node-modules', 'xabikos.JavaScriptSnippets', 'xabikos.ReactSnippets', 'zhang-renyang.vscode-react', 'Zignd.html-css-class-completion'] '...extensions'

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
                // Extracting the part after the first dot
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
              pageCount={Math.ceil(filteredExtensions.length / itemsPerPage)}
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
