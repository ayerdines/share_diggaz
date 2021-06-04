import React, {useEffect, useMemo, useState} from 'react';
import apiCall from "../../helpers/apiCall";
import { Card, CardHeader, Col, Container, Input, Row } from "reactstrap";
import ReactTable from '../ReactTable';
import Select from 'react-select';

export default function Index({}) {
  const [sector, setSector] = useState('commercial_banks')
  const [sectorOptions, setSectorOptions] = useState([]);
  const [symbolOptions, setSymbolOptions] = useState([])
  const [selectedSymbols, setSelectedSymbols] = useState([])
  const [financialReports, setFinancialReports] = useState([]);

  useEffect(() => {
    apiCall.fetchEntities('/financial_reports.json', { sector: sector, ratios: true })
      .then((response) => {
        const { data } = response.data;
        setFinancialReports(data.map((datum) => datum.attributes));
      }).catch(() => {});
  }, [sector])

  useEffect(() => {
    fetchSymbolOptions();
    fetchSectorOptions();
  }, [])

  const fetchSectorOptions = () => {
    apiCall.fetchEntities('/companies/sector_options.json')
      .then((response) => {
        const { data } = response;
        setSectorOptions(data);
      }).catch(() => {});
  }

  const fetchSymbolOptions = () => {
    apiCall.fetchEntities('/companies/symbol_options.json')
      .then((response) => {
        const { data } = response;
        const optionsData = data.map((company) => {
          return { label: `${company.symbol}`, value: company.symbol, sector: company.sector }
        })
        setSymbolOptions(optionsData);
        setSelectedSymbols(optionsData.filter((d) => d.sector === sector))
      }).catch(() => {});
  }

  const toggleSector = (event) => {
    setSector(event.target.value);
    setSelectedSymbols(symbolOptions.filter((d) => d.sector === event.target.value))
  }

  const handleSymbolsChange = (options) => {
    setSelectedSymbols(options);
  }

  const data = useMemo(() => (
    financialReports.filter((report) => selectedSymbols.map((s) => s.value).includes(report.symbol))
  ), [financialReports, selectedSymbols]);

  const columns = useMemo(
    () => [
      {
        Header: 'Symbol',
        accessor: 'symbol',
        style: {
          left: 0,
          background: 'white',
          position: 'sticky'
        },
      },
      {
        Header: 'LTP',
        accessor: 'close_price',
      },
      {
        Header: 'EPS',
        accessor: 'eps',
        sortDescFirst: true
      },
      {
        Header: 'P/E',
        accessor: 'pe'
      },
      {
        Header: 'Book Value',
        accessor: 'book_value',
        sortDescFirst: true
      },
      {
        Header: 'PBV',
        accessor: 'pbv',
      },
      {
        Header: 'ROE',
        accessor: 'roe',
        sortDescFirst: true
      },
  ], [financialReports, selectedSymbols])

  return (
    <>
      <Container className="mt--9 mb-5" fluid>
        <Row>
          <Col md={3}>
            <Input type="select" bsSize="md" onChange={toggleSector}>
              { sectorOptions.map((sector, index) => <option key={String(index)} value={sector.value}>{sector.label}</option> )}
            </Input>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={9}>
            <Select
              isMulti
              name="colors"
              value={selectedSymbols}
              options={symbolOptions.filter((d) => d.sector === sector)}
              onChange={handleSymbolsChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="mt-5">
              <Col>
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <h3 className="mb-0">Price Histories</h3>
                  </CardHeader>
                  <ReactTable columns={columns} data={data} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}