import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { useQuery } from 'react-query';
import { getAccounts, getTransactions } from '../services/bankingService';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Banking = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openConnectionDialog, setOpenConnectionDialog] = useState(false);
  const [connectionFormData, setConnectionFormData] = useState({
    bankName: '',
    username: '',
    password: ''
  });

  // Konten abrufen
  const { 
    data: accountsData, 
    error: accountsError, 
    isLoading: isAccountsLoading 
  } = useQuery('accounts', getAccounts, {
    enabled: false, // Nicht automatisch abfragen - wir verwenden Mock-Daten
  });

  // Mock-Daten für Konten
  const mockAccountsData = {
    accounts: [
      {
        id: '1',
        name: 'Girokonto',
        balance: 2580.42,
        currency: 'EUR',
        iban: 'DE89 3704 0044 0532 0130 00',
        bic: 'COBADEFFXXX',
        bank: 'Example Bank',
        lastUpdate: '2023-04-01T10:30:00Z',
      },
      {
        id: '2',
        name: 'Sparkonto',
        balance: 15000,
        currency: 'EUR',
        iban: 'DE89 3704 0044 0532 0130 01',
        bic: 'COBADEFFXXX',
        bank: 'Example Bank',
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
        category: 'Lebensmittel'
      },
      {
        id: 't2',
        date: '2023-03-30T13:20:00Z',
        description: 'Gehalt März',
        amount: 2800,
        currency: 'EUR',
        accountId: '1',
        category: 'Einkommen'
      },
      {
        id: 't3',
        date: '2023-03-29T09:15:00Z',
        description: 'Miete April',
        amount: -950,
        currency: 'EUR',
        accountId: '1',
        category: 'Wohnen'
      },
      {
        id: 't4',
        date: '2023-03-28T15:30:00Z',
        description: 'Stromrechnung',
        amount: -65.40,
        currency: 'EUR',
        accountId: '1',
        category: 'Versorgung'
      },
      {
        id: 't5',
        date: '2023-03-27T11:45:00Z',
        description: 'Benzin',
        amount: -45.50,
        currency: 'EUR',
        accountId: '1',
        category: 'Transport'
      },
    ]
  };

  // Mock-Daten für Ausgabenkategorien
  const mockExpenseCategories = [
    { name: 'Lebensmittel', value: 350.25 },
    { name: 'Wohnen', value: 950 },
    { name: 'Transport', value: 120.75 },
    { name: 'Unterhaltung', value: 85.5 },
    { name: 'Versorgung', value: 65.40 },
  ];

  // Mock-Daten für Einkommenskategorien
  const mockIncomeCategories = [
    { name: 'Gehalt', value: 2800 },
    { name: 'Zinsen', value: 12.5 }
  ];

  // Mock-Daten für Kontostand-Verlauf
  const mockBalanceHistory = [
    { date: '01-03', balance: 2250 },
    { date: '05-03', balance: 2100 },
    { date: '10-03', balance: 1950 },
    { date: '15-03', balance: 1820 },
    { date: '20-03', balance: 1680 },
    { date: '25-03', balance: 1550 },
    { date: '30-03', balance: 2580.42 }
  ];

  // Tatsächliche oder Mock-Daten verwenden
  const bankingData = accountsData || mockAccountsData;

  // Währungsformat
  const formatCurrency = (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Datum formatieren
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account.id === selectedAccount ? null : account.id);
  };

  const handleOpenConnectionDialog = () => {
    setOpenConnectionDialog(true);
  };

  const handleCloseConnectionDialog = () => {
    setOpenConnectionDialog(false);
  };

  const handleConnectionFormChange = (e) => {
    setConnectionFormData({
      ...connectionFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleConnectionSubmit = () => {
    console.log('Banking connection data:', connectionFormData);
    // Hier würde die API-Anfrage zum Hinzufügen der Bankverbindung erfolgen
    handleCloseConnectionDialog();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="div">
          Finanzen
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenConnectionDialog}
        >
          Bankverbindung hinzufügen
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<AccountBalanceIcon />} label="Konten" />
          <Tab icon={<ReceiptIcon />} label="Transaktionen" />
          <Tab icon={<TrendingUpIcon />} label="Analyse" />
          <Tab icon={<SettingsIcon />} label="Einstellungen" />
        </Tabs>
      </Paper>

      {/* Konten Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {bankingData.accounts.map((account) => (
            <Grid item xs={12} md={6} key={account.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedAccount === account.id ? '2px solid #1976d2' : 'none'
                }}
                onClick={() => handleAccountSelect(account)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>{account.name}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {account.bank}
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    {formatCurrency(account.balance, account.currency)}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">IBAN</Typography>
                      <Typography variant="body1">{account.iban}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">BIC</Typography>
                      <Typography variant="body1">{account.bic}</Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Letztes Update: {formatDate(account.lastUpdate)}
                    </Typography>
                    {selectedAccount === account.id && (
                      <Button variant="outlined" size="small">Details</Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Transaktionen Tab */}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Datum</TableCell>
                <TableCell>Beschreibung</TableCell>
                <TableCell>Kategorie</TableCell>
                <TableCell align="right">Betrag</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankingData.transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.category} 
                      size="small" 
                      color={transaction.amount >= 0 ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: transaction.amount >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'medium'
                    }}
                  >
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Analyse Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {/* Kontostandverlauf */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Kontostandverlauf</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockBalanceHistory}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), "Kontostand"]} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        stroke="#1976d2" 
                        activeDot={{ r: 8 }} 
                        name="Kontostand"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Ausgabenkategorien */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Ausgaben nach Kategorie</Typography>
                <Box sx={{ mt: 2 }}>
                  {mockExpenseCategories.map((category, index) => (
                    <Box key={category.name} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{category.name}</Typography>
                        <Typography variant="body2">
                          {formatCurrency(category.value)}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: 1,
                          height: 8,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            backgroundColor: `hsl(${index * 30}, 70%, 50%)`,
                            width: `${(category.value / mockExpenseCategories[0].value) * 100}%`
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Einkommenskategorien */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Einkommen nach Kategorie</Typography>
                <Box sx={{ mt: 2 }}>
                  {mockIncomeCategories.map((category, index) => (
                    <Box key={category.name} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{category.name}</Typography>
                        <Typography variant="body2">
                          {formatCurrency(category.value)}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: 1,
                          height: 8,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            backgroundColor: `hsl(${120 + index * 30}, 70%, 50%)`,
                            width: `${(category.value / mockIncomeCategories[0].value) * 100}%`
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Einstellungen Tab */}
      {tabValue === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Banking-Einstellungen</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Aktualisierungsintervall (Minuten)"
                  type="number"
                  defaultValue={60}
                  InputProps={{ inputProps: { min: 15, max: 1440 } }}
                  helperText="Wie oft sollen die Bankdaten aktualisiert werden?"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Verbundene Bankkonten</Typography>
                {bankingData.accounts.map((account) => (
                  <Box 
                    key={account.id} 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <Box>
                      <Typography variant="body1">{account.bank}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.name} • {account.iban}
                      </Typography>
                    </Box>
                    <Button color="error" size="small">Trennen</Button>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button variant="contained" color="primary">
                  Einstellungen speichern
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Dialog zum Hinzufügen einer Bankverbindung */}
      <Dialog open={openConnectionDialog} onClose={handleCloseConnectionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Bankverbindung hinzufügen</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Hinweis: In einer realen Anwendung würde hier eine sichere Anbindung
            an eine Banking-API erfolgen. Dies ist nur ein Beispiel.
          </Alert>
          
          <TextField
            margin="dense"
            name="bankName"
            label="Bankname"
            type="text"
            fullWidth
            value={connectionFormData.bankName}
            onChange={handleConnectionFormChange}
          />
          <TextField
            margin="dense"
            name="username"
            label="Benutzername / Kontonummer"
            type="text"
            fullWidth
            value={connectionFormData.username}
            onChange={handleConnectionFormChange}
          />
          <TextField
            margin="dense"
            name="password"
            label="Passwort / PIN"
            type="password"
            fullWidth
            value={connectionFormData.password}
            onChange={handleConnectionFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConnectionDialog}>Abbrechen</Button>
          <Button onClick={handleConnectionSubmit} variant="contained">Verbinden</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Banking;