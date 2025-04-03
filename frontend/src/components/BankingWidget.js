import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchBankingData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/banking/accounts`);
  return response.data;
};

const BankingWidget = () => {
  const { data, error, isLoading } = useQuery('bankingData', fetchBankingData, {
    refetchInterval: 3600000, // refetch every hour
    enabled: false, // Disable automatic fetching initially
  });

  // Mock data for development until API is connected
  const [mockData] = useState({
    accounts: [
      {
        id: '1',
        name: 'Girokonto',
        balance: 2580.42,
        currency: 'EUR',
        lastUpdate: '2023-04-01T10:30:00Z',
      },
      {
        id: '2',
        name: 'Sparkonto',
        balance: 15000,
        currency: 'EUR',
        lastUpdate: '2023-03-30T14:15:00Z',
      },
    ],
    transactions: [
      {
        id: 't1',
        date: '2023-03-31T08:45:00Z',
        description: 'Lebensmittel Einkauf',
        amount: -58.75,
        currency: 'EUR',
        accountId: '1',
      },
      {
        id: 't2',
        date: '2023-03-30T13:20:00Z',
        description: 'Gehalt März',
        amount: 2800,
        currency: 'EUR',
        accountId: '1',
      },
    ],
  });

  // Use mock data or API data
  const bankingData = data || mockData;

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  if (isLoading) return <CircularProgress />;

  if (error)
    return (
      <Typography color="error">
        Fehler beim Laden der Bankdaten: {error.message}
      </Typography>
    );

  return (
    <Box>
      <Typography variant="h6" component="div" gutterBottom>
        Finanzen
      </Typography>
      
      {/* Accounts Summary */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Kontoübersicht
          </Typography>
          <List dense>
            {bankingData.accounts.map((account) => (
              <ListItem key={account.id} sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={account.name} 
                  secondary={`Stand: ${formatDate(account.lastUpdate)}`} 
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: account.balance >= 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {formatCurrency(account.balance, account.currency)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Letzte Transaktionen
          </Typography>
          <List dense>
            {bankingData.transactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                {index > 0 && <Divider variant="middle" component="li" />}
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={transaction.description} 
                    secondary={formatDate(transaction.date)} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'medium',
                      color: transaction.amount >= 0 ? 'success.main' : 'error.main'
                    }}
                  >
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </Typography>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BankingWidget;