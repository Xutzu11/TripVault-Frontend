import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import socketIOClient from 'socket.io-client';
import config from './config.json';
import { FormControl, InputLabel, MenuItem, Select, Typography, Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const RevenueChart = () => {
  const nav = useNavigate();

  const [museums, setMuseums] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [data, setData] = useState([['a', 'b'], ['x', 1]]);
  const [options, setOptions] = useState({});
  const socket = socketIOClient(`${config.SERVER_URL}`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          nav('/');
          return;
        }

        await axios.get(`${config.SERVER_URL}/api/access/user`, {
          headers: {
            Authorization: token,
          },
        });
      } catch (error) {
        nav('/');
      }
    };

    fetchData();
  }, [nav]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${config.SERVER_URL}/api/countries`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setCountries(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    socket.on('museumsChange', (museums) => {
      setMuseums(museums);
    });

    return () => {
      socket.off('museumsChange');
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${config.SERVER_URL}/api/museums`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        setMuseums(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const filteredMuseums = selectedCountry
      ? museums.filter((museum) => museum.country === selectedCountry)
      : museums;

    // Sort the museums by revenue in descending order
    const sortedMuseums = filteredMuseums.sort((a, b) => b.revenue - a.revenue);

    const limit = sortedMuseums.length > 10 ? 10 : sortedMuseums.length;
    // Get the top 10 museums
    const topMuseums = sortedMuseums.slice(0, limit);

    // Calculate the total revenue for the "Others" category
    const othersRevenue = sortedMuseums.slice(limit).reduce((acc, museum) => acc + museum.revenue, 0);

    const msm = topMuseums.map((museum) => [museum.name, museum.revenue]);
    if (othersRevenue > 0) {
      msm.push(['Others', othersRevenue]);
    }    
    const labels = ['Museums', 'Revenue'];
    setData([labels, ...msm]);
    setOptions({
      title: "Revenue chart",
      is3D: true,
      width: '100%',
      height: '100vh', // Adjusted height
      backgroundColor: 'none',
      legendTextStyle: { color: '#E3E3E3' },
      titleTextStyle: { color: '#E3E3E3' },
    });
  }, [museums, selectedCountry]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <Box sx={{ 
        padding: 2,
        background: 'linear-gradient(to right bottom, #1f1f1f, #282828, #2f2f2f, #343434, #404040)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Country</InputLabel>
          <Select 
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e)}>
            <MenuItem value="">
              <em>All Countries</em>
            </MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.id} value={country.name}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {data.length > 1 ? (
          <Chart chartType="PieChart" data={data} options={options} />
        ) : (
          <Typography variant="h6" color="textSecondary">
            No museums found.
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default RevenueChart;
