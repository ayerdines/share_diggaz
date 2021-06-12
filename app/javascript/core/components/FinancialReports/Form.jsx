import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row,} from "reactstrap";
import apiCall from "../../helpers/apiCall";

const quarters = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
  {
    label: '4',
    value: 4,
  },
]

const initialStates = {
  symbol: 'API',
  year: '',
  quarter: 1,
  netProfit: '',
  netInterestIncome: '',
  distributableProfit: '',
  sharesOutstanding: '',
  bookValue: '',
  eps: '',
  roe: ''
}

export default function FinancialReportForm({ match, history }) {
  const [yearOptions, setYearOptions] = useState([])
  const [inputs, setInputs] = useState(initialStates);
  const [symbolOptions, setSymbolOptions] = useState([]);

  useEffect(() => {
    if (match.params.id) {
      apiCall.fetchEntities(`/financial_reports/${match.params.id}`)
        .then((response) => {
          const { attributes } = response.data.data;
          const inputData = {
            symbol: attributes.symbol || '',
            year: attributes.year || '',
            quarter: attributes.quarter || 1,
            netProfit: attributes.net_profit || '',
            netInterestIncome: attributes.net_interest_income || '',
            distributableProfit: attributes.distributable_profit || '',
            sharesOutstanding: attributes.shares_outstanding || '',
            bookValue: attributes.book_value || '',
            eps: attributes.eps || '',
            roe: attributes.roe || '',
          }
          setInputs(inputData);
        })
    }
    fetchSymbolOptions();
    fetchYearOptions();
  }, [])

  const fetchSymbolOptions = () => {
    apiCall.fetchEntities('/companies/symbols.json')
      .then((response) => {
        setSymbolOptions(response.data);
      })
  };

  const fetchYearOptions = () => {
    apiCall.fetchEntities('/financial_reports/years_options.json')
      .then((response) => {
        setYearOptions(response.data);
      })
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const method = match.params.id ? 'PATCH' : 'POST'
    const url = match.params.id ? `/financial_reports/${match.params.id}` : '/financial_reports'
    const data = {
      financial_report: inputs
    }
    apiCall.submitEntity(data, url, method)
      .then(() => {
        history.push(`/admin/financial-reports?symbol=${inputs.symbol}`)
      }).catch(() => {});
  }

  const handleFormInputChange = (event) => {
    setInputs((inputData) => ({ ...inputData, [event.target.name]: event.target.value }));
  }

  return (
    <>
      <Container className="mt--9 mb-5" fluid>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Financial Report</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleFormSubmit}>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Symbol</Label>
                        <Input type="select" value={inputs.symbol} name="symbol" onChange={handleFormInputChange} >
                          { symbolOptions.map((category, index) => {
                            return (<option key={String(index)} value={category.value}>{category.label}</option>)
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Shares Outstanding</Label>
                        <Input type="number" step="0.01" value={inputs.sharesOutstanding} name="sharesOutstanding" onChange={handleFormInputChange} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Year</Label>
                        <Input type="select" value={inputs.year} name="year" onChange={handleFormInputChange} >
                          { yearOptions.map((year, index) => {
                            return (<option key={String(index)} value={year.value}>{year.label}</option>)
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Quarter</Label>
                        <Input type="select" value={inputs.quarter} name="quarter" onChange={handleFormInputChange} >
                          { quarters.map((quarter, index) => {
                            return (<option key={String(index)} value={quarter.value}>{quarter.label}</option>)
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Net Interest Income</Label>
                        <Input type="number" step="0.01" value={inputs.netInterestIncome} name="netInterestIncome" onChange={handleFormInputChange} />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Net Profit</Label>
                        <Input type="number" step="0.01" value={inputs.netProfit} name="netProfit" onChange={handleFormInputChange} />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Distributable Profit</Label>
                        <Input type="number" step="0.01" value={inputs.distributableProfit} name="distributableProfit" onChange={handleFormInputChange} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <FormGroup>
                        <Label>Book Value</Label>
                        <Input type="number" step="0.01" value={inputs.bookValue} name="bookValue" onChange={handleFormInputChange} />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>EPS</Label>
                        <Input type="number" step="0.01" value={inputs.eps} name="eps" onChange={handleFormInputChange} />
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label>ROE</Label>
                        <Input type="number" step="0.01" value={inputs.roe} name="roe" onChange={handleFormInputChange} />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button type="submit" color="info">Submit</Button>
                  <Button color="secondary" onClick={() => history.push(`/admin/financial-reports${ match.params.id ? `?symbol=${inputs.symbol}` : ''}`)}>Cancel</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}