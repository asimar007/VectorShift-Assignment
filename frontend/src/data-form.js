import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import axios from 'axios';

const endpointMapping = {
    'Notion': 'notion',
    'Airtable': 'airtable',
};

export const DataForm = ({ integrationType, credentials }) => {
    const [loadedData, setLoadedData] = useState(null);
    const endpoint = endpointMapping[integrationType];

    const handleLoad = async () => {
        try {
            const formData = new FormData();
            formData.append('credentials', JSON.stringify(credentials));
            const response = await axios.post(`http://localhost:8000/integrations/${endpoint}/load`, formData);
            const data = response.data;
            setLoadedData(data);
        } catch (e) {
            alert(e?.response?.data?.detail);
        }
    }

    // Function to render the data in a more readable format
    const renderData = () => {
        if (!loadedData) return null;

        try {
            // Format the JSON with indentation for better readability
            const formattedData = JSON.stringify(loadedData, null, 2);
            return (
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        mt: 2,
                        maxHeight: '400px',
                        overflow: 'auto',
                        backgroundColor: '#f5f5f5'
                    }}
                >
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {formattedData}
                    </pre>
                </Paper>
            );
        } catch (e) {
            return <Typography color="error">Error displaying data: {e.message}</Typography>;
        }
    };

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' width='100%'>
            <Box display='flex' flexDirection='column' width='100%'>
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Integration Data
                </Typography>

                {renderData()}

                <Button
                    onClick={handleLoad}
                    sx={{ mt: 2 }}
                    variant='contained'
                >
                    Load Data
                </Button>
                <Button
                    onClick={() => setLoadedData(null)}
                    sx={{ mt: 1 }}
                    variant='contained'
                    color="secondary"
                    disabled={!loadedData}
                >
                    Clear Data
                </Button>
            </Box>
        </Box>
    );
}
