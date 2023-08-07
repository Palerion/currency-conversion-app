import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  font-family: Arial, sans-serif;
  color: #23272a;
  background-color: #f8f8f8;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Converter = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 18px 53px 0px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  margin-left: 20px;
  padding: 5px 10px;
  background-color: #7289da;
  color: #ffffff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5865f2;
  }
`;

const Input = styled.input`
  width: 100px;
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #7289da;
  border-radius: 3px;
  background-color: #e9e9e9;
  color: #23272a;
`;

const Select = styled.select`
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #7289da;
  border-radius: 3px;
  background-color: #e9e9e9;
  color: #23272a;
`;

const ToText = styled.span`
  margin: 0 5px;
  color: #23272a;
  font-weight: bold;
`;

class CurrencyConverter extends Component {
  state = {
    result: null,
    fromCurrency: "USD",
    toCurrency: "EUR",
    amount: 1,
    currencies: [],
  };

  // Initializes the currencies with values from the Foreign exchange rates API
  componentDidMount() {
    axios
      .get("https://api.exchangerate.host/symbols")
      .then((response) => {
        const currencyAr = [];
        for (const key in response.data.symbols) {
          currencyAr[key] = response.data.symbols[key].description;
        }
        this.setState({ currencies: currencyAr });
      })
      .catch((err) => {
        console.log("Opps", err.message);
      });
  }

  // Event handler for the conversion
  convertHandler = () => {
    if (this.state.fromCurrency !== this.state.toCurrency) {
      axios
        .get(
          `https://api.exchangerate.host/convert?from=${this.state.fromCurrency}&to=${this.state.toCurrency}`
        )
        .then((response) => {
          const result = this.state.amount * response.data.info.rate;
          this.setState({ result: result.toFixed(2) });
        })
        .catch((err) => {
          console.log("Opps", err.message);
        });
    } else {
      this.setState({ result: "You can't convert the same currency!" });
    }
  };

  // Updates the states based on the dropdown that was changed
  selectHandler = (event) => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value });
    } else {
      if (event.target.name === "to") {
        this.setState({ toCurrency: event.target.value });
      }
    }
  };

  render() {
    return (
      <Container>
        <Converter>
          <h2>
            <span>Currency </span> Converter{" "}
            <span role="img" aria-label="money">
              &#x1f4b5;
            </span>{" "}
          </h2>
          <div className="From">
            <Input
              name="amount"
              type="text"
              value={this.state.amount}
              onChange={(event) =>
                this.setState({ amount: event.target.value })
              }
            />
            <Select
              name="from"
              onChange={(event) => this.selectHandler(event)}
              value={this.state.fromCurrency}
            >
              {Object.entries(this.state.currencies).map(
                ([currencyCode, currencyName]) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode} ({currencyName})
                  </option>
                )
              )}
            </Select>
            <ToText>to</ToText>
            <Select
              name="to"
              onChange={(event) => this.selectHandler(event)}
              value={this.state.toCurrency}
            >
              {Object.entries(this.state.currencies).map(
                ([currencyCode, currencyName]) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode} ({currencyName})
                  </option>
                )
              )}
            </Select>
            <Button onClick={this.convertHandler}>Convert</Button>
            {this.state.result && (
              <h3>
                {this.state.amount} {this.state.fromCurrency} (
                {this.state.currencies[this.state.fromCurrency]}) is{" "}
                {this.state.result} {this.state.toCurrency} (
                {this.state.currencies[this.state.toCurrency]})
              </h3>
            )}
          </div>
        </Converter>
      </Container>
    );
  }
}

export default CurrencyConverter;
