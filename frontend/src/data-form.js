import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Chip,
} from '@mui/material';
import axios from 'axios';

const endpointMapping = {
    'Notion': 'notion',
    'Airtable': 'airtable',
    'Hubspot': 'hubspot',
};

// Helper function to colorize different data types
const getValueColor = (value) => {
    if (value === null) return '#808080'; // gray for null
    switch (typeof value) {
        case 'number': return '#0000ff'; // blue for numbers
        case 'boolean': return '#008000'; // green for booleans
        case 'string': return '#a31515'; // red for strings
        default: return '#000000'; // black for objects/arrays
    }
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

    // Enhanced function to render JSON with syntax highlighting
    const renderJsonValue = (value, indent = 0) => {
        if (value === null) return <span style={{ color: getValueColor(value) }}>null</span>;

        if (Array.isArray(value)) {
            if (value.length === 0) return <span>[]</span>;

            return (
                <div style={{ marginLeft: indent > 0 ? 20 : 0 }}>
                    <span>[</span>
                    <div style={{ marginLeft: 20 }}>
                        {value.map((item, index) => (
                            <div key={index}>
                                {renderJsonValue(item, indent + 1)}
                                {index < value.length - 1 && <span>,</span>}
                            </div>
                        ))}
                    </div>
                    <span>]</span>
                </div>
            );
        }

        if (typeof value === 'object') {
            const entries = Object.entries(value);
            if (entries.length === 0) return <span>{'{}'}</span>;

            return (
                <div style={{ marginLeft: indent > 0 ? 20 : 0 }}>
                    <span>{'{'}</span>
                    <div style={{ marginLeft: 20 }}>
                        {entries.map(([key, val], index) => (
                            <div key={key}>
                                <span style={{ color: '#881391', fontWeight: 'bold' }}>{`"${key}"`}</span>
                                <span>{': '}</span>
                                {renderJsonValue(val, indent + 1)}
                                {index < entries.length - 1 && <span>,</span>}
                            </div>
                        ))}
                    </div>
                    <span>{'}'}</span>
                </div>
            );
        }

        if (typeof value === 'string') {
            return <span style={{ color: getValueColor(value) }}>{`"${value}"`}</span>;
        }

        return <span style={{ color: getValueColor(value) }}>{String(value)}</span>;
    };

    // Function to render the data in a more readable format
    const renderData = () => {
        if (!loadedData) return null;

        try {
            return (
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        mt: 2,
                        maxHeight: '400px',
                        overflow: 'auto',
                        backgroundColor: '#f8f8f8',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" color="primary">
                            {integrationType} Data
                        </Typography>
                        <Chip
                            size="small"
                            label={Array.isArray(loadedData) ? `${loadedData.length} items` : 'Object'}
                            color="primary"
                            variant="outlined"
                        />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        {renderJsonValue(loadedData)}
                    </Box>
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