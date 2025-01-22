import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [transaction, setTransaction] = useState("");
  const [value, setValue] = useState("");
  const [amount, setAmount] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [newAccountName, setNewAccountName] = useState("");

  function handleCreateAccount(e) {
    e.preventDefault();
    if (!newAccountName.trim()) {
      alert("Please enter an account name");
      return;
    }

    if (accounts.some(acc => acc.name === newAccountName)) {
      alert("An account with this name already exists");
      return;
    }

    const newAccount = {
      id: Date.now(),
      name: newAccountName,
      balance: 0
    };

    setAccounts([...accounts, newAccount]);
    setNewAccountName("");
    setCurrentAccount(newAccount);
  }

  function handleTransaction(e) {
    e.preventDefault();
    
    if (!currentAccount) {
      alert("Please select an account first");
      return;
    }

    // Validate transaction type
    if (!transaction) {
      alert("Please select your transaction type");
      return;
    }

    // Validate amount
    const inputAmount = Number(value);
    if (!value || inputAmount <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    const updatedAccounts = accounts.map(acc => {
      if (acc.id === currentAccount.id) {
        let newBalance = acc.balance;
        if (transaction === "Deposit") {
          newBalance += inputAmount;
        } else {
          if (inputAmount > acc.balance) {
            alert("Insufficient Balance. Your current balance is Rs." + acc.balance);
            return acc;
          }
          newBalance -= inputAmount;
        }
        const updatedAcc = { ...acc, balance: newBalance };
        setCurrentAccount(updatedAcc);
        return updatedAcc;
      }
      return acc;
    });

    setAccounts(updatedAccounts);
    setValue("");
  }

  return (
    <div className="bank-container">
      <h1 className="bank-title">Bank Application</h1>

      {/* Create Account Form */}
      <form onSubmit={handleCreateAccount} className="form-container">
        <div className="form-group">
          <label className="form-label">Create New Account:</label>
          <input
            type="text"
            className="form-input"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            placeholder="Enter account name"
          />
        </div>
        <button type="submit" className="submit-button">
          Create Account
        </button>
      </form>

      {/* Account Selection */}
      {accounts.length > 0 && (
        <div className="form-group account-selection">
          <label className="form-label">Select Account:</label>
          <select
            className="form-select"
            value={currentAccount ? currentAccount.id : ""}
            onChange={(e) => setCurrentAccount(accounts.find(acc => acc.id === Number(e.target.value)))}
          >
            <option value="">Select Account</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} - Rs.{acc.balance}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Transaction Form */}
      {currentAccount && (
        <form onSubmit={handleTransaction} className="form-container">
          <div className="form-group">
            <label className="form-label">
              Choose Your Transaction:
            </label>
            <select 
              className="form-select"
              value={transaction} 
              onChange={(e) => setTransaction(e.target.value)}
            >
              <option value="">Select Transaction</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdraw">Withdraw</option>
            </select>
          </div>

          <h3 className="balance-display">
            Current Balance: Rs.{currentAccount.balance.toLocaleString()}
          </h3>

          <div className="form-group">
            <label className="form-label">
              Enter The Amount:
            </label>
            <input 
              type="number" 
              className="form-input"
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              min="0"
            />
          </div>

          <button 
            className="submit-button"
            type="submit"
          >
            Submit Transaction
          </button>
        </form>
      )}
    </div>
  );
};

export default App;
