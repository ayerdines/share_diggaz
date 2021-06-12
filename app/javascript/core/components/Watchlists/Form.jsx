import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader, Col,
  Container,
  Row, FormGroup, Input, CardBody, Label, Form, Button,
} from "reactstrap";
import apiCall from "../../helpers/apiCall";
import moment from 'moment';

const initialStates = {
  symbol: 'API',
  quantity: 100,
  price: 100,
  businessDate: '',
  category: 'general',
  remarks: ''
}

export default function WatchlistForm({ match, history }) {
  const [categories, setCategories] = useState([])
  const [inputs, setInputs] = useState(initialStates);
  const [symbolOptions, setSymbolOptions] = useState([]);

  useEffect(() => {
    if (match.params.id) {
      apiCall.fetchEntities(`/watchlists/${match.params.id}`)
        .then((response) => {
          const { attributes } = response.data.data;
          const inputData = {
            symbol: attributes.symbol || '',
            quantity: attributes.quantity || 100,
            price: attributes.price || 100,
            businessDate: attributes.business_date ? moment(attributes.business_date).format('YYYY-MM-DD') : '',
            category: attributes.category || 'general',
            remarks: attributes.remarks || ''
          }
          setInputs(inputData);
        })
    }
    fetchSymbolOptions();
    categoryOptions();
  }, [])

  const fetchSymbolOptions = () => {
    apiCall.fetchEntities('/companies/symbols.json')
      .then((response) => {
        setSymbolOptions(response.data);
      })
  };

  const categoryOptions = () => {
    apiCall.fetchEntities('/watchlists/categories.json')
      .then((response) => {
        setCategories(response.data);
      })
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const method = match.params.id ? 'PATCH' : 'POST'
    const url = match.params.id ? `/watchlists/${match.params.id}` : '/watchlists'
    const data = {
      watchlist: inputs
    }
    apiCall.submitEntity(data, url, method)
      .then(() => {
        history.push('/admin/watchlists')
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
                <h3 className="mb-0">Watchlist</h3>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleFormSubmit}>
                  <Row>
                    <Col md="12">
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
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Category</Label>
                        <Input type="select" value={inputs.category} name="category" onChange={handleFormInputChange} >
                          { categories.map((category, index) => {
                            return (<option key={String(index)} value={category.value}>{category.label}</option>)
                          })}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>Business Date</Label>
                        <Input
                          type="date"
                          name="businessDate"
                          value={inputs.businessDate}
                          onChange={handleFormInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Remarks</Label>
                        <Input type="textarea" name="remarks" value={inputs.remarks} onChange={handleFormInputChange}/>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button type="submit" color="info">Submit</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}